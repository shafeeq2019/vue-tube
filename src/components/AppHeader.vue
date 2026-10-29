<template>
  <BNavbar toggleable="lg" variant="dark" data-bs-theme="dark" class="border-bottom">
    <BNavbarBrand :to="store.isAuthenticated ? '/dashboard' : '/'">VueTube</BNavbarBrand>

    <BNavbarToggle target="nav-collapse" />

    <BCollapse id="nav-collapse" is-nav>
      <BNavbarNav>
        <BNavItem :to="store.isAuthenticated ? '/dashboard' : '/'">Home</BNavItem>
        <BNavItem to="/about">About</BNavItem>
      </BNavbarNav>

      <!-- Right aligned nav items -->
      <BNavbarNav class="ms-auto align-items-lg-center">
        <BNavForm>
          <slot name="buttons"></slot>
        </BNavForm>
        <BNavItemDropdown v-if="store.isAuthenticated" end class="ms-lg-1">
          <template #button-content><em>{{ store.userEmail }}</em></template>
          <BDropdownItem @click="toggleTheme()">{{ theme === "dark" ? "Light" : "Dark" }} Mode</BDropdownItem>
          <BDropdownItem @click="signOut()">Sign Out</BDropdownItem>
        </BNavItemDropdown>
        <BNavItem v-else @click="toggleTheme()">{{ theme === "dark" ? "Light" : "Dark" }} Mode</BNavItem>
      </BNavbarNav>
    </BCollapse>
  </BNavbar>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../stores/app.js";
import { getCurrentTheme, saveTheme } from "../theme.js";

const store = useAppStore();
const router = useRouter();
const theme = ref(getCurrentTheme());

async function signOut() {
  await store.logout();
  router.push("/");
}

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
  saveTheme(theme.value);
}
</script>
