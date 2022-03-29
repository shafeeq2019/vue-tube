<template lang="html">
  <div>
    <b-modal
      id="removeCategoryModal"
      centered
      title="Remove Category"
      @hidden="resetModal()"
    >
      <div v-if="getCategoriesToSelect.length > 0">
        <b-form-select
          v-model="selectedCategory"
          :options="getCategoriesToSelect"
          size="md"
          class="inputs"
        >
          <template slot="first">
            <option :value="null" disabled>Please select a category</option>
          </template>
        </b-form-select>
      </div>
      <div v-else>
        <b-alert show variant="warning"
          >You dont have any category to remove !</b-alert
        >
      </div>
      <div slot="modal-footer">
        <div v-if="getCategoriesToSelect.length > 0">
          <b-button
            size="sm"
            class="float-right"
            variant="danger"
            @click="removeCategory(selectedCategory)"
            >Remove</b-button
          >
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
export default {
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
    selectedCategory: {
      get() {
        return this.$store.state.selectedCategory;
      },
      set(value) {
        this.$store.commit("changeSelectedCategory", value);
      },
    },
  },

  methods: {
    ...mapMutations(["fetchData"]),
    ...mapActions(["removeCategory"]),
    toggleModal(ModalName) {
      this.$root.$emit("bv::toggle::modal", ModalName, "#btnToggle");
    },
    resetModal() {
      this.selectedCategory = null;
    },
  },
};
</script>

<style lang="css" scoped></style>
