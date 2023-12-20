<template>
  <div id="apps">
    <appHeader v-if="isAuthonticated == false">
      <template #buttons>
        <b-button size="sm" class="navbar-button" to="/login">login</b-button>
        <b-button size="sm" class="navbar-button" to="/signUp"
          >Sign Up</b-button
        >
      </template>
    </appHeader>
    <appHeader v-else-if="isAuthonticated == true">
      <template #buttons>
        <b-button
          @click="toggleModal('CatModal')"
          class="navbar-button"
          size="sm"
          >Add Category</b-button
        >
        <b-button
          @click="toggleModal('FilmModal')"
          size="sm"
          class="navbar-button"
          >Add video</b-button
        >
        <b-button
          size="sm"
          class="navbar-button"
          @click="toggleModal('removeCategoryModal')"
          >Remove a category</b-button
        >
      </template>
    </appHeader>
    <addCategoryModal />
    <addVideoModal />
    <removeCategoryModal />
    <router-view />
  </div>
</template>
<script>
import GlobalComponents from "./GlobalComponents.js";
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";

export default {
  components: {
    ...GlobalComponents,
  },
  data: function() {
    return {
      category: "",
    };
  },
  computed: {
    ...mapState([
      "userID",
      "response",
      "isAuthonticated",
      "showSuccessAlert",
      "showErrorAlert",
      "selectedCategory",
    ]),
    ...mapGetters(["getCategoriesToSelect"]),
  },
  methods: {
    ...mapMutations([
      "logout",
      "AddCategory",
      "clearField",
      "addVideoMutation",
    ]),
    ...mapActions(["fetchAllData"]),
    toggleModal(ModalName) {
      this.$root.$emit("bv::toggle::modal", ModalName, "#btnToggle");
    },
  },
  created() {
    this.fetchAllData();
  },
};
</script>

<style>
/*CSS Params */
:root {
  --contentMargin: 80px;
  --text_light: hsl(255, 36%, 17%);
  --bkg_light: hsl(0%, 0%%, 100%);
  --model_bkg_light: #ffff;
  --border_light: #dee2e6;
  --card_light: #ffff;

  --text_dark: #CCCCCC;
  --bkg_dark: hsl(218, 15.4%, 10.2%);
  --model_bkg_dark: hsl(218, 15.4%, 10.2%);
  --border_dark: #4b4a4a;
  --card_dark: #343a40;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text: var(--text_dark);
    --bkg: var(--bkg_dark);
    --modal_bkg: var(--model_bkg_dark);
    --dropdown_bkg: var(--dark);
    --tab_bkg: var(--bkg_dark);
    --border_color: var(--border_dark);
    --card_color: var(--card_dark);
  }
}

[color-scheme="dark"] {
  --text: var(--text_dark);
  --bkg: var(--bkg_dark);
  --modal_bkg: var(--model_bkg_dark);
  --dropdown_bkg: var(--dark);
  --tab_bkg: var(--bkg_dark);
  --border_color: var(--border_dark);
  --card_color: var(--card_dark);
}

@media (prefers-color-scheme: light) {
  :root {
    --text: var(--text_light);
    --bkg: var(--bkg_light);
    --modal_bkg: var(--model_bkg_light);
    --dropdown_bkg: var(--light);
    --tab_bkg: var(--white);
    --border_color: var(--border_light);
    --card_color: var(--card_light);
  }
}

[color-scheme="light"] {
  --text: var(--text_light);
  --bkg: var(--bkg_light);
  --modal_bkg: var(--model_bkg_light);
  --dropdown_bkg: var(--light);
  --tab_bkg: var(--white);
  --border_color: var(--border_light);
  --card_color: var(--card_light);
}

html {
  height: 100%;
}

body {
  height: 100%;
}

body,
.custom-select,
.form-control,
.form-control::placeholder,
.form-control:focus,
.close,
.close:hover {
  color: var(--text);
  background-color: var(--bkg);
}

.dropdown-menu,
.dropdown-item {
  color: var(--text);
  background-color: var(--dropdown_bkg);
}

iframe {
  border: 1px solid var(--border_color);
  border-radius: 4px;
}

.modal-content {
  color: var(--text);
  background-color: var(--modal_bkg);
}

.content {
  margin-top: var(--contentMargin);
}

/* iframe {
  border: 1px solid black;
  border-radius: 4px;
} */

.text-center {
  text-align: center;
}

.heading {
  margin-bottom: 20px;
}

.form-control,
.custom-select {
  margin-bottom: 10px;
  border-radius: 8px;
}

/* .inputs {
  margin-bottom: 10px;
  border-radius: 8px;
} */

.submit-button {
  margin-top: 10px;
}

.navbar-button {
  margin: 3px;
}

.nav-tabs {
  border-bottom: 1px solid var(--border_color);
}

.nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link { 
  border-color: var(--border_color);
}

.form-control {
  border: 1px solid var(--border_color);
}

.custom-select {
  border: 1px solid var(--border_color);
}

.modal-header {
  border-bottom: 1px solid var(--border_color);
}

.modal-footer {
  border-top: 1px solid var(--border_color);
}

.nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus {
    border-color: var(--border_color);
}

.nav-tabs .nav-tab-active.active {
    border-bottom-color: transparent;
}

.card {
  color: var(--text);
  background-color: var(--card_color);
}

</style>
