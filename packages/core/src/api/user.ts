import { Hono } from "hono";
import type { z } from "zod";
import { type User, type UserId, userSchema } from "@project/domain";
import { zValidator } from "@hono/zod-validator";

const userCreateRequestSchema = userSchema.omit({ id: true });
export type UserCreateRequest = z.infer<typeof userCreateRequestSchema>

// 簡易なオンメモリリポジトリ
const userRepository: Map<UserId, User> = new Map();

export const route = new Hono()
  .post("/", zValidator("json", userCreateRequestSchema), async (req, res) => {
  })
