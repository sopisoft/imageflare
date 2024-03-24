import { Hono } from "hono";
import { csrf } from "hono/csrf";

import api from "./api/api";

const app = new Hono();

app.use(csrf());

const routes = app.route("/api", api);

export type AppType = typeof routes;

export default app;
