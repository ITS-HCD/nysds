import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // The raw-tag form variant renders <nys-*> elements directly.
          // The @nysds/vue wrappers are ordinary components and need no
          // such rule.
          isCustomElement: (tag) => tag.startsWith("nys-"),
        },
      },
    }),
  ],
  resolve: {
    // One Vue copy, whatever the monorepo hoists elsewhere. Matters when
    // CI pins Vue 3.4 in this workspace while a sibling package brings
    // Vue 3.5.
    dedupe: ["vue"],
  },
});
