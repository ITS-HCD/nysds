import { Component } from "@angular/core";

/**
 * Single-page NgModule app. The shell matches the other example apps:
 * NYSDS global header with the app name, plus a centered content column.
 */
@Component({
  selector: "app-root",
  standalone: false,
  template: `
    <nys-globalheader
      appName="Angular NgModule example"
      agencyName="New York State Design System"
    ></nys-globalheader>
    <main class="nys-grid-container nys-padding-y-400">
      <h1>NgModule example</h1>
      <p>
        NYSDS components render through <code>NysAngularModule</code> in a
        classic NgModule application.
      </p>

      <section>
        <h2>Form</h2>
        <nys-alert
          class="nys-margin-b-300"
          heading="NgModule app"
          text="NYSDS components render through NysAngularModule."
          type="info"
        ></nys-alert>

        <div class="nys-display-flex nys-flex-column nys-flex-gap-300">
          <nys-textinput
            label="Your name"
            name="name"
            [(ngModel)]="name"
          ></nys-textinput>
          <nys-checkbox
            label="Subscribe"
            name="subscribe"
            value="yes"
            [(ngModel)]="subscribe"
          ></nys-checkbox>

          <div
            class="nys-display-flex nys-flex-wrap nys-flex-align-center nys-flex-gap-200 nys-margin-t-200"
          >
            <nys-button label="Save"></nys-button>
          </div>
        </div>
      </section>

      <section>
        <h2>Live model</h2>
        <pre class="app-readout" data-testid="model">{{ modelJson }}</pre>
      </section>
    </main>
  `,
})
export class AppComponent {
  name = "";
  subscribe = false;

  get modelJson(): string {
    return JSON.stringify(
      { name: this.name, subscribe: this.subscribe },
      null,
      2,
    );
  }
}
