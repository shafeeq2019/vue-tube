<template lang="html">
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">VueTube</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/dashboard" v-if="isAuthonticated == true"
            >Home</b-nav-item
          >
          <b-nav-item to="/" v-else>Home</b-nav-item>
          <b-nav-item to="/about">About</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <slot name="buttons"></slot>
          </b-nav-form>
          <b-nav-item-dropdown
            right
            v-if="isAuthonticated == true"
            style="margin-left:5px"
          >
            <!-- Using 'button-content' slot -->
            <template slot="button-content"
              ><em>{{ userEmail }}</em></template
            >
            <b-dropdown-item @click="changeColorTheme()"
              >{{ theme == "dark" ? "Light" : "Dark" }} Mode</b-dropdown-item
            >
            <b-dropdown-item @click="logout()" to="/">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { getCurrentThem, loadTheme } from "./dark_mode.js";
export default {
  components: {},
  computed: {
    ...mapState(["isAuthonticated", "userEmail"]),
  },
  methods: {
    ...mapActions(["logout"]),
    buttonText() {
      return getCurrentThem();
    },
    changeColorTheme() {
      let theme = getCurrentThem();
      if (theme === "dark") {
        theme = "light";
      } else {
        theme = "dark";
      }
      localStorage.setItem("vuetube.theme", theme);
      this.theme = getCurrentThem();
      loadTheme(theme);
    },
  },
  data() {
    return {
      theme: "",
    };
  },
  created() {
    this.theme = getCurrentThem();
  },
};
</script>

<style lang="css" scoped></style>
