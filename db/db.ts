import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from "./migrations/schema"

export const db = drizzle(sql, {schema});