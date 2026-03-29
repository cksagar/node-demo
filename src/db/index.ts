import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { booksTable, authorsTable } from '../models/index';

export const db = drizzle(process.env.DATABASE_URL!, { schema: { ...booksTable, ...authorsTable } });
