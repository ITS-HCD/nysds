import { Component, signal } from "@angular/core";
import {
  NysAlertComponent,
  NysButtonComponent,
  NysDropdownMenuComponent,
  NysDropdownMenuItemComponent,
  NysModalComponent,
  NysPaginationComponent,
  NysTabComponent,
  NysTabgroupComponent,
  NysTabpanelComponent,
} from "@nysds/angular";

/**
 * Exercises typed component events: every handler appends the event
 * name and its `detail` to the log panel the smoke tests read.
 */
@Component({
  selector: "app-events",
  standalone: true,
  imports: [
    NysAlertComponent,
    NysButtonComponent,
    NysDropdownMenuComponent,
    NysDropdownMenuItemComponent,
    NysModalComponent,
    NysPaginationComponent,
    NysTabComponent,
    NysTabgroupComponent,
    NysTabpanelComponent,
  ],
  template: `
    <main>
      <h1>Events</h1>

      <nys-alert
        heading="Dismiss me"
        text="Closing this alert logs a typed nys-close event."
        type="info"
        dismissible
        (nysClose)="record('nys-close', $event)"
      ></nys-alert>

      <p>
        Modal is
        <span data-testid="modal-state">{{
          modalOpen() ? "open" : "closed"
        }}</span>
      </p>
      <button data-testid="open-modal" (click)="modalOpen.set(true)">
        Open modal
      </button>
      <nys-modal
        heading="Two-way modal"
        [open]="modalOpen()"
        (nysClose)="modalOpen.set(false); record('nys-close', $event)"
      >
        <p>Press Escape or the close button.</p>
      </nys-modal>

      <nys-pagination
        [totalPages]="5"
        [currentPage]="1"
        (nysChange)="record('nys-change', $event)"
      ></nys-pagination>

      <nys-tabgroup>
        <nys-tab
          id="events-tab-1"
          label="First"
          selected
          (nysTabSelect)="record('nys-tab-select', $event)"
        ></nys-tab>
        <nys-tab
          id="events-tab-2"
          label="Second"
          (nysTabSelect)="record('nys-tab-select', $event)"
        ></nys-tab>
        <nys-tabpanel id="events-tab-1">First panel</nys-tabpanel>
        <nys-tabpanel id="events-tab-2">Second panel</nys-tabpanel>
      </nys-tabgroup>

      <nys-button
        id="events-menu-trigger"
        data-testid="menu-trigger"
        label="Open menu"
      ></nys-button>
      <nys-dropdownmenu for="events-menu-trigger" label="Events menu">
        <nys-dropdownmenuitem
          label="Duplicate"
          (nysClick)="record('nys-click', $event)"
        ></nys-dropdownmenuitem>
        <nys-dropdownmenuitem
          label="Archive"
          (nysClick)="record('nys-click', $event)"
        ></nys-dropdownmenuitem>
      </nys-dropdownmenu>

      <h2>Event log</h2>
      <ul data-testid="event-log">
        @for (entry of log(); track $index) {
          <li>{{ entry }}</li>
        }
      </ul>
    </main>
  `,
})
export class EventsComponent {
  readonly log = signal<string[]>([]);
  readonly modalOpen = signal(false);

  record(name: string, event: CustomEvent<unknown>): void {
    this.log.update((entries) => [
      ...entries,
      `${name} ${JSON.stringify(event.detail, null, 1)}`,
    ]);
  }
}
