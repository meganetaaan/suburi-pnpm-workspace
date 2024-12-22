import { z } from "zod";

export const userId = z.string().brand<"UserId">();
export type UserId = z.infer<typeof userId>;
export const userSchema = z.object({
	id: userId,
	name: z.string().nonempty().max(10),
	email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;
