import { execSync } from "node:child_process";

export default function (plop) {
  // Runs `npm run cem` after scaffolding: regenerates custom-elements.json
  // (including this new component) and runs verify-form-contract.mjs against
  // it, so a scaffolded form control that got the @formControl/@fires tags
  // wrong fails fast instead of silently breaking the React/Angular
  // generators later. See 07-mcp-storybook-and-tooling.md section 7.7.
  plop.setActionType("runCem", async () => {
    execSync("npm run cem", { stdio: "inherit" });
    return "Ran `npm run cem` — regenerated custom-elements.json and verified the form-control contract.";
  });

  // create your generators here
  plop.setGenerator("basics", {
    description: "this is a skeleton plopfile",
    prompts: [
      {
        type: "input",
        name: "componentName",
        message: "Component Name (no spaces or nys- prefix)",
        // cannot be blank, force user to enter a value
        validate: (value) => {
          if (value === "") {
            return "Component Name cannot be blank";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "versionNumber",
        message: "Version Number",
        default: "1.20.1", //update this to the latest version when new release is made
      },
      {
        type: "list",
        name: "formControl",
        message:
          "Is this a form control? (none / value / checked / files) — " +
          "drives the @formControl JSDoc tag the React and Angular generators read.",
        choices: ["none", "value", "checked", "files"],
        default: "none",
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/nys-{{componentName}}/src/index.ts",
        templateFile: "src/templates/index.template.hbs",
      },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/src/nys-{{componentName}}.figma.ts",
        templateFile: "src/templates/figma.template.hbs",
      },
      // {
      //   type: "add",
      //   path: "packages/nys-{{componentName}}/src/nys-{{componentName}}.mdx",
      //   templateFile: "src/templates/mdx.template.hbs",
      // },
      // {
      //   type: "add",
      //   path: "packages/nys-{{componentName}}/src/nys-{{componentName}}.stories.ts",
      //   templateFile: "src/templates/stories.template.hbs",
      // },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/src/nys-{{componentName}}.scss",
        templateFile: "src/templates/styles.template.hbs",
      },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/src/nys-{{componentName}}.test.ts",
        templateFile: "src/templates/test.template.hbs",
      },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/src/nys-{{componentName}}.ts",
        templateFile: "src/templates/component.template.hbs",
      },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/package.json",
        templateFile: "src/templates/package.template.hbs",
      },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/tsconfig.json",
        templateFile: "src/templates/tsconfig.template.hbs",
      },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/vite.config.js",
        templateFile: "src/templates/viteconfig.template.hbs",
      },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/web-test-runner.config.js",
        templateFile: "src/templates/webtestrunner.template.hbs",
      },
      {
        type: "modify",
        path: "src/scripts/build-order.js",
        pattern: /(\];)/,
        template: `  { name: "nys-{{componentName}}", path: "packages/nys-{{componentName}}" },\n$1`,
      },
      {
        type: "modify",
        path: "packages/styles/src/nysds.scss",
        pattern:
          /(\/\* Hide unstyled components until they are fully loaded \*\/)/,
        template: `$1\nnys-{{componentName}}:not(:defined),`,
      },
      {
        type: "modify",
        path: "src/index.ts",
        transform: (content, data) => {
          const insertLine = `\nexport * from "../packages/nys-${data.componentName}/src/index";\n`;
          return content.trimEnd() + insertLine;
        },
      },
      {
        // tsconfig.build.json carries a trailing `//` comment after its last
        // reference (see the "Framework packages" note), which makes it
        // JSONC, not JSON — `JSON.parse` throws on it. Insert the new
        // reference as text, in place, instead of round-tripping through
        // JSON.parse/stringify (which would also silently drop the comment).
        type: "modify",
        path: "tsconfig.build.json",
        transform: (content, data) => {
          const newPath = `packages/nys-${data.componentName}`;
          const refLineRe = /^(\s*)\{\s*"path":\s*"([^"]+)"\s*\},?\s*$/;
          const lines = content.split("\n");

          let first = -1;
          let last = -1;
          let indent = "    ";
          const paths = [];
          lines.forEach((line, i) => {
            const match = line.match(refLineRe);
            if (match) {
              if (first === -1) first = i;
              last = i;
              indent = match[1];
              paths.push(match[2]);
            }
          });

          if (first === -1) {
            throw new Error(
              'tsconfig.build.json: no { "path": "..." } reference lines found to insert next to.',
            );
          }

          paths.push(newPath);
          paths.sort((a, b) => a.localeCompare(b));

          // Only the last array value skips the trailing comma. Anything
          // after it in the file (a comment, then "]") isn't a value, so it
          // doesn't need one either.
          const newLines = paths.map(
            (path, i) =>
              `${indent}{ "path": "${path}" }${i < paths.length - 1 ? "," : ""}`,
          );

          lines.splice(first, last - first + 1, ...newLines);
          return lines.join("\n");
        },
      },
      { type: "runCem" },
    ],
  });

  // input: "helloworld"
  // output: "Helloworld"
  plop.setHelper("capitalize", (text) => {
    return text
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  });

  // input: "helloworld"
  // output: "HELLOWORLD"
  plop.setHelper("uppercase", (text) => {
    return text.toUpperCase();
  });

  // {{#if (ne formControl "none")}} ... {{/if}} — form-control conditionals
  // in the templates below. Kept as a generic helper (not isFormControl)
  // because component.template.hbs also branches per-kind ("value" vs
  // "checked" vs "files").
  plop.setHelper("eq", (a, b) => a === b);
  plop.setHelper("ne", (a, b) => a !== b);
}
