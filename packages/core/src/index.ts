import { route as userRoute } from "./api/user.js";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();
app.route("/user", userRoute);
app.get("/", (c) => {
	return c.text("Hello Hono!");
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
