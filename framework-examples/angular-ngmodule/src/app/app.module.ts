import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { NysAngularModule } from "@nysds/angular";
import { AppComponent } from "./app.component";

/**
 * Proves the non-standalone path: NysAngularModule imported into a
 * classic NgModule application.
 */
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, NysAngularModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
