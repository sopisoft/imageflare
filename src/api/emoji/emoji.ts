import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { get_svg_url as get_fluent_url } from "./fluent";
import { get_svg_url as get_noto_svg_url } from "./noto";
import { to_png } from "./to_png";
import { get_svg_url as get_twemoji_svg_url } from "./twemoji";

const app = new Hono();

const paramSchema = z.object({
  emoji: z.string().regex(/.+\.(png|svg)/),
});

const querySchema = z.object({
  size: z.string().regex(/^\d+$/).optional(),
  provider: z.enum(["twemoji", "noto", "fluent"]).optional(),
  fluent_style: z.enum(["3d", "color", "flat", "high_contrast"]).optional(),
  fluent_skin: z
    .enum(["dark", "default", "light", "medium", "medium_dark", "medium_light"])
    .optional(),
});

// GET /api/emoji/v1/🐶.png?size=128&provider=fluent&fluent_style=color
app.get(
  "/v1/:emoji{.+\\.png|.+\\.svg}",
  zValidator("query", querySchema),
  async (c) => {
    const { emoji } = c.req.param();
    try {
      paramSchema.parse({ emoji });
    } catch (e) {
      return c.text("Invalid params", 400);
    }

    const emoji_content = emoji.slice(0, -4);

    const emoji_schema = z.string().emoji();
    try {
      emoji_schema.parse(emoji_content);
    } catch (e) {
      return c.text("Invalid emoji", 400);
    }

    const ext = c.req.param("emoji").slice(-4);
    const { size, provider, fluent_style, fluent_skin } = c.req.valid("query");

    const emoji_size = size ? Number.parseInt(size) : 16;
    let svg_str = "";

    async function svg_to_str(url: string) {
      return await fetch(url)
        .catch(() => {
          return c.text("Error fetching svg", 500);
        })
        .then((res) => {
          const svg = res.text();
          console.log(svg);
          return svg;
        });
    }

    switch (provider) {
      case "twemoji": {
        const svg_url = get_twemoji_svg_url(emoji_content);
        if (svg_url instanceof Error) return c.text("Emoji not found", 404);

        svg_str = await svg_to_str(svg_url);
        break;
      }
      case "noto": {
        const svg_url = get_noto_svg_url(emoji_content);

        svg_str = await svg_to_str(svg_url);
        break;
      }
      case "fluent": {
        if (fluent_style === "3d") {
          if (ext === ".svg") return c.text("No svg for 3d style", 400);

          const png_url = get_fluent_url(
            emoji_content,
            fluent_style,
            fluent_skin
          );

          if (png_url instanceof Error) return c.text("Emoji not found", 404);

          const png = await fetch(png_url).then((res) => res.arrayBuffer());
          return c.newResponse(png, 200, {
            "Content-Type": "image/png",
          });
        }

        const svg_url = get_fluent_url(
          emoji_content,
          fluent_style,
          fluent_skin
        );
        if (svg_url instanceof Error) return c.text("Emoji not found", 404);

        svg_str = await svg_to_str(svg_url);
        break;
      }
      default: {
        const svg_url = get_twemoji_svg_url(emoji_content);
        if (svg_url instanceof Error) return c.text("Emoji not found", 404);

        svg_str = await svg_to_str(svg_url);
      }
    }

    if (svg_str.length === 0) return c.text("Error fetching svg", 500);

    switch (ext) {
      case ".png": {
        const png = await to_png(svg_str, emoji_size);
        if (png instanceof Error) return c.text("Error converting to png", 500);
        return c.newResponse(png, 200, {
          "Content-Type": "image/png",
        });
      }
      case ".svg": {
        return c.text(svg_str, 200, {
          "Content-Type": "image/svg+xml",
        });
      }
    }
  }
);

export default app;
