import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { db } from '../database/connection';

interface SecurityEvent {
  type: 'rate_limit' | 'sql_injection' | 'xss_attempt' | 'invalid_auth' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip: string;
  userAgent: string;
  endpoint: string;
  details: Record<string, any>;
  userId?: string;
}

const securityConfig = {
  rateLimitWindow: 15 * 60 * 1000,
  rateLimitMax: process.env.NODE_ENV === 'production' ? 100 : 1000,
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:8080'],
  enableSqlInjectionProtection: true,
  enableXssProtection: true,
  logSecurityEvents: true
};

// Validation schemas
export const secureStringSchema = z.string().max(1000).refine((value) => !containsSqlInjection(value) && !containsXssAttempt(value), { message: 'Contenu suspect détecté' });
export const secureEmailSchema = z.string().email('Format email invalide').max(255).transform(val => val.toLowerCase());
export const securePhoneSchema = z.string().regex(/^(\+212|0)[5-7]\d{8}$/, 'Format de téléphone marocain invalide');
export const secureIdSchema = z.string().uuid('Format UUID invalide');

// Attack detection
function containsSqlInjection(input: string): boolean {
  if (!securityConfig.enableSqlInjectionProtection) return false;
  return [/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i, /(--|\s#|\s\/\*|\*\/)/i, /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i, /(\bor\b\s+\btrue\b|\bor\b\s+\b1\s*=\s*1\b)/i].some(pattern => pattern.test(input));
}
function containsXssAttempt(input: string): boolean {
  if (!securityConfig.enableXssProtection) return false;
  return [/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, /javascript:/gi, /on\w+\s*=/gi].some(pattern => pattern.test(input));
}
function detectSuspiciousActivity(req: Request): boolean {
  return [req.path.includes('/auth/') && req.method === 'POST', req.path.includes('wp-admin') || req.path.includes('phpmyadmin'), req.get('User-Agent')?.includes('sqlmap') || req.get('User-Agent')?.includes('nmap'), Object.values(req.query).some(val => typeof val === 'string' && (containsSqlInjection(val) || containsXssAttempt(val)))].some(Boolean);
}

// Security logging
async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  if (!securityConfig.logSecurityEvents) return;
  try {
    await db.query(`INSERT INTO security_logs (event_type, severity, ip_address, user_agent, endpoint, details, user_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`, [event.type, event.severity, event.ip, event.userAgent, event.endpoint, JSON.stringify(event.details), event.userId || null]);
    if (event.severity === 'critical') console.error('🚨 CRITICAL SECURITY EVENT:', event);
  } catch (error) { console.error('Failed to log security event:', error); }
}

// Security headers
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};
// CORS middleware
export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.get('Origin');
  if (!origin || securityConfig.corsOrigins.includes(origin) || (process.env.NODE_ENV === 'development' && origin.includes('localhost'))) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
};

// Simple rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
export const createRateLimit = (options: { windowMs?: number; max?: number; message?: string }) => (req: Request, res: Response, next: NextFunction) => {
  const key = req.ip;
  const now = Date.now();
  const windowMs = options.windowMs || securityConfig.rateLimitWindow;
  const max = options.max || securityConfig.rateLimitMax;
  
  const record = rateLimitStore.get(key);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return next();
  }
  
  if (record.count >= max) {
    logSecurityEvent({ type: 'rate_limit', severity: 'medium', ip: req.ip, userAgent: req.get('User-Agent') || '', endpoint: req.path, details: { method: req.method, limit: max } });
    return res.status(429).json({ error: options.message || 'Trop de requêtes, veuillez réessayer plus tard', code: 'RATE_LIMIT_EXCEEDED' });
  }
  
  record.count++;
  next();
};

// Specialized rate limits
export const authRateLimit = createRateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes' });
export const apiRateLimit = createRateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Quota d\'API dépassé' });
export const uploadRateLimit = createRateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: 'Trop d\'uploads, veuillez réessayer dans 1 heure' });

// Input validation
export const validateInput = (schema: z.ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body && Object.keys(req.body).length > 0) req.body = await schema.parseAsync(req.body);
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === 'string' && (containsSqlInjection(value) || containsXssAttempt(value))) {
        await logSecurityEvent({ type: 'sql_injection', severity: 'high', ip: req.ip, userAgent: req.get('User-Agent') || '', endpoint: req.path, details: { parameter: key, value } });
        return res.status(400).json({ error: 'Paramètre suspect détecté', code: 'INVALID_INPUT' });
      }
    }
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      await logSecurityEvent({ type: 'invalid_auth', severity: 'low', ip: req.ip, userAgent: req.get('User-Agent') || '', endpoint: req.path, details: { validationErrors: error.errors } });
      return res.status(400).json({ error: 'Données invalides', details: error.errors });
    }
    next(error);
  }
};

// Security monitoring
export const securityMonitoring = async (req: Request, res: Response, next: NextFunction) => {
  if (detectSuspiciousActivity(req)) await logSecurityEvent({ type: 'suspicious_activity', severity: 'high', ip: req.ip, userAgent: req.get('User-Agent') || '', endpoint: req.path, details: { method: req.method, query: req.query, headers: req.headers } });
  next();
};

// IP blocking
const blockedIPs = new Set<string>();
export const ipBlocking = (req: Request, res: Response, next: NextFunction) => { if (blockedIPs.has(req.ip)) return res.status(403).json({ error: 'Accès bloqué', code: 'IP_BLOCKED' }); next(); };

// Request sanitization
export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/javascript:/gi, '').trim();
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) sanitized[key] = sanitize(value);
      return sanitized;
    }
    return obj;
  };
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  next();
};

export { securityConfig, logSecurityEvent, containsSqlInjection, containsXssAttempt, detectSuspiciousActivity };