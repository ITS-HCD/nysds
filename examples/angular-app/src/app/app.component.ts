import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { NysGlobalHeaderComponent } from "@nysds/angular";

/**
 * Shared page shell: NYSDS global header with the app name and page
 * navigation, plus a centered content column.
 */
@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, NysGlobalHeaderComponent],
  template: `
    <nys-globalheader
      appName="Angular standalone example"
      agencyName="New York State Design System"
      homepageLink="/"
    >
      <ul>
        <li><a routerLink="/kitchen-sink">Kitchen sink</a></li>
        <li><a routerLink="/forms/template">Forms: template</a></li>
        <li><a routerLink="/forms/reactive">Forms: reactive</a></li>
        <li><a routerLink="/forms/signal">Forms: signal</a></li>
        <li><a routerLink="/events">Events</a></li>
      </ul>
    </nys-globalheader>
    <main class="nys-grid-container nys-padding-y-400">
      <router-outlet />
    </main>
  `,
})
export class AppComponent {}
