import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { showRoutes } from "hono/dev";
import api from "./api/api";

const app = new Hono();

app.use("*", csrf());

const routes = app.route("/api", api);

showRoutes(routes);

export type AppType = typeof routes;
export default app;
