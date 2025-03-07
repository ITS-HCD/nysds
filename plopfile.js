export default function (plop) {
  // create your generators here
  plop.setGenerator("basics", {
    description: "this is a skeleton plopfile",
    prompts: [
      {
        type: "input",
        name: "componentName",
        message:
          "What is the name of the new component? Omit NYS and no spaces. ie: “textarea” not “text area”",
      },
    ], // array of inquirer prompts
    actions: [
      {
        type: "add",
        path: "packages/nys-{{componentName}}/index.ts",
        templateFile: "templates/index.template.hbs",
      },
    ], // array of actions
  });

  // input: "hello world"
  // output: "Hello World"
  plop.setHelper("titleCase", (text) => {
    return text
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  });

  // input: "hello world"
  // output: "hello_world"
  plop.setHelper("snakeCase", (text) => {
    return text.toLowerCase().split(" ").join("_");
  });

  // input: "hello world"
  // output: "helloWorld"
  plop.setHelper("camelCase", (text) => {
    return text
      .split(" ")
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word[0].toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join("");
  });

  // input: "hello world"
  // output: "hello-world"
  plop.setHelper("kebabCase", (text) => {
    return text.toLowerCase().split(" ").join("-");
  });
}
