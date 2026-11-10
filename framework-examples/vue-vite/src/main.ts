import { createApp } from "vue";
import "@nysds/styles/full";
import "./app.css";
import App from "./App.vue";
import { router } from "./router";

createApp(App).use(router).mount("#app");
