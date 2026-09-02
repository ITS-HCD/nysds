import * as React from "react";
import {
  NysAlert,
  NysButton,
  NysDropdownMenu,
  NysDropdownMenuItem,
  NysModal,
  NysPagination,
  NysTab,
  NysTabgroup,
  NysTabpanel,
} from "@nysds/react";

interface LogEntry {
  name: string;
  detail: unknown;
}

/**
 * Exercises typed component events: every handler appends the event
 * name and its `detail` to the log panel the smoke tests read.
 */
export function Events() {
  const [log, setLog] = React.useState<LogEntry[]>([]);
  const [modalOpen, setModalOpen] = React.useState(false);

  const record = (name: string, detail: unknown) =>
    setLog((entries) => [...entries, { name, detail }]);

  return (
    <main>
      <h1>Events</h1>

      <NysAlert
        heading="Dismiss me"
        text="Closing this alert logs a typed nys-close event."
        type="info"
        dismissible
        onNysClose={(e) => record("nys-close", e.detail)}
      />

      <p>
        Modal is <span data-testid="modal-state">{modalOpen ? "open" : "closed"}</span>
      </p>
      <button data-testid="open-modal" onClick={() => setModalOpen(true)}>
        Open modal
      </button>
      <NysModal
        heading="Two-way modal"
        open={modalOpen}
        onNysClose={(e) => {
          record("nys-close", e.detail);
          setModalOpen(false);
        }}
      >
        <p>Press Escape or the close button.</p>
      </NysModal>

      <NysPagination
        totalPages={5}
        currentPage={1}
        onNysChange={(e) => record("nys-change", e.detail)}
      />

      <NysTabgroup>
        <NysTab
          id="events-tab-1"
          label="First"
          selected
          onNysTabSelect={(e) => record("nys-tab-select", e.detail)}
        />
        <NysTab
          id="events-tab-2"
          label="Second"
          onNysTabSelect={(e) => record("nys-tab-select", e.detail)}
        />
        <NysTabpanel id="events-tab-1">First panel</NysTabpanel>
        <NysTabpanel id="events-tab-2">Second panel</NysTabpanel>
      </NysTabgroup>

      <NysButton
        id="events-menu-trigger"
        data-testid="menu-trigger"
        label="Open menu"
      />
      <NysDropdownMenu for="events-menu-trigger" label="Events menu">
        <NysDropdownMenuItem
          label="Duplicate"
          onNysClick={(e) => record("nys-click", e.detail)}
        />
        <NysDropdownMenuItem
          label="Archive"
          onNysClick={(e) => record("nys-click", e.detail)}
        />
      </NysDropdownMenu>

      <h2>Event log</h2>
      <ul data-testid="event-log">
        {log.map((entry, i) => (
          <li key={i}>
            {entry.name} {JSON.stringify(entry.detail, null, 1)}
          </li>
        ))}
      </ul>
    </main>
  );
}
