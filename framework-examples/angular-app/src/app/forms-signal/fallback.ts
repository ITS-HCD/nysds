import { Component } from "@angular/core";

/**
 * Placeholder for the Signal Forms page on Angular 20, where
 * `@angular/forms/signals` does not exist. The smoke tests skip the
 * signal suite when they see `data-testid="signal-forms-fallback"`.
 */
@Component({
  selector: "app-signal-forms-fallback",
  standalone: true,
  template: `
    <h1>Forms: Signal Forms</h1>
    <p data-testid="signal-forms-fallback">
      Signal Forms requires Angular 21 or later. This build runs Angular
      20, so the page is a placeholder.
    </p>
  `,
})
export class SignalFormsPage {}
