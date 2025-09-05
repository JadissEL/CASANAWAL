// ITÉRATION 3: Middleware de validation avancée enterprise-grade
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Schémas de validation Zod ultra-robustes
const ProductUpdateSchema = z.object({
  sku: z.string()
    .min(2, 'SKU doit contenir au moins 2 caractères')
    .max(50, 'SKU ne peut pas dépasser 50 caractères')
    .regex(/^[A-Z0-9_-]+$/i, 'SKU ne peut contenir que des lettres, chiffres, tirets et underscores')
    .optional(),
    
  base_price: z.number()
    .min(0, 'Le prix ne peut pas être négatif')
    .max(9999.99, 'Le prix ne peut pas dépasser 9999.99 DHS')
    .multipleOf(0.01, 'Le prix doit avoir au maximum 2 décimales')
    .optional(),
    
  category_id: z.string()
    .uuid('ID de catégorie invalide')
    .optional(),
    
  is_active: z.boolean().optional(),
  is_vegetarian: z.boolean().optional(),
  is_spicy: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  
  prep_time_minutes: z.number()
    .int('Le temps de préparation doit être un nombre entier')
    .min(1, 'Le temps de préparation doit être au moins 1 minute')
    .max(999, 'Le temps de préparation ne peut pas dépasser 999 minutes')
    .optional(),
    
  sort_order: z.number()
    .int('L\'ordre d\'affichage doit être un nombre entier')
    .min(0, 'L\'ordre d\'affichage ne peut pas être négatif')
    .max(9999, 'L\'ordre d\'affichage ne peut pas dépasser 9999')
    .optional(),
    
  product_name: z.string()
    .min(2, 'Le nom du produit doit contenir au moins 2 caractères')
    .max(255, 'Le nom du produit ne peut pas dépasser 255 caractères')
    .regex(/^[a-zA-Z0-9\s\u00C0-\u017F\u0600-\u06FF\-'.,!?]+$/u, 'Le nom contient des caractères non autorisés')
    .optional(),
    
  description: z.string()
    .max(2000, 'La description ne peut pas dépasser 2000 caractères')
    .optional()
}).strict(); // Rejette les propriétés inconnues

// Rate limiting spécifique aux modifications
interface RateLimitData {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitData>();

export const productUpdateRateLimit = (maxRequests: number = 10, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    // Nettoyer les anciennes entrées
    for (const [ip, data] of rateLimitMap.entries()) {
      if (now > data.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
    
    const clientData = rateLimitMap.get(clientIP);
    
    if (!clientData) {
      rateLimitMap.set(clientIP, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (clientData.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Trop de modifications de produits. Veuillez attendre avant de réessayer.',
        error: 'RATE_LIMIT_EXCEEDED',
        code: 'TOO_MANY_REQUESTS',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }
    
    clientData.count++;
    next();
  };
};

// Validation middleware principal
export const validateProductUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validation des paramètres d'URL
    const { id } = req.params;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!id || !uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de produit invalide',
        error: 'INVALID_PRODUCT_ID',
        code: 'VALIDATION_ERROR',
        details: 'L\'ID doit être un UUID valide'
      });
    }
    
    // Validation du body avec Zod
    const validationResult = ProductUpdateSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Données de validation échouées',
        error: 'VALIDATION_FAILED',
        code: 'VALIDATION_ERROR',
        errors: errors
      });
    }
    
    // Vérification qu'au moins un champ est fourni
    const hasData = Object.keys(validationResult.data).length > 0;
    if (!hasData) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à modifier fournie',
        error: 'NO_UPDATE_DATA',
        code: 'VALIDATION_ERROR'
      });
    }
    
    // Ajouter les données validées à req pour utilisation dans le contrôleur
    req.validatedData = validationResult.data;
    next();
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur de validation interne',
      error: 'VALIDATION_INTERNAL_ERROR',
      code: 'SERVER_ERROR'
    });
  }
};

// Middleware de logging avancé
export const logProductUpdate = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Override de res.json pour capturer la réponse
  const originalJson = res.json;
  res.json = function(obj: any) {
    const duration = Date.now() - startTime;
    
    // Log structuré
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      productId: req.params.id,
      userId: req.user?.id || 'anonymous',
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      duration: duration,
      statusCode: res.statusCode,
      success: obj.success || false,
      changesRequested: Object.keys(req.body || {}).length,
      changesApplied: obj.meta?.changesCount || 0
    };
    
    if (res.statusCode >= 400) {
      console.error('Product update error:', logData);
    } else {
      console.log('Product update success:', logData);
    }
    
    return originalJson.call(this, obj);
  };
  
  next();
};

// Déclaration du type pour TypeScript
declare global {
  namespace Express {
    interface Request {
      validatedData?: any;
      user?: { id: string };
    }
  }
}

export default {
  validateProductUpdate,
  productUpdateRateLimit,
  logProductUpdate
};
