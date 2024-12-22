import { z } from "zod";

export const userSchema = z.object({
	id: z.string().brand<"UserId">(),
	name: z.string().nonempty().max(10),
	email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;
export type UserId = User["id"];
