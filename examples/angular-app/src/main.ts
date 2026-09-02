import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";
import { changeDetectionProviders } from "./app/cd-providers";

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), ...changeDetectionProviders],
}).catch((err) => console.error(err));
