import { Hono } from "hono";
import { z } from "zod";
import { questionRepository } from "./questions";
import type { UserId, Question } from "@project/domain";

export const route = new Hono()
  .get((c) => {
    const id = c.req.param("id") as UserId
    console.log(`showing questions for user ${id}`)

    const userQuestions: Question[] = [];
    for (const question of questionRepository.values()) {
      if (question.createdBy === id) {
        userQuestions.push(question);
      }
    };

    return c.json(userQuestions);
  });
