import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import KitchenSink from "./pages/KitchenSink.vue";
import FormsVModel from "./pages/FormsVModel.vue";
import FormsRaw from "./pages/FormsRaw.vue";
import Events from "./pages/Events.vue";

/**
 * `vite preview` serves index.html for every path (SPA fallback), so
 * history mode works for direct navigation.
 */
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/kitchen-sink", component: KitchenSink },
    { path: "/forms/v-model", component: FormsVModel },
    { path: "/forms/raw", component: FormsRaw },
    { path: "/events", component: Events },
  ],
});
