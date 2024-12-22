import { z } from "zod";
import { userId } from "./user";

const questionId = z.string().brand<"QuestionId">()
export type QuestionId = z.infer<typeof questionId>;
export const questionScheme = z.object({
	id: questionId,
	createdBy: userId.optional(),
	sentence: z.string(),
	sentenceWithRuby: z.string(),
	kanjis: z.array(z.string()),
	topics: z.array(z.string()),
});

export type Question = z.infer<typeof questionScheme>;
