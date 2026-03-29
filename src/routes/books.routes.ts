import express from 'express';
import { listBooks, createBook, deleteBook, getBookById } from '../controllers/book.controller';

const router = express.Router();

router.get('/', listBooks);

router.get('/:id', getBookById);

router.post('/', createBook);

router.delete('/:id', deleteBook);

export default router;
