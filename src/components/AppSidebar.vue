<template>
  <aside class="sidebar">
    <AppLogo class="px-2" />

    <nav aria-label="Categories" class="library">
      <p class="heading">Library</p>
      <button
        v-for="(category, index) in store.categories"
        :key="category.id"
        type="button"
        class="category"
        :aria-current="isActive(category) ? 'true' : null"
        @click="open(category)"
      >
        <span class="name">
          <span class="dot" :style="{ background: categoryColor(index) }"></span>
          <span class="text-truncate">{{ category.data.categoryName }}</span>
        </span>
        <span class="count">{{ (store.videosByCategory[category.id] || []).length }}</span>
      </button>
      <button type="button" class="vt-btn vt-btn-ghost new-category" @click="store.openModal('addCategory')">
        <AppIcon name="plus" />
        New category
      </button>
    </nav>

    <div class="bottom">
      <ThemeSwitch />
      <AccountMenu />
    </div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "../stores/app.js";
import { categoryColor } from "../utils/colors.js";
import AppLogo from "./AppLogo.vue";
import AppIcon from "./AppIcon.vue";
import ThemeSwitch from "./ThemeSwitch.vue";
import AccountMenu from "./AccountMenu.vue";

const store = useAppStore();
const route = useRoute();
const router = useRouter();

function isActive(category) {
  return route.name === "dashboard" && !store.searchQuery && store.activeCategory?.id === category.id;
}

function open(category) {
  store.setActiveCategory(category.id);
  store.searchQuery = "";
  if (route.name !== "dashboard") {
    router.push({ name: "dashboard" });
  }
}
</script>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 264px;
  height: 100vh;
  padding: 24px 16px;
  overflow-y: auto;
  border-right: 1px solid var(--vt-border);
  background: var(--vt-sidebar);
}

.library {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.heading {
  margin: 0 8px 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vt-muted);
}

.category {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 44px;
  padding: 0 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--vt-text-2);
  font: 500 14px var(--vt-font);
  text-align: left;
  cursor: pointer;
}

.category:hover {
  background: var(--vt-surface-2);
  color: var(--vt-text);
}

.category[aria-current="true"] {
  background: var(--vt-surface-2);
  color: var(--vt-text);
  font-weight: 600;
}

.category:focus-visible {
  outline: 2px solid var(--vt-accent);
  outline-offset: -2px;
}

.name {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.dot {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 4px;
}

.count {
  font-size: 12px;
  color: var(--vt-muted);
  font-variant-numeric: tabular-nums;
}

.new-category {
  margin-top: 8px;
  border-style: dashed;
}

.bottom {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
}
</style>
