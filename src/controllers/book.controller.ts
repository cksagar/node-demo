
import {Request, Response} from 'express';
import { eq } from 'drizzle-orm';
import { sql } from "drizzle-orm";

import { db } from '../db';
import {booksTable} from '../models/book.model';
import { authorsTable } from '../models/author.model';

export async function listBooks(req: Request, res: Response){
    const searchQuery = req.query.title;

    if (searchQuery && typeof searchQuery !== 'string') {
        res.status(400).json({ message: 'Search query must be a string' });
        return;
    }

    try {
        if (searchQuery) {
            const searchResult = await db
                .select()
                .from(booksTable)
                .where(sql`to_tsvector('english', ${booksTable.title}) @@ plainto_tsquery('english', ${searchQuery})`);
                console.log('searchResult',searchResult);

            res.json(searchResult);
            return;
        }
        const books = await db.select().from(booksTable);
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getBookById(req: Request, res: Response) {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
        res.status(400).json({ message: 'Book id is required' });
        return;
    }

    try {
        const rows = await db.select()
        .from(booksTable)
        .where(eq(booksTable.id, id))
        .leftJoin(authorsTable, eq(booksTable.authorId, authorsTable.id))
        .limit(1);
        const book = rows[0];
        if (!book) {
            res.status(404).json({ message: `Book with ${id} not found` });
            return;
        }
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function createBook(req: Request, res: Response) {
    const { title, description, authorId } = req.body;
    if (!title ||  title ==='') {
        res.status(400).json({ message: 'title is required' });
        return;
    }

    try {
        const [inserted] = await db
            .insert(booksTable)
            .values({ title, description, authorId })
            .returning({id: booksTable.id});
        res.status(201).json({ message: 'Book created successfully', book: inserted.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteBook(req: Request, res: Response) {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
        res.status(400).json({ message: 'Book id is required' });
        return;
    }

    try {
        const deletedRows = await db.delete(booksTable)
        .where(eq(booksTable.id, id))
        .returning();
        const book = deletedRows[0];
        if (!book) {
            res.status(404).json({ message: `Book with id ${id} not found` });
            return;
        }
        res.status(200).json({ message: `Book with ${id} deleted successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

