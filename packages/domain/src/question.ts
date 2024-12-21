import { z } from "zod";

const questionScheme = z.object({
	id: z.string().brand<"QuestionId">(),
	content: z.string().nonempty(),
	kanjis: z.array(z.string()).min(1),
	topics: z.array(z.string()),
});

export type Question = z.infer<typeof questionScheme>;
