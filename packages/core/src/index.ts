import { route as userRoute } from "./api/users.js";
import { route as questionsRoute } from "./api/questions.js";
import { route as usersQuestionsRoute } from "./api/users-questions.js";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();
app
	.route("/users/:id/questions", usersQuestionsRoute)
	.route("/users", userRoute)
	.route("/questions", questionsRoute)
	.get("/", (c) => {
		return c.text("Hello Hono!");
	});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
