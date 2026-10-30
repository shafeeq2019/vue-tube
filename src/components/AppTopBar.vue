<template>
  <div class="topbar">
    <div class="mobile-row d-lg-none">
      <AppLogo />
      <div class="d-flex gap-1">
        <button
          type="button"
          class="vt-icon-btn"
          :aria-label="searchOpen ? 'Close search' : 'Search videos'"
          :aria-expanded="searchOpen"
          @click="toggleSearch()"
        >
          <AppIcon :name="searchOpen ? 'close' : 'search'" :size="20" />
        </button>
        <AccountMenu compact placement="bottom-end" />
      </div>
    </div>

    <div class="search-row" :class="{ 'd-none d-lg-flex': !searchOpen }">
      <label class="search">
        <AppIcon name="search" :size="18" />
        <span class="vt-sr-only">Search videos</span>
        <input
          ref="searchInput"
          v-model="store.searchQuery"
          type="search"
          placeholder="Search all videos"
          @input="showResults()"
          @keydown.esc="clearSearch()"
        />
        <kbd class="d-none d-lg-inline">/</kbd>
      </label>
      <button type="button" class="vt-btn vt-btn-primary d-none d-lg-inline-flex" @click="store.openModal('addVideo')">
        <AppIcon name="plus" />
        Add video
      </button>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "../stores/app.js";
import AppLogo from "./AppLogo.vue";
import AppIcon from "./AppIcon.vue";
import AccountMenu from "./AccountMenu.vue";

const store = useAppStore();
const route = useRoute();
const router = useRouter();
const searchInput = ref(null);
const searchOpen = ref(!!store.searchQuery);

// Results are shown on the dashboard.
function showResults() {
  if (route.name !== "dashboard") {
    router.push({ name: "dashboard" });
  }
}

function clearSearch() {
  store.searchQuery = "";
}

async function toggleSearch() {
  searchOpen.value = !searchOpen.value;
  if (searchOpen.value) {
    await nextTick();
    searchInput.value.focus();
  } else {
    clearSearch();
  }
}

// "/" jumps to the search, unless the user is typing somewhere.
function onKeydown(event) {
  const target = event.target;
  const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
  if (event.key === "/" && !typing && !store.activeModal) {
    event.preventDefault();
    searchOpen.value = true;
    nextTick(() => searchInput.value.focus());
  }
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<style scoped>
.topbar {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.search {
  display: flex;
  flex: 1 1 320px;
  align-items: center;
  gap: 10px;
  max-width: 520px;
  height: 44px;
  margin: 0;
  padding: 0 14px;
  border: 1px solid var(--vt-border);
  border-radius: var(--vt-radius);
  background: var(--vt-surface);
  color: var(--vt-muted);
}

.search:focus-within {
  border-color: var(--vt-accent);
  box-shadow: 0 0 0 3px var(--vt-accent-ring);
}

.search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--vt-text);
  font: 400 14px var(--vt-font);
}

.search input::placeholder {
  color: var(--vt-muted);
}

kbd {
  padding: 2px 6px;
  border: 1px solid var(--vt-border-strong);
  border-radius: 6px;
  background: transparent;
  color: var(--vt-muted);
  font: 500 12px var(--vt-font);
}
</style>
