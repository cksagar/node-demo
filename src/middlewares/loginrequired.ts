import { Request, Response, NextFunction } from 'express';
import { getUser } from '../service/auth'; // assumes userSessionMap logic
import { UserRequestBody } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: UserRequestBody;
}
function loginRequired(req: Request, res: Response, next: NextFunction) {
  const userId = req.cookies?.uid;

  if (!userId) {
    return res.redirect('/login'); // ⛔ Don't pass error here; redirect only
  }

  const user = getUser(userId);
  if (!user) {
    return res.redirect('/login');
  }

  next(); // ✅ allow the request to continue
}

export default loginRequired;
