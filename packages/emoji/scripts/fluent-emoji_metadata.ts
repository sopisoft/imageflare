/// <reference types="@types/bun" />
/// <reference types="@types/node" />

import fs from "node:fs";

interface FluentMetadata {
  cldr: string; // "window"
  fromVersion: string; // "13.0"
  glyph: string; // "🪟"
  glyphAsUtfInEmoticons: string[]; // ["window"]
  group: string; // "Objects"
  keywords: string[]; // ["frame", "fresh air", "opening", "transparent", "view", "window"]
  mappedToEmoticons: string[]; // ["window"]
  tts: string; // "window"
  unicode: string; // "1fa9f"
}

const SkinTone = [
  "Dark",
  "Default",
  "Light",
  "Medium",
  "Medium-Dark",
  "Medium-Light",
] as const;
export type SkinTone = (typeof SkinTone)[number];

const Style = ["3D", "Color", "Flat", "High Contrast"] as const;
export type Style = (typeof Style)[number];

type StyleMap = {
  [key in Style]: string | null;
};
type SkinToneMap = {
  [key in SkinTone]: Partial<StyleMap>;
};

export interface Metadata {
  [key: string]: {
    cldr: string;
    hasSkinTones: boolean;
    // skinTones: Partial<SkinToneMap> | null;
    // styles: Partial<StyleMap> | null;
  };
}

const srcDir = "./packages/emoji/src";
const thisScript = `${srcDir}/scripts/fluent-emoji_metadata.ts`;
const assetsPath = `${srcDir}/submodules/fluent-emoji/assets`;
const tsPath = `${srcDir}/assets/fluent-emoji_metadata.ts`;

if (fs.existsSync(assetsPath)) {
  const metadata: Metadata = {};

  const assets = fs.readdirSync(assetsPath);

  for (const cldr of assets) {
    const folder = `${assetsPath}/${cldr}`;
    const metadataPath = `${folder}/metadata.json`;
    const exists = Bun.file(metadataPath).exists();
    if (!exists) {
      continue;
    }
    const json = (await Bun.file(metadataPath)
      .text()
      .then(JSON.parse)) as FluentMetadata;

    const hasSkinTones = fs.existsSync(`${folder}/Dark`);

    metadata[json.glyph] = {
      cldr: cldr,
      hasSkinTones,
    };
  }

  let content = "";
  content += "// Do not edit this file directly.\n";
  content += "// This file is generated by scripts/fluent-emoji_metadata.ts\n";
  content += "// To update this file, ";
  content += `bun run ${thisScript}\n`;
  content += "\n";
  content += `import type { Metadata } from "../../scripts/fluent-emoji_metadata";\n`;
  content += `export const metadata: Metadata = ${JSON.stringify(
    metadata,
    null,
    2
  )};`;

  await Bun.write(tsPath, content);
}
