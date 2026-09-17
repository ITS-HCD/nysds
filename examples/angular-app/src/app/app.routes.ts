import type { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "kitchen-sink",
    loadComponent: () =>
      import("./pages/kitchen-sink.component").then(
        (m) => m.KitchenSinkComponent,
      ),
  },
  {
    path: "forms/template",
    loadComponent: () =>
      import("./pages/forms-template.component").then(
        (m) => m.FormsTemplateComponent,
      ),
  },
  {
    path: "forms/reactive",
    loadComponent: () =>
      import("./pages/forms-reactive.component").then(
        (m) => m.FormsReactiveComponent,
      ),
  },
  {
    // The barrel resolves to the real Signal Forms page on Angular 21+
    // and to a fallback page on Angular 20 (scripts/sync-signal-forms.mjs).
    path: "forms/signal",
    loadComponent: () =>
      import("./forms-signal").then((m) => m.SignalFormsPage),
  },
  {
    path: "events",
    loadComponent: () =>
      import("./pages/events.component").then((m) => m.EventsComponent),
  },
  { path: "", pathMatch: "full", redirectTo: "kitchen-sink" },
];
