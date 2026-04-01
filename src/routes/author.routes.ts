import express from 'express';
import { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor, getBooksByAuthorId } from '../controllers/author.controller';

const router = express.Router();

router.get('/', getAllAuthors);
router.get('/:id', getAuthorById);
router.get('/:id/books', getBooksByAuthorId);
router.post('/', createAuthor);
router.put('/:id', updateAuthor);
router.delete('/:id', deleteAuthor);

export default router;