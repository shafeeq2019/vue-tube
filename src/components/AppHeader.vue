<template>
  <header class="header">
    <AppLogo />
    <nav aria-label="Main" class="nav">
      <RouterLink to="/about" class="nav-link-plain d-none d-sm-inline">About</RouterLink>
      <RouterLink to="/login" class="nav-link-plain">Log in</RouterLink>
      <RouterLink to="/signUp" class="vt-btn vt-btn-primary vt-btn-sm">Sign up</RouterLink>
      <button
        type="button"
        class="vt-icon-btn"
        :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="saveTheme(theme === 'dark' ? 'light' : 'dark')"
      >
        <AppIcon :name="theme === 'dark' ? 'sun' : 'moon'" :size="18" />
      </button>
    </nav>
  </header>
</template>

<script setup>
import { theme, saveTheme } from "../theme.js";
import AppLogo from "./AppLogo.vue";
import AppIcon from "./AppIcon.vue";
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px clamp(16px, 4vw, 40px);
}

.nav {
  display: flex;
  align-items: center;
  gap: clamp(8px, 2vw, 20px);
  font-size: 14px;
}

.nav-link-plain {
  color: var(--vt-text-2);
  text-decoration: none;
  font-weight: 500;
}

.nav-link-plain:hover,
.nav-link-plain.router-link-active {
  color: var(--vt-text);
}
</style>
