import React from "react";
import ReactDOM from "react-dom/client";
import "@nysds/styles"; // resolves to the local packages/styles/dist/nysds.min.css
import "./demo.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
