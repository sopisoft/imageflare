import { type ConvertOptions, initialize, svg2png } from "svg2png-wasm";
import wasm from "svg2png-wasm/svg2png_wasm_bg.wasm";

let initialized = false;

export async function to_png(
  svg: string,
  size: number
): Promise<ArrayBuffer | Error> {
  if (!initialized) {
    await initialize(wasm)
      .then(() => {
        initialized = true;
      })
      .catch((e) => {
        if (
          e.message !==
          "Already initialized. The `initialize` function can be used only once."
        )
          return e;
      });
  }

  const convertOptions: ConvertOptions = {
    width: size,
    height: size,
    backgroundColor: "transparent",
  };

  const png = await svg2png(svg, convertOptions);

  return png as unknown as ArrayBuffer;
}
