import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { cache } from "hono/cache";
import { optimizeImage } from "wasm-image-optimization";
import { z } from "zod";

const app = new Hono();

app.get(
  "*",
  cache({
    cacheName: "emoji",
    cacheControl: `max-age=${60 * 60 * 24 * 30}`,
  })
);

const schema = z.object({
  image: z.string().url(),
  width: z.coerce.number().min(0).optional(),
  height: z.coerce.number().min(0).optional(),
  quality: z.coerce.number().min(0).max(100).optional(),
  format: z.enum(["png", "jpeg", "webp"]).optional(),
});

app.get("/v1", zValidator("query", schema), async (c) => {
  const { image, width, height, quality, format } = c.req.valid("query");

  console.log(image, width, height, quality, format);

  const res = await fetch(image);
  const buffer = await res.arrayBuffer();

  const optimizedImage = await optimizeImage({
    image: buffer,
    width,
    height,
    quality,
    format,
  });

  if (!optimizedImage) return c.text("Invalid image", 400);

  return c.newResponse(optimizedImage as unknown as ArrayBuffer);
});

export default app;
