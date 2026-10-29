<template>
  <div v-if="store.loading" class="d-flex justify-content-center align-items-center vh-100">
    <BSpinner label="Loading..." />
  </div>
  <div v-else id="apps">
    <div v-if="deferredPrompt" class="install-prompt">
      <div class="alert alert-info rounded-0" role="alert">
        <BContainer fluid>
          <BRow>
            <BCol class="d-flex align-items-center" sm="12" md="6">
              Install this site as an app for a better experience!
            </BCol>
            <BCol sm="12" md="6" class="d-flex justify-content-end gap-2">
              <BButton size="sm" @click="install()">Install</BButton>
              <BButton size="sm" @click="dismiss()">Dismiss</BButton>
            </BCol>
          </BRow>
        </BContainer>
      </div>
    </div>
    <AppHeader>
      <template v-if="!store.isAuthenticated" #buttons>
        <BButton size="sm" class="navbar-button" to="/login">Login</BButton>
        <BButton size="sm" class="navbar-button" to="/signUp">Sign Up</BButton>
      </template>
      <template v-else #buttons>
        <BButton size="sm" class="navbar-button" @click="store.openModal('addCategory')">Add Category</BButton>
        <BButton size="sm" class="navbar-button" @click="store.openModal('addVideo')">Add video</BButton>
        <BButton size="sm" class="navbar-button" @click="store.openModal('removeCategory')">Remove a category</BButton>
      </template>
    </AppHeader>
    <template v-if="store.isAuthenticated">
      <AddCategoryModal />
      <AddVideoModal />
      <RemoveCategoryModal />
    </template>
    <RouterView />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Cookies from "js-cookie";
import { useAppStore } from "./stores/app.js";
import AppHeader from "./components/AppHeader.vue";
import AddCategoryModal from "./components/AddCategoryModal.vue";
import AddVideoModal from "./components/AddVideoModal.vue";
import RemoveCategoryModal from "./components/RemoveCategoryModal.vue";

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
:root {
  --contentMargin: 80px;
}

iframe {
  border: 1px solid var(--bs-border-color);
  border-radius: 4px;
}

.content {
  margin-top: var(--contentMargin);
}

.heading {
  margin-bottom: 20px;
}

.form-control,
.form-select {
  margin-bottom: 10px;
  border-radius: 8px;
}

.submit-button {
  margin-top: 10px;
}

.navbar-button {
  margin: 3px;
}

.install-prompt .alert {
  margin-bottom: 0;
}

.install-prompt .alert-info {
  color: #fff;
  background-color: #0089f3;
  border-color: #0089f3;
}
</style>
