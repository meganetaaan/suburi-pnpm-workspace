import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { type User, userSchema } from "@project/domain";

export class UserRepository {
	constructor(private readonly dbInstance = db) {}

	async getAll(): Promise<User[]> {
		const results = await this.dbInstance.select().from(usersTable);
		return results.map((row) => userSchema.parse(row));
	}

	async getById(id: string): Promise<User | null> {
		const result = await this.dbInstance
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, id))
			.limit(1);
		if (result.length === 0) return null;
		return userSchema.parse(result[0]);
	}

	async upsert(user: User): Promise<void> {
		userSchema.parse(user);
		await this.dbInstance
			.insert(usersTable)
			.values(user)
			.onConflictDoUpdate({
				target: usersTable.id,
				set: {
					...user,
				},
			});
	}

	async deleteById(id: string): Promise<void> {
		await this.dbInstance.delete(usersTable).where(eq(usersTable.id, id));
	}
}
