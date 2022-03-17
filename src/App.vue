<template>
  <div id="apps">
    <appHeader v-if="isAuthonticated == false">
      <template #buttons>
        <b-button size="sm" class="my-2 my-sm-0" to="/login">login</b-button>
        <b-button size="sm" class="my-2 my-sm-0" to="/signUp">Sign Up</b-button>
      </template>
    </appHeader>
    <appHeader v-else-if="isAuthonticated == true">
      <template #buttons>
        <b-button @click="toggleModal('CatModal')" class="btn" size="sm"
          >Add Category</b-button
        >
        <b-button
          @click="toggleModal('FilmModal')"
          size="sm"
          class="my-2 my-sm-0"
          >Add video</b-button
        >
        <b-button
          size="sm"
          class="my-2 my-sm-0"
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
      "fetchData",
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
.btn {
  margin-left: 3px;
}
#content {
  margin-top: 80px;
  text-align: center;
}
</style>
