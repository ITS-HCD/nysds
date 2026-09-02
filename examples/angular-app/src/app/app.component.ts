import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/kitchen-sink">Kitchen sink</a> |
      <a routerLink="/forms/template">Forms (template)</a> |
      <a routerLink="/forms/reactive">Forms (reactive)</a> |
      <a routerLink="/forms/signal">Forms (signal)</a> |
      <a routerLink="/events">Events</a>
    </nav>
    <router-outlet />
  `,
})
export class AppComponent {}
