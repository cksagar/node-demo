import 'dotenv/config';
import express, { type Application, type Request, type Response } from 'express';
import timeLogging from './middlewares/time-logging';
import booksRouter from './routes/books.routes';
import authorsRouter from './routes/author.routes';
import userRouter from './routes/user.routes';
import authMiddleware from './middlewares/auth.middleware';

const app: Application = express();
const PORT = 5000;

app.use(express.json());
app.use(timeLogging);

app.use(authMiddleware);

app.get('/', (req: Request, res: Response) => {
  res.send('server is running');
});

app.use('/user', userRouter);
app.use('/books', booksRouter);
app.use('/authors', authorsRouter);

app.get('/about', (req: Request, res: Response) => {
  res.send('your are at about page');
});

app.get('/tweets', (req: Request, res: Response) => {
  res.send('your are at tweets page');
});

app.post('/tweets', (req: Request, res: Response) => {
  res.send('your are at tweets page');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
