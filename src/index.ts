import 'dotenv/config';
import express, { type Application, type Request, type Response } from 'express';
import timeLogging from './middlewares/time-logging';
import booksRouter from './routes/books.routes';

const app: Application = express();
const PORT = 5000;

app.use(express.json());
app.use('/books', booksRouter);


// call the middleware to log the request time, method, url
app.use(timeLogging);

app.get('/', (req: Request, res: Response)=>{
  res.send('your are at homepage');
})

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
