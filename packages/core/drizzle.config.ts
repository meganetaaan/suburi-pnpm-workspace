import { defineConfig } from "drizzle-kit";

if (process.env.DATABASE_URL == null) {
	throw new Error("DATABASE_URL is empty");
}

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
});
