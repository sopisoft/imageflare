import { parse } from "twemoji-parser";

export function get_svg_url(emoji: string): string | Error {
  const entities = parse(emoji, { assetType: "svg" });
  if (entities.length === 0) {
    return new Error("Emoji not found");
  }
  const url = entities[0].url.replace(
    "https://twemoji.maxcdn.com/v/latest/svg/",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/"
  );

  return url;
}
