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
    | "dark",
  ext: "svg" | "png" = "svg"
) {
  const data = metadata[emoji];
  if (!data) return new Error("Emoji not found");

  const style = formats.style[_style ?? "color"] as Style;

  const base = "https://raw.githubusercontent.com/";
  const assets = "microsoft/fluentui-emoji/main/assets/";

  let f = `${data.cldr.toLowerCase()}_${style.toLowerCase()}`;

  if (data.hasSkinTones) {
    const skin = formats.skin[_skin ?? "default"] as SkinTone;
    f += `_${skin.toLowerCase()}.${ext}`;
    f = f.replaceAll(" ", "_");
    const path = `${data.cldr}/${skin}/${style}/${f}`;

    const url = base + assets + path;
    console.log(url);
    return url;
  }

  f += `.${ext}`;
  f = f.replaceAll(" ", "_");
  const path = `${data.cldr}/${style}/${f}`;

  const url = base + assets + path;
  console.log(url);
  return url;
}
