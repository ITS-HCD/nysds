<script setup lang="ts">
import { ref } from "vue";
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
} from "@nysds/vue";

interface LogEntry {
  name: string;
  detail: unknown;
}

/**
 * Exercises typed component events: every handler appends the event
 * name and its `detail` to the log panel the smoke tests read.
 */
const log = ref<LogEntry[]>([]);
const modalOpen = ref(false);

const record = (name: string, detail: unknown) => {
  log.value.push({ name, detail });
};
</script>

<template>
  <h1>Events</h1>
  <p>
    Typed component events, logged with their <code>detail</code> payloads as
    they fire.
  </p>

  <section>
    <h2>Alert</h2>
    <NysAlert
      heading="Dismiss me"
      text="Closing this alert logs a typed nys-close event."
      type="info"
      dismissible
      @nys-close="(e) => record('nys-close', e.detail)"
    />
  </section>

  <section>
    <h2>Modal</h2>
    <p>
      Modal is
      <span data-testid="modal-state">{{ modalOpen ? "open" : "closed" }}</span>
    </p>
    <button
      class="app-action"
      data-testid="open-modal"
      @click="modalOpen = true"
    >
      Open modal
    </button>
    <NysModal
      heading="Two-way modal"
      :open="modalOpen"
      @nys-close="
        (e) => {
          record('nys-close', e.detail);
          modalOpen = false;
        }
      "
    >
      <p>Press Escape or the close button.</p>
    </NysModal>
  </section>

  <section>
    <h2>Pagination</h2>
    <NysPagination
      :total-pages="5"
      :current-page="1"
      @nys-change="(e) => record('nys-change', e.detail)"
    />
  </section>

  <section>
    <h2>Tabs</h2>
    <NysTabgroup>
      <NysTab
        id="events-tab-1"
        label="First"
        selected
        @nys-tab-select="(e) => record('nys-tab-select', e.detail)"
      />
      <NysTab
        id="events-tab-2"
        label="Second"
        @nys-tab-select="(e) => record('nys-tab-select', e.detail)"
      />
      <NysTabpanel id="events-tab-1">First panel</NysTabpanel>
      <NysTabpanel id="events-tab-2">Second panel</NysTabpanel>
    </NysTabgroup>
  </section>

  <section>
    <h2>Menu</h2>
    <NysButton
      id="events-menu-trigger"
      data-testid="menu-trigger"
      label="Open menu"
    />
    <NysDropdownMenu for="events-menu-trigger" label="Events menu">
      <NysDropdownMenuItem
        label="Duplicate"
        @nys-click="(e) => record('nys-click', e.detail)"
      />
      <NysDropdownMenuItem
        label="Archive"
        @nys-click="(e) => record('nys-click', e.detail)"
      />
    </NysDropdownMenu>
  </section>

  <section>
    <h2>Event log</h2>
    <ul class="app-readout" data-testid="event-log">
      <li v-for="(entry, i) in log" :key="i">
        {{ entry.name }} {{ JSON.stringify(entry.detail, null, 1) }}
      </li>
    </ul>
  </section>
</template>
