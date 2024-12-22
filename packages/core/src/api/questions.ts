import { Hono } from "hono";
import { OpenAI} from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { zValidator } from "@hono/zod-validator";
import { nanoid } from "nanoid";
import { type Question, type QuestionId, questionScheme, userId } from "@project/domain";

if (process.env.OPENAI_API_KEY == null) {
  throw new Error("OPENAI_API_KEY is empty");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const questionGenerateRequestSchema = z.object({
  topics: z.array(z.string()).nonempty(),
  kanjis: z.array(z.string()).nonempty(),
  userId: userId.optional(),
});

const responseScheme = questionScheme.omit({ id: true });
export const questionRepository: Map<QuestionId, Question> = new Map();

export type QuestionCreateRequest = z.infer<typeof questionGenerateRequestSchema>;

export const route = new Hono()
  .post("/generate", zValidator("json", questionGenerateRequestSchema), async (c) => {
    const body = await c.req.json();
    console.log(body)
    const { topics, kanjis, userId } = questionGenerateRequestSchema.parse(body);

    const prompt = `
指定した題材を使って、以下で指定する漢字を**全て**含む漢字ドリルの問題文を作成してください。
- 題材でよく使われる言葉を使ってください。
- ルビを振ってください。
- 10~30文字程度の文章にしてください。

Example:
{
  "topics": [
    "ポケモン"
  ],
  "kanjis": [
    "炎", "水"
  ],
  "sentence": "炎は水にこうかがばつぐんだ。"
  "sentenceWithRuby": "<ruby>炎<rp>(</rp><rt>ほのお</rt><rp>)</rp></ruby>は<ruby>水<rp>(</rp><rt>みず</rt><rp>)</rp></ruby>にこうかがばつぐんだ。"
}

題材：${topics.join(',')}
漢字：${kanjis.join(',')}
`;

    console.log(prompt)

    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        { role: "system", content: prompt },
      ],
      response_format: zodResponseFormat(responseScheme, "question"),
    });

    const generatedQuestion = response.choices[0].message.parsed;

    if (!generatedQuestion) {
      return c.json({ error: "Failed to generate question" }, 500);
    }

    const question: Question = {
      ...generatedQuestion,
      createdBy: userId,
      id: nanoid(10) as Question["id"],
    };

    questionRepository.set(question.id, question);

    return c.json(question);
  });
