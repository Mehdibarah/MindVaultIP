import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'user' | 'expert' | 'admin' | 'system';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    
    const decoded = jwt.verify(token, secret) as any;
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const requireExpert = requireRole(['expert', 'admin']);
export const requireAdmin = requireRole(['admin']);
export const requireSystem = requireRole(['system', 'admin']);
