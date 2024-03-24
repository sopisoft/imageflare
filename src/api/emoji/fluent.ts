import type { SkinTone, Style } from "../../../scripts/fluent-emoji_metadata";
import { metadata } from "../../assets/fluent-emoji_metadata";

const formats = {
  style: {
    flat: "Flat",
    "3d": "3D",
    color: "Color",
    high_contrast: "High Contrast",
  },
  skin: {
    default: "Default",
    light: "Light",
    medium_light: "Medium-Light",
    medium: "Medium",
    medium_dark: "Medium-Dark",
    dark: "Dark",
  },
} as const;

export function get_svg_url(
  emoji: string,
  _style?: "flat" | "3d" | "color" | "high_contrast",
  _skin?:
    | "default"
    | "light"
    | "medium_light"
    | "medium"
    | "medium_dark"
    | "dark"
) {
  const data = metadata[emoji];
  if (!data) return new Error("Emoji not found");

  const style = formats.style[_style ?? "color"] as Style;

  const base =
    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/";

  if (data.hasSkinTones) {
    const skin = formats.skin[_skin ?? "default"] as SkinTone;
    const url = data.skinTones?.[skin]?.[style];
    if (!url) return new Error("Emoji not found");

    return base + url;
  }

  const url = data.styles?.[style];
  if (!url) return new Error("Emoji not found");
  console.log(base + url);
  return base + url;
}
