<template>
  <BDropdown
    :variant="null"
    no-caret
    :placement="placement"
    :toggle-class="compact ? 'account-toggle compact' : 'account-toggle'"
    :aria-label="'Account ' + store.userEmail"
    :wrapper-class="compact ? '' : 'w-100'"
  >
    <template #button-content>
      <span class="avatar" aria-hidden="true">{{ initial }}</span>
      <span v-if="!compact" class="who">
        <span class="label">Signed in as</span>
        <span class="email">{{ store.userEmail }}</span>
      </span>
    </template>
    <template v-if="compact">
      <BDropdownItem @click="saveTheme(theme === 'dark' ? 'light' : 'dark')">
        <AppIcon :name="theme === 'dark' ? 'sun' : 'moon'" class="me-2" />
        {{ theme === "dark" ? "Light" : "Dark" }} mode
      </BDropdownItem>
    </template>
    <BDropdownItem to="/about">About VueTube</BDropdownItem>
    <BDropdownItem @click="signOut()">
      <AppIcon name="logout" class="me-2" />
      Sign out
    </BDropdownItem>
  </BDropdown>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../stores/app.js";
import { theme, saveTheme } from "../theme.js";
import AppIcon from "./AppIcon.vue";

defineProps({
  // Only the avatar, for the mobile top bar
  compact: {
    type: Boolean,
    default: false,
  },
  placement: {
    type: String,
    default: "top-start",
  },
});

const store = useAppStore();
const router = useRouter();
const initial = computed(() => (store.userEmail || "?").charAt(0).toUpperCase());

async function signOut() {
  await store.logout();
  router.push("/");
}
</script>

<style scoped>
:deep(.account-toggle) {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 44px;
  padding: 8px;
  border: 0;
  border-radius: var(--vt-radius);
  background: transparent;
  color: var(--vt-text);
  text-align: left;
}

:deep(.account-toggle:hover),
:deep(.account-toggle.show) {
  background: var(--vt-surface-2);
}

:deep(.account-toggle.compact) {
  width: 44px;
  padding: 4px;
  border-radius: 22px;
}

.avatar {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background: #2b2540;
  color: #d4ccff;
  font-weight: 600;
  font-size: 14px;
}

.who {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.label {
  font-size: 12px;
  color: var(--vt-muted);
}

.email {
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
