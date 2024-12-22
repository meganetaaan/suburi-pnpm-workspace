import { z } from "zod";

export const questionScheme = z.object({
	id: z.string().brand<"QuestionId">(),
	sentence: z.string(),
	sentenceWithRuby: z.string(),
	kanjis: z.array(z.string()),
	topics: z.array(z.string()),
});

export type Question = z.infer<typeof questionScheme>;
