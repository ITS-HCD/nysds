// Import the nys-icon component and registration API from the built package
import "../dist/nys-icon.js";
import { registerIconLibrary } from "../dist/nys-icon.js";

// Register Font Awesome (free solid icons via jsDelivr CDN)
registerIconLibrary("fa", {
  resolver: (name) =>
    `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid/${name}.svg`,
  mutator: (svg) => {
    svg.setAttribute("fill", "currentColor");
  },
});

// Register Google Material Symbols (outlined)
registerIconLibrary("material", {
  resolver: (name) =>
    `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${name}/default/24px.svg`,
  mutator: (svg) => {
    svg.setAttribute("fill", "currentColor");
  },
});
