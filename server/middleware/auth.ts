import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'farunqingmiao_secret_key_2024';

export interface AuthRequest extends Request {
  admin?: {
    id: number;
    username: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      username: string;
      role: string;
    };
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: '认证令牌无效或已过期' });
  }
};

export const generateToken = (admin: { id: number; username: string; role: string }) => {
  return jwt.sign(admin, JWT_SECRET, { expiresIn: '7d' });
};

export default authMiddleware;
