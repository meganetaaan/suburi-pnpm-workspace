import { Hono } from "hono";
import type { z } from "zod";
import { type User, type UserId, userSchema } from "@project/domain";
import { zValidator } from "@hono/zod-validator";
import { nanoid } from "nanoid";

const userCreateRequestSchema = userSchema.omit({ id: true });
export type UserCreateRequest = z.infer<typeof userCreateRequestSchema>;

// 簡易なオンメモリリポジトリ
const userRepository: Map<UserId, User> = new Map();

export const route = new Hono().post(
	"/",
	zValidator("json", userCreateRequestSchema),
	async (c) => {
    const body = await c.req.json();
    const newUser = userCreateRequestSchema.parse(body);
    const id = nanoid(10) as UserId;
    const user: User = { ...newUser, id };
    userRepository.set(id, user);
    return c.json(user);
  }
).get("/:id", async (c) => {
  const id = c.req.param("id") as UserId;
  const user = userRepository.get(id);
  if (!user) {
    c.status(404)
    return c.json({ error: "User not found" });
  }
  return c.json(user);
}).get("/", async (c) => {
  return c.json([...userRepository.values()]);
});
