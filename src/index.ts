import 'dotenv/config';
import express, { type Application, type Request, type Response } from 'express';
import timeLogging from './middlewares/time-logging';
import booksRouter from './routes/books.routes';
import authorsRouter from './routes/author.routes';
import userRouter from './routes/user.routes';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { usersTable } from './models';
import { eq } from 'drizzle-orm';
import { createHmac } from 'node:crypto';
import authMiddleware from './middlewares/auth.middleware';


const app: Application = express();
const PORT = 5000;

app.use(express.json());
app.use(timeLogging);

app.use(authMiddleware);


app.get('/', (req: Request, res: Response)=>{
  res.send('server is running');
})


app.post('/login', async (req: Request, res: Response) => {
  const {email, password} = req.body;
  if(!email || !password) {
    res.status(400).json({message:"All fields are required"});
    return;
  }

  const [existingUser] = await db.select({
    id: usersTable.id,
    email: usersTable.email, 
    name: usersTable.name,
    password: usersTable.password,
    salt: usersTable.salt}).from(usersTable)
  .where(eq(usersTable.email, email)).limit(1);

  if(!existingUser) {
    res.status(404).json({message:"User not found"});
    return;
  }

  const hashedPassword = createHmac('sha512', existingUser.salt).update(password).digest('hex');
  if(hashedPassword !== existingUser.password) {
    res.status(400).json({message:"Invalid password"});
    return;
  }

  const payload = {
    userId: existingUser.id,
    email: existingUser.email,
    name: existingUser.name
  }

  const token  = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: '1h'});  // 1 hour expiration

  res.status(200).json({status:'success', data: { token}, message:"User logged in successfully"});
});

app.use('/user', userRouter);
app.use('/books', booksRouter);
app.use('/authors', authorsRouter);

app.get('/about', (req: Request, res: Response)=>{
  res.send('your are at about page');
})

app.get('/tweets', (req: Request, res: Response)=>{
  res.send('your are at tweets page');
})

app.post('/tweets', (req: Request, res: Response)=>{
  res.send('your are at tweets page');
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
