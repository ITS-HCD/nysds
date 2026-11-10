<script setup lang="ts">
import { NAV } from "../nav";
</script>

<template>
  <h1>NYSDS Vue + Vite example</h1>
  <p>
    Proves <code>@nysds/vue</code> in a Vite single-page app. Each page
    exercises one part of the integration.
  </p>
  <ul>
    <li v-for="link in NAV" :key="link.href">
      <RouterLink :to="link.href">{{ link.label }}</RouterLink>
    </li>
  </ul>
</template>
