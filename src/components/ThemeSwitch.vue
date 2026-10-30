<template>
  <div class="theme-switch" role="group" aria-label="Theme">
    <button type="button" :aria-pressed="theme === 'light'" @click="saveTheme('light')">
      <AppIcon name="sun" :size="14" />
      Light
    </button>
    <button type="button" :aria-pressed="theme === 'dark'" @click="saveTheme('dark')">
      <AppIcon name="moon" :size="14" />
      Dark
    </button>
  </div>
</template>

<script setup>
import { theme, saveTheme } from "../theme.js";
import AppIcon from "./AppIcon.vue";
</script>

<style scoped>
.theme-switch {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: var(--vt-radius);
  background: var(--vt-surface-2);
}

button {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--vt-muted);
  font: 500 13px var(--vt-font);
  cursor: pointer;
}

button[aria-pressed="true"] {
  background: var(--vt-surface);
  color: var(--vt-text);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
}

button:focus-visible {
  outline: 2px solid var(--vt-accent);
  outline-offset: 1px;
}
</style>
