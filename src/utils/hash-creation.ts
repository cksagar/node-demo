import { createHmac, randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
export function hashPasswordWithSalt(password: string) {
  const salt = randomBytes(256).toString('hex');

  const hashedPassword = createHmac('sha512', salt).update(password).digest('hex');

  return { salt, password: hashedPassword };
}

export function validateHashAndGenerateToken(salt: string, password: string) {
  const hashedPassword = createHmac('sha512', salt).update(password).digest('hex');
  return hashedPassword;
}

export function generateToken(payload: { userId: string; email: string; name: string }) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
}
