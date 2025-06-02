import express from 'express';
import { PORT } from './constant';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Express + TypeScript!');
});

app.listen(PORT, () => {
  console.log("hellow world");

  console.log(`Server running on http://localhost:${PORT}`);
});
