import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { authorsTable } from '../models/author.model';
import { booksTable } from '../models/book.model';


export async function getAllAuthors(req: Request, res: Response) {
    const authors = await db.select().from(authorsTable);
    res.json(authors);
}

// get author by id
export async function getAuthorById(req: Request, res: Response) {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
        res.status(400).json({ message: 'Author id is required' });
        return;
    }
    const author = await db.select().from(authorsTable).where(eq(authorsTable.id, id)).limit(1);
    res.json(author);
}

// get books by author id
export async function getBooksByAuthorId(req: Request, res: Response) {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
        res.status(400).json({ message: 'Author id is required' });
        return;
    }
    const books = await db.select().from(booksTable).where(eq(booksTable.authorId, id)).limit(100);
    res.json(books);
}

export async function createAuthor(req: Request, res: Response) {
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }
    const author = await db.insert(authorsTable).values({ firstName, lastName, email }).returning({ id: authorsTable.id });
    res.status(201).json({ message: 'Author created successfully', author: author[0].id });
}

export async function updateAuthor(req: Request, res: Response) {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
        res.status(400).json({ message: 'Author id is required' });
        return;
    }
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }
    const author = await db.update(authorsTable).set({ firstName, lastName, email }).where(eq(authorsTable.id, id)).returning();
    res.json(author);
}

export async function deleteAuthor(req: Request, res: Response) {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
        res.status(400).json({ message: 'Author id is required' });
        return;
    }
    const author = await db.delete(authorsTable).where(eq(authorsTable.id, id)).returning();
    res.json(author);
}