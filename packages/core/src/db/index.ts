// Make sure to install the 'pg' package
import { drizzle } from "drizzle-orm/node-postgres";

if (process.env.DATABASE_URL == null) {
	throw new Error("DATABASE_URL is empty");
}

export const db = drizzle(process.env.DATABASE_URL);
