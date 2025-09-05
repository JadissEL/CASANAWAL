import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../database/connection";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions: any;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'super_admin' | 'content_manager' | 'order_manager';
  permissions: any;
  created_at: Date;
  last_login?: Date;
  is_active: boolean;
}

export class AuthService {
  private static jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  static generateToken(user: Omit<AdminUser, 'password_hash'>): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      },
      this.jwtSecret,
      { expiresIn: '24h' }
    );
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static async findUserByEmail(email: string): Promise<AdminUser | null> {
    const result = await db.query(
      'SELECT * FROM admin_users WHERE email = $1 AND is_active = true',
      [email]
    );
    return result.rows[0] || null;
  }

  static async findUserById(id: string): Promise<AdminUser | null> {
    const result = await db.query(
      'SELECT * FROM admin_users WHERE id = $1 AND is_active = true',
      [id]
    );
    return result.rows[0] || null;
  }

  static async updateLastLogin(id: string): Promise<void> {
    await db.query(
      'UPDATE admin_users SET last_login = NOW() WHERE id = $1',
      [id]
    );
  }

  static async authenticate(email: string, password: string): Promise<{
    user: Omit<AdminUser, 'password_hash'>;
    token: string;
  } | null> {
    const user = await this.findUserByEmail(email);
    
    if (!user || !await this.verifyPassword(password, user.password_hash)) {
      return null;
    }

    await this.updateLastLogin(user.id);

    const { password_hash, ...userWithoutPassword } = user;
    const token = this.generateToken(userWithoutPassword);

    return {
      user: userWithoutPassword,
      token
    };
  }
}

// Middleware to verify JWT token
export const authenticateToken: RequestHandler = async (req: any, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  try {
    const decoded = AuthService.verifyToken(token);
    const user = await AuthService.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token - user not found'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    };

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

// Middleware to check user roles
export const requireRole = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Middleware to check specific permissions
export const requirePermission = (permission: string) => {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const permissions = req.user.permissions || {};
    
    if (!permissions[permission] && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: `Missing permission: ${permission}`
      });
    }

    next();
  };
};
