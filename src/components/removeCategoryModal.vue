<template lang="html">
  <div>
    <b-modal id="removeCategoryModal" centered title="Remove Category" @hidden="resetModal()">
      <div v-if="getCategoriesToSelect.length > 0">
        <b-form-select v-model="selectedCategory" :options="getCategoriesToSelect" size="md" class="inputs">
          <template slot="first">
            <option :value="null" disabled>Please select a category</option>
          </template>
        </b-form-select>
        <small v-if="selectedCategory">All videos in this category will be deleted as well.</small>
      </div>
      <div v-else>
        <b-alert show variant="warning">You don't have any categories to remove!</b-alert>
      </div>
      <div slot="modal-footer">
        <div v-if="getCategoriesToSelect.length > 0">
          <b-button size="sm" class="float-right" variant="danger" :disabled="!selectedCategory || removing"
            @click="remove()">Remove</b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      removing: false,
    };
  },
  computed: {
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
    ...mapActions(["removeCategory"]),
    async remove() {
      this.removing = true;
      await this.removeCategory();
      this.removing = false;
      this.$bvModal.hide("removeCategoryModal");
    },
    resetModal() {
      this.selectedCategory = null;
    },
  },
};
</script>

<style lang="css" scoped></style>
