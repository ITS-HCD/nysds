// This file is used to bundle the CSS utilities files into a single file
import { transform } from "lightningcss";
import bundleCss from "vite-plugin-bundle-css";

export default {
  build: {
    cssCodeSplit: true,
    emptyOutDir: false, // Do not empty the output directory before building
    lib: {
      entry: [
        // The order of these files doesn't matter, it combines them however it wants...
        "./src/excelsior.css",
        "./src/utility.css",      ],
    },
  },
  plugins: [
    bundleCss({
      name: "excelsior-full.min.css",
      fileName: "excelsior-full.min.css",
      transform: (code, id) => {
        const { code: minifiedCode } = transform({
          filename: id,
          code: Buffer.from(code),
          minify: true,
        });

        return minifiedCode.toString();
      },
    }),
  ],
};
