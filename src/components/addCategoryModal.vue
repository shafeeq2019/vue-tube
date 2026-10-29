<template lang="html">
  <div>
    <b-modal id="CatModal" centered title="Add Category" @hidden="resetModal()">
      <b-alert variant="success" :show="showSuccessAlert" dismissible>Category was added successfully</b-alert>
      <b-alert variant="danger" :show="!!errorMessage" dismissible @dismissed="errorMessage = ''">{{ errorMessage }}</b-alert>
      <b-form @submit.prevent="submit()">
        <b-form-input class="inputs" type="text" placeholder="Enter a name for the category you want to add"
          v-model="category" />
      </b-form>
      <div slot="modal-footer">
        <b-button class="btn" size="sm" @click="submit()">Add Category</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      category: "",
      errorMessage: "",
    };
  },
  methods: {
    ...mapMutations(["clearAlerts"]),
    ...mapActions(["addCategory"]),
    async submit() {
      this.clearAlerts();
      const name = (this.category || "").trim();
      if (!name) {
        this.errorMessage = "Please enter a name for the new category";
        return;
      }
      this.errorMessage = "";
      await this.addCategory(name);
      if (this.showErrorAlert) {
        this.errorMessage = "The category could not be saved. Please try again.";
      } else {
        this.category = "";
      }
    },
    resetModal() {
      this.category = "";
      this.errorMessage = "";
      this.clearAlerts();
    },
  },
  computed: {
    ...mapState(["showSuccessAlert", "showErrorAlert"]),
  },
};
</script>

<style lang="css" scoped></style>
