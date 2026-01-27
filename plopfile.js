export default function (plop) {
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
        default: "1.13.0", //update this to the latest version when new release is made
      },
      {
        type: "confirm",
        name: "formRelated",
        message: "Is this a form-related component?",
        default: false,
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/nys-{{componentName}}/src/index.ts",
        templateFile: "templates/index.template.hbs",
      },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/src/nys-{{componentName}}.figma.ts",
        templateFile: "templates/figma.template.hbs",
      },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/src/nys-{{componentName}}.mdx",
        templateFile: "templates/mdx.template.hbs",
      },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/src/nys-{{componentName}}.stories.ts",
        templateFile: "templates/stories.template.hbs",
      },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/src/nys-{{componentName}}.scss",
        templateFile: "templates/styles.template.hbs",
      },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/src/nys-{{componentName}}.test.ts",
        templateFile: "templates/test.template.hbs",
      },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/src/nys-{{componentName}}.ts",
        templateFile: "templates/component.template.hbs",
      },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/package.json",
        templateFile: "templates/package.template.hbs",
      },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/tsconfig.json",
        templateFile: "templates/tsconfig.template.hbs",
      },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/vite.config.js",
        templateFile: "templates/viteconfig.template.hbs",
      },
      {
        type: "add",
        path: "packages/nys-{{componentName}}/web-test-runner.config.js",
        templateFile: "templates/webtestrunner.template.hbs",
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
}
