import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app.component';

bootstrapApplication(AppComponent).catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
});
