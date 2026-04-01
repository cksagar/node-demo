import { Request, Response } from 'express';
import {db} from '../db'
import { usersTable } from '../models';
import { eq } from 'drizzle-orm';
import {createHmac, randomBytes} from 'crypto';

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


export async function createUser(req: Request, res: Response) {
  const {name, email, password} = req.body;
  if(!name || !email || !password) {
    res.status(400).json({message:"All fields are required"});
    return;
  }

  const [existingUser] = await db.select().from(usersTable)
  .where(eq(usersTable.email, email)).limit(1);

  if(existingUser) {
    res.status(400).json({message:"User already exists"});
    return;
  }
  

  const salt = randomBytes(256).toString('hex');

  const hashedPassword = createHmac('sha512', salt).update(password).digest('hex');
  
  const [newUser] = await db.insert(usersTable)
  .values({name, email, password: hashedPassword, salt})
  .returning({id: usersTable.id});
   res.status(201).json({status:'success', data: {userId: newUser.id}});
}


