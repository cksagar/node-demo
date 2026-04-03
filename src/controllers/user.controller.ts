import { Request, Response } from 'express';
import { db } from '../db';
import { usersTable } from '../models';
import { eq } from 'drizzle-orm';
import { createHmac } from 'crypto';
import signupPostRequestSchema from '../schemas/signupPostRequestSchema';
import jwt from 'jsonwebtoken';
import { hashPasswordWithSalt } from '../utils/hash-creation';

// export async function signup(req: Request, res: Response) {
//   const  { name, email, password} = req.body

//  const DIARY: Record<string, {name: string, email: string, password: string}> = {};
//  const EMAIL_DIARY = new Set();

//   if(!name || !email || !password) {
//     res.status(400).json({message:"All fields are required"});
//     return;
//   }

//   if(EMAIL_DIARY.has(email)){
//     res.json({message: "Email Allready exists."});
//     return;
//   }

//   const token = `${Date.now()}`;

//   DIARY[token] = {name, email, password};
//   EMAIL_DIARY.add(email);
//   res.json({message: "User created successfully", user: {token}});
// return;
// };

export async function signup(req: Request, res: Response) {
  const validated = await signupPostRequestSchema.safeParseAsync(req.body);
  if (!validated.success) {
    res.status(400).json({ message: validated.error.message });
    return;
  }
  const { name, email, password } = validated.data;

  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existingUser) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const { salt, password: hashedPassword } = hashPasswordWithSalt(password);

  const [newUser] = await db
    .insert(usersTable)
    .values({ name, email, password: hashedPassword, salt })
    .returning({ id: usersTable.id });
  res.status(201).json({ status: 'success', data: { userId: newUser.id } });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  const [existingUser] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
      password: usersTable.password,
      salt: usersTable.salt,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!existingUser) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const hashedPassword = createHmac('sha512', existingUser.salt).update(password).digest('hex');
  if (hashedPassword !== existingUser.password) {
    res.status(400).json({ message: 'Invalid password' });
    return;
  }

  const payload = {
    userId: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' }); // 1 hour expiration

  res
    .status(200)
    .json({ status: 'success', data: { token }, message: 'User logged in successfully' });
}
