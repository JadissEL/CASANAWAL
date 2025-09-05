import { RequestHandler } from "express";
import { z } from "zod";
import { AuthService } from "../middleware/auth";
import { db } from "../database/connection";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const ChangePasswordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8)
});

// Admin login
export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    const result = await AuthService.authenticate(email, password);

    if (!result) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      data: {
        user: result.user,
        token: result.token
      },
      message: 'Login successful'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
};

// Get current user profile
export const getProfile: RequestHandler = async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    const user = await AuthService.findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
};

// Change password
export const changePassword: RequestHandler = async (req: any, res) => {
  try {
    const { current_password, new_password } = ChangePasswordSchema.parse(req.body);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    const user = await AuthService.findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await AuthService.verifyPassword(
      current_password,
      user.password_hash
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Hash new password and update
    const newPasswordHash = await AuthService.hashPassword(new_password);

    await db.query(
      'UPDATE admin_users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newPasswordHash, user.id]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password'
    });
  }
};

// Logout (client-side token removal, but we can blacklist tokens if needed)
export const logout: RequestHandler = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};
