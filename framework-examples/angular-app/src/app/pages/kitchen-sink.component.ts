import { Component } from "@angular/core";
import { NysAngularModule } from "@nysds/angular";

/**
 * Renders every NYSDS component once with representative props. The
 * smoke test asserts that every nys-* tag on this page is a defined,
 * upgraded custom element. Importing NysAngularModule also proves the
 * aggregate module works from a standalone component.
 */
@Component({
  selector: "app-kitchen-sink",
  standalone: true,
  imports: [NysAngularModule],
  template: `
    <nys-skipnav href="#main-content"></nys-skipnav>
    <h1 id="main-content">Kitchen sink</h1>
    <p>
      Every NYSDS component rendered once through the Angular wrappers,
      grouped by role.
    </p>

    <section>
      <h2>Page chrome</h2>
      <div class="nys-display-flex nys-flex-column nys-flex-gap-300">
        <nys-unavheader hideTranslate hideSearch></nys-unavheader>
        <nys-globalheader
          appName="Example app"
          agencyName="Example Agency"
        ></nys-globalheader>
        <nys-breadcrumbs>
          <a href="/">Home</a>
          <a href="/kitchen-sink">Kitchen sink</a>
        </nys-breadcrumbs>
      </div>
    </section>

    <section>
      <h2>Content</h2>
      <div
        class="nys-display-flex nys-flex-column nys-flex-align-start nys-flex-gap-300"
      >
        <nys-accordion>
          <nys-accordionitem heading="First accordion item">
            <p>Accordion content.</p>
          </nys-accordionitem>
        </nys-accordion>

        <div class="nys-display-flex nys-flex-align-center nys-flex-gap-200">
          <nys-avatar initials="NY"></nys-avatar>
          <nys-badge label="New"></nys-badge>
          <nys-icon name="close" aria-label="Close icon"></nys-icon>
        </div>

        <nys-card
          heading="Card heading"
          description="A representative card."
          href="https://ny.gov"
        ></nys-card>

        <nys-divider></nys-divider>

        <nys-iconlist>
          <nys-iconlistitem icon="close">Icon list item</nys-iconlistitem>
        </nys-iconlist>

        <nys-processlist>
          <nys-processlistitem
            label="Step one"
            description="Do the first thing"
          ></nys-processlistitem>
        </nys-processlist>

        <nys-stepper label="Stepper">
          <nys-step label="Step A"></nys-step>
          <nys-step label="Step B" current></nys-step>
        </nys-stepper>

        <nys-tabgroup>
          <nys-tab id="ks-tab-1" label="First" selected></nys-tab>
          <nys-tab id="ks-tab-2" label="Second"></nys-tab>
          <nys-tabpanel id="ks-tab-1">First panel</nys-tabpanel>
          <nys-tabpanel id="ks-tab-2">Second panel</nys-tabpanel>
        </nys-tabgroup>

        <nys-table>
          <table>
            <thead>
              <tr>
                <th>Column</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cell</td>
              </tr>
            </tbody>
          </table>
        </nys-table>

        <nys-video titleText="Example video" videourl=""></nys-video>
      </div>
    </section>

    <section>
      <h2>Form controls</h2>
      <div class="nys-display-flex nys-flex-column nys-flex-gap-300">
        <nys-label
          label="A standalone label"
          description="With a description"
        ></nys-label>
        <nys-errormessage
          showError
          errorMessage="A representative error"
        ></nys-errormessage>

        <nys-textinput label="Text input" name="ks-text"></nys-textinput>
        <nys-textarea label="Textarea" name="ks-textarea"></nys-textarea>
        <nys-select label="Select" name="ks-select">
          <nys-option value="a" label="Option A"></nys-option>
          <option value="b">Option B</option>
        </nys-select>
        <nys-combobox label="Combobox" name="ks-combobox">
          <option value="one">One</option>
          <option value="two">Two</option>
        </nys-combobox>
        <nys-datepicker label="Datepicker" name="ks-date"></nys-datepicker>
        <nys-checkbox
          label="Checkbox"
          name="ks-checkbox"
          value="yes"
        ></nys-checkbox>
        <nys-checkboxgroup label="Checkbox group" name="ks-group">
          <nys-checkbox label="Grouped checkbox" value="g1"></nys-checkbox>
        </nys-checkboxgroup>
        <nys-radiogroup label="Radio group" name="ks-radio">
          <nys-radiobutton
            label="Radio one"
            value="r1"
            name="ks-radio"
          ></nys-radiobutton>
          <nys-radiobutton
            label="Radio two"
            value="r2"
            name="ks-radio"
          ></nys-radiobutton>
        </nys-radiogroup>
        <nys-toggle label="Toggle" name="ks-toggle"></nys-toggle>
        <nys-fileinput label="File input" name="ks-file"></nys-fileinput>
        <nys-fileitem filename="example.pdf"></nys-fileitem>

        <div class="nys-display-flex nys-flex-align-center nys-flex-gap-200">
          <nys-button label="Primary action"></nys-button>
        </div>
      </div>
    </section>

    <section>
      <h2>Feedback and overlays</h2>
      <div
        class="nys-display-flex nys-flex-column nys-flex-align-start nys-flex-gap-300"
      >
        <nys-alert
          heading="Informational alert"
          text="This alert is part of the kitchen sink."
          type="info"
          dismissible
        ></nys-alert>

        <nys-tooltip text="Tooltip text">
          <nys-button label="Hover me" variant="outline"></nys-button>
        </nys-tooltip>

        <nys-button id="ks-menu-trigger" label="Open menu"></nys-button>
        <nys-dropdownmenu for="ks-menu-trigger" label="Kitchen sink menu">
          <nys-dropdownmenuitem label="Menu item"></nys-dropdownmenuitem>
        </nys-dropdownmenu>

        <nys-modal heading="Kitchen sink modal" [open]="false">
          <p>Modal body.</p>
        </nys-modal>
      </div>
    </section>

    <section>
      <h2>Navigation</h2>
      <div
        class="nys-display-flex nys-flex-column nys-flex-align-start nys-flex-gap-300"
      >
        <nys-pagination [totalPages]="5" [currentPage]="1"></nys-pagination>

        <nys-verticalnav heading="Section navigation">
          <nys-verticalnavgroup label="Group">
            <a href="/kitchen-sink">A link</a>
          </nys-verticalnavgroup>
        </nys-verticalnav>

        <nys-backtotop></nys-backtotop>
      </div>
    </section>

    <section>
      <h2>Footer</h2>
      <div class="nys-display-flex nys-flex-column nys-flex-gap-300">
        <nys-globalfooter
          agencyName="Example Agency"
          homepageLink="https://ny.gov"
        ></nys-globalfooter>
        <nys-unavfooter></nys-unavfooter>
      </div>
    </section>

    <div data-testid="kitchen-sink-ready"></div>
  `,
})
export class KitchenSinkComponent {}
