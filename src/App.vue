<template>
  <div id="apps" v-if="loading === false">
    <div v-if="deferredPrompt" class="install-prompt">
      <div class="alert alert-info rounded-0" role="alert">
        <b-container fluid>
          <b-row>
            <b-col class="d-flex align-items-center" sm="12" md="6" xl="6">
              Install this site as an app for a better experience!
            </b-col>
            <b-col sm="12" md="6" xl="6" class="d-flex justify-content-end">
              <b-button size="sm" @click="install()" style="margin-right:6px">Install</b-button>
              <b-button size="sm" @click="dismiss()">Dismiss</b-button>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
    <appHeader v-if="isAuthonticated === false">
      <template #buttons>
        <b-button size="sm" class="navbar-button" to="/login">login</b-button>
        <b-button size="sm" class="navbar-button" to="/signUp">Sign Up</b-button>
      </template>
    </appHeader>
    <appHeader v-else-if="isAuthonticated == true">
      <template #buttons>
        <b-button @click="toggleModal('CatModal')" class="navbar-button" size="sm">Add Category</b-button>
        <b-button @click="toggleModal('FilmModal')" size="sm" class="navbar-button">Add video</b-button>
        <b-button size="sm" class="navbar-button" @click="toggleModal('removeCategoryModal')">Remove a category</b-button>
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
import Cookies from "js-cookie";
export default {
  components: {
    ...GlobalComponents,
  },
  data: function () {
    return {
      category: "",
      deferredPrompt: null
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
      "loading"
    ]),
    ...mapGetters(["getCategoriesToSelect"]),
  },
  methods: {
    ...mapMutations([
      "logout",
      "AddCategory",
      "clearField",
      "addVideoMutation",
      "updateLoadingState"
    ]),
    ...mapActions(["fetchAllData"]),
    toggleModal(ModalName) {
      this.$root.$emit("bv::toggle::modal", ModalName, "#btnToggle");
    },
    async dismiss() {
      Cookies.set("add-to-home-screen", null, { expires: 5 });
      this.deferredPrompt = null;
    },
    async install() {
      this.deferredPrompt.prompt();
    }
  },
  created() {
    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      if (Cookies.get("add-to-home-screen") === undefined) {
        this.deferredPrompt = e;
      }
    });
    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
    });
    this.updateLoadingState(true);
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

html,
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

.nav-tabs .nav-link.active,
.nav-tabs .nav-item.show .nav-link {
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

.nav-tabs .nav-link:hover,
.nav-tabs .nav-link:focus {
  border-color: var(--border_color);
}

.nav-tabs .nav-tab-active.active {
  border-bottom-color: transparent;
}

.card {
  color: var(--text);
  background-color: var(--card_color);
}


.install-prompt .alert {
  margin-bottom: 0
}

.install-prompt .alert-info {
  color: #ffff;
  background-color: #0089F3;
  border-color: #0089F3;
}
</style>
