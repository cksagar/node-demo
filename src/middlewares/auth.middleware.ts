import { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';

function isPublicRoute(req: Request): boolean {
  const { path, method } = req;
  if (method === 'GET' && (path === '/' || path === '/about' || path === '/tweets')) {
    return true;
  }
  if (method === 'POST' && path === '/tweets') {
    return true;
  }
  if (method === 'POST' && (path === '/user/signup' || path === '/user/login')) {
    return true;
  }
  return false;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (isPublicRoute(req)) {
    next();
    return;
  }

  const tokenHeader = req.headers['authorization'];

  if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Invalid token format' });
    return;
  }

  const token = tokenHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    Object.assign(req, { user: decoded });
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authMiddleware;
