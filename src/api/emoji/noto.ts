export function get_svg_url(emoji: string): string {
  function getFilename(emoji: string) {
    const list = [];
    for (let i = 0; ; i++) {
      const code = emoji.codePointAt(i);
      if (Number.isNaN(code) || code === undefined) break;
      if (code === 65039) continue;
      if (55296 <= code && code <= 57344) continue;
      list.push(code.toString(16).padStart(4, "0"));
    }
    return `emoji_u${list.join("_")}.svg`;
  }
  const base =
    "https://raw.githubusercontent.com/googlefonts/noto-emoji/main/svg/";
  const filename = getFilename(emoji);
  const url = `${base}${filename}`;

  return url;
}
