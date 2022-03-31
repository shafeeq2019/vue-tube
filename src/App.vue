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
html {
  height: 100%;
}

body {
  height: 100%;
}

.content {
  margin-top: 80px;
}

.text-center {
  text-align: center;
}

.heading {
  margin-bottom: 20px;
}

.inputs {
  margin-bottom: 10px;
  border-radius: 8px;
}

.submit-button {
  margin-top: 10px;
}

.navbar-button {
  margin: 3px;
}
</style>
