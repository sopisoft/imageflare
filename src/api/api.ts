import { Hono } from "hono";
import emoji from "./emoji/emoji";

const app = new Hono();

app.route("/emoji", emoji);

export default app;
