<template lang="html">
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand :to="isAuthenticated ? '/dashboard' : '/'">VueTube</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/dashboard" v-if="isAuthenticated">Home</b-nav-item>
          <b-nav-item to="/" v-else>Home</b-nav-item>
          <b-nav-item to="/about">About</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <slot name="buttons"></slot>
          </b-nav-form>
          <b-nav-item-dropdown right v-if="isAuthenticated" style="margin-left:5px">
            <!-- Using 'button-content' slot -->
            <template slot="button-content"><em>{{ userEmail }}</em></template>
            <b-dropdown-item @click="changeColorTheme()">{{ theme == "dark" ? "Light" : "Dark" }} Mode</b-dropdown-item>
            <b-dropdown-item @click="signOut()">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getCurrentTheme, loadTheme } from "./dark_mode.js";
export default {
  computed: {
    ...mapState(["isAuthenticated", "userEmail"]),
  },
  methods: {
    ...mapActions(["logout"]),
    async signOut() {
      await this.logout();
      this.$router.push("/").catch(() => { });
    },
    changeColorTheme() {
      const theme = getCurrentTheme() === "dark" ? "light" : "dark";
      localStorage.setItem("vuetube.theme", theme);
      this.theme = theme;
      loadTheme(theme);
    },
  },
  data() {
    return {
      theme: "",
    };
  },
  created() {
    this.theme = getCurrentTheme();
  },
};
</script>

<style lang="css" scoped></style>
