import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  standalone: false,
  template: `
    <main>
      <h1>NgModule example</h1>

      <nys-alert
        heading="NgModule app"
        text="NYSDS components render through NysAngularModule."
        type="info"
      ></nys-alert>

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
      <nys-button label="Save"></nys-button>

      <h2>Model</h2>
      <pre data-testid="model">{{ modelJson }}</pre>
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
