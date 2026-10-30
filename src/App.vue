<template>
  <div v-if="store.loading" class="d-flex justify-content-center align-items-center vh-100">
    <BSpinner label="Loading..." />
  </div>
  <div v-else id="apps">
    <div v-if="deferredPrompt" class="install-prompt" role="region" aria-label="Install app">
      <span>Install VueTube as an app to share videos straight from YouTube.</span>
      <span class="d-flex gap-2">
        <button type="button" class="vt-btn vt-btn-sm install-button" @click="install()">Install</button>
        <button type="button" class="vt-btn vt-btn-sm" @click="dismiss()">Not now</button>
      </span>
    </div>

    <div v-if="store.isAuthenticated" class="shell">
      <AppSidebar class="d-none d-lg-flex" />
      <div class="shell-main">
        <AppTopBar />
        <RouterView />
      </div>
      <button type="button" class="vt-btn vt-btn-primary fab d-lg-none" @click="store.openModal('addVideo')">
        <AppIcon name="plus" :size="18" />
        Add video
      </button>
      <AddCategoryModal />
      <RenameCategoryModal />
      <RemoveCategoryModal />
      <AddVideoModal />
      <EditVideoModal />
    </div>
    <template v-else>
      <AppHeader />
      <RouterView />
    </template>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Cookies from "js-cookie";
import { useAppStore } from "./stores/app.js";
import AppHeader from "./components/AppHeader.vue";
import AppSidebar from "./components/AppSidebar.vue";
import AppTopBar from "./components/AppTopBar.vue";
import AppIcon from "./components/AppIcon.vue";
import AddCategoryModal from "./components/AddCategoryModal.vue";
import AddVideoModal from "./components/AddVideoModal.vue";
import RemoveCategoryModal from "./components/RemoveCategoryModal.vue";
import RenameCategoryModal from "./components/RenameCategoryModal.vue";
import EditVideoModal from "./components/EditVideoModal.vue";

const store = useAppStore();
const route = useRoute();
const router = useRouter();
const deferredPrompt = ref(null);

// Leave protected pages when the session ends (e.g. sign out in another tab).
watch(
  () => store.isAuthenticated,
  (loggedIn) => {
    if (!loggedIn && route.matched.some((r) => r.meta.requiresAuth)) {
      router.push({ name: "login" });
    }
  }
);

function onBeforeInstallPrompt(e) {
  e.preventDefault();
  if (Cookies.get("add-to-home-screen") === undefined) {
    deferredPrompt.value = e;
  }
}

function onAppInstalled() {
  deferredPrompt.value = null;
}

function dismiss() {
  Cookies.set("add-to-home-screen", "dismissed", { expires: 5 });
  deferredPrompt.value = null;
}

async function install() {
  deferredPrompt.value.prompt();
  await deferredPrompt.value.userChoice;
  deferredPrompt.value = null;
}

onMounted(() => {
  window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  window.addEventListener("appinstalled", onAppInstalled);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  window.removeEventListener("appinstalled", onAppInstalled);
});
</script>

<style>
.shell {
  display: flex;
  min-height: 100vh;
}

.shell-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 28px;
  min-width: 0;
  padding: 24px clamp(16px, 3vw, 40px) 120px;
}

.fab {
  position: fixed;
  right: 20px;
  bottom: calc(24px + env(safe-area-inset-bottom));
  z-index: 10;
  height: 56px;
  padding: 0 22px 0 18px;
  border-radius: 28px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}

.install-prompt {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  padding: 10px clamp(16px, 3vw, 40px);
  background: var(--vt-accent);
  color: var(--vt-on-accent);
  font-size: 14px;
  font-weight: 500;
}

.install-prompt .vt-btn {
  color: var(--vt-on-accent);
  border-color: rgba(11, 11, 15, 0.35);
}

.install-prompt .install-button {
  background: var(--vt-on-accent);
  color: #fff;
}
</style>
