<template>
  <RouterLink :to="store.isAuthenticated ? '/dashboard' : '/'" class="logo" aria-label="VueTube home">
    <span class="mark">
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9.5-5.5z" fill="currentColor" /></svg>
    </span>
    <span class="name vt-display">VueTube</span>
  </RouterLink>
</template>

<script setup>
import { useAppStore } from "../stores/app.js";

const store = useAppStore();
</script>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--vt-text);
  text-decoration: none;
}

.logo:hover {
  color: var(--vt-text);
}

.mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--vt-accent);
  color: var(--vt-on-accent);
}

.name {
  font-size: 20px;
  letter-spacing: -0.02em;
}
</style>
