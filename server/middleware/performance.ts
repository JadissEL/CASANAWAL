import { Request, Response, NextFunction } from 'express';
import { db } from '../database/connection';

interface PerformanceMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  requestSize: number;
  responseSize: number;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
}

interface CacheConfig {
  ttl: number;
  key: string;
  tags?: string[];
}

// Simple cache implementation
class SimpleCache {
  private cache = new Map<string, { data: any; expires: number; tags: string[] }>();
  private stats = { hits: 0, misses: 0, sets: 0 };

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expires) { if (item) this.cache.delete(key); this.stats.misses++; return null; }
    this.stats.hits++; return item.data;
  }
  set(key: string, data: any, ttl: number = 300, tags: string[] = []): void { this.cache.set(key, { data, expires: Date.now() + (ttl * 1000), tags }); this.stats.sets++; }
  delete(key: string): void { this.cache.delete(key); }
  clear(): void { this.cache.clear(); }
  invalidateByTag(tag: string): void { for (const [key, item] of this.cache.entries()) { if (item.tags.includes(tag)) this.cache.delete(key); } }
  getStats() { return { ...this.stats, size: this.cache.size, hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0 }; }
  cleanup(): void { const now = Date.now(); for (const [key, item] of this.cache.entries()) { if (now > item.expires) this.cache.delete(key); } }
}

// Performance monitoring
class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 1000;

  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) this.metrics = this.metrics.slice(-this.maxMetrics);
    if (metric.responseTime > 1000) console.warn(`🐌 Slow request: ${metric.method} ${metric.endpoint} - ${metric.responseTime}ms`);
  }
  getStats(minutes: number = 15): any {
    const since = Date.now() - (minutes * 60 * 1000);
    const recentMetrics = this.metrics.filter(m => m.timestamp.getTime() > since);
    if (recentMetrics.length === 0) return { totalRequests: 0, averageResponseTime: 0, errorRate: 0, requestsPerMinute: 0 };
    const totalRequests = recentMetrics.length;
    const totalResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0);
    const errorCount = recentMetrics.filter(m => m.statusCode >= 400).length;
    return { totalRequests, averageResponseTime: totalResponseTime / totalRequests, errorRate: (errorCount / totalRequests) * 100, requestsPerMinute: totalRequests / minutes, p95ResponseTime: this.getPercentile(recentMetrics.map(m => m.responseTime), 95), p99ResponseTime: this.getPercentile(recentMetrics.map(m => m.responseTime), 99) };
  }
  private getPercentile(values: number[], percentile: number): number { const sorted = values.sort((a, b) => a - b); const index = Math.ceil((percentile / 100) * sorted.length) - 1; return sorted[index] || 0; }
}

const cache = new SimpleCache();
const performanceMonitor = new PerformanceMonitor();

// Cleanup cache periodically
setInterval(() => cache.cleanup(), 60000);

// Compression middleware (simplified)
export const compressionMiddleware = (req: Request, res: Response, next: NextFunction) => { if (req.headers['accept-encoding']?.includes('gzip') && !req.headers['x-no-compression']) res.setHeader('Content-Encoding', 'gzip'); next(); };

// Performance tracking middleware
export const performanceTracking = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const originalSend = res.send;
  let responseSize = 0;

  res.send = function(data: any) {
    responseSize = Buffer.byteLength(data || '', 'utf8');
    return originalSend.call(this, data);
  };

  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const requestSize = parseInt(req.get('content-length') || '0');
    performanceMonitor.recordMetric({
      endpoint: req.path, method: req.method, responseTime, statusCode: res.statusCode,
      requestSize, responseSize, timestamp: new Date(), userAgent: req.get('User-Agent'), ip: req.ip
    });
  });

  next();
};

// Cache middleware
export const cacheMiddleware = (config: CacheConfig) => (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== 'GET') return next();

    const cacheKey = config.key || `${req.method}:${req.originalUrl}`;
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse) {
      res.set('X-Cache', 'HIT');
      res.set('Cache-Control', `public, max-age=${config.ttl}`);
      return res.json(cachedResponse);
    }

    const originalJson = res.json;
    res.json = function(data: any) {
      if (res.statusCode === 200) {
        cache.set(cacheKey, data, config.ttl, config.tags);
        res.set('X-Cache', 'MISS');
      }
      res.set('Cache-Control', `public, max-age=${config.ttl}`);
      return originalJson.call(this, data);
    };

    next();
};

// Static cache headers
export const staticCacheHeaders = (maxAge: number = 86400) => (req: Request, res: Response, next: NextFunction) => {
    if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      res.set('Cache-Control', `public, max-age=${maxAge}`);
      res.set('Expires', new Date(Date.now() + maxAge * 1000).toUTCString());
    }
    next();
};

// Performance monitoring endpoint
export const performanceEndpoint = (req: Request, res: Response) => {
  const stats = performanceMonitor.getStats();
  const cacheStats = cache.getStats();
  res.json({ performance: stats, cache: cacheStats, uptime: process.uptime(), memory: process.memoryUsage() });
};

// Health check endpoint
export const healthCheck = (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), uptime: process.uptime() });
};

export { cache, performanceMonitor };