<template lang="html">
  <div>
    <b-modal id="CatModal" centered title="Add Category" @hidden="resetModal()">
      <b-alert variant="success" :show="showSuccessAlert" dismissible
        >Category was added successfully</b-alert
      >
      <b-alert variant="danger" :show="showErrorAlert" dismissible
        >Please enter a name for the new category</b-alert
      >
      <b-form-input
        type="text"
        placeholder="Enter a name for the category you want to add"
        v-model="category"
      />
      <div slot="modal-footer">
        <b-button
          class="btn"
          size="sm"
          @click="addCategory(category)"
          >Add Category</b-button
        >
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      category: "",
    };
  },
  methods: {
    ...mapMutations(["fetchData", "logout", "clearAlerts", "addVideoMutation"]),
    ...mapActions(["addCategory"]),
    toggleModal(ModalName) {
      this.$root.$emit("bv::toggle::modal", ModalName, "#btnToggle");
    },
    resetModal() {
      this.category = null;
      this.clearAlerts();
    },
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
};
</script>

<style lang="css" scoped></style>
