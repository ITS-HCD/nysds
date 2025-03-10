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
        default: "1.1.0", //update this to the latest version when new release is made
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
        path: "packages/nys-{{componentName}}/src/nys-{{componentName}}.styles.ts",
        templateFile: "templates/styles.template.hbs",
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
    ],
  });

  // input: "helloworld"
  // output: "Helloworld"
  plop.setHelper("titleCase", (text) => {
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
