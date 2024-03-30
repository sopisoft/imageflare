import { Hono } from "hono";
import optimizer from "./optimizer/optimizer";

const app = new Hono();

app.route("/optimizer", optimizer);

export default app;
