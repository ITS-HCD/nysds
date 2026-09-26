<script setup lang="ts">
import { NysGlobalHeader } from "@nysds/vue";
import { NAV } from "./nav";
</script>

<template>
  <!--
    Shared page shell: NYSDS global header with the app name and page
    navigation, plus a centered content column.
  -->
  <NysGlobalHeader
    app-name="Vue + Vite example"
    agency-name="New York State Design System"
    homepage-link="/"
  >
    <ul>
      <li v-for="link in NAV" :key="link.href">
        <RouterLink :to="link.href">{{ link.label }}</RouterLink>
      </li>
    </ul>
  </NysGlobalHeader>
  <main class="nys-grid-container nys-padding-y-400">
    <RouterView />
  </main>
</template>
