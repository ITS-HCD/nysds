// eslint.config.js
import lit from "eslint-plugin-lit";
import prettier from "eslint-plugin-prettier";
import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: typescriptParser,
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      lit,
      prettier,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "prettier/prettier": [
        "warn",
        {
          endOfLine: "auto",
        },
      ],
      "lit/no-invalid-html": "error",
    },
    ignores: [
      "node_modules/**",
      "dist/**",
      "packages/*/dist/**",
      "packages/*/node_modules/**",
    ],
  },
];
