import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { booksTable, authorsTable, usersTable, userSessionsTable } from '../models/index';

export const db = drizzle(process.env.DATABASE_URL!, { schema: { ...booksTable, ...authorsTable, ...usersTable, ...userSessionsTable } });
