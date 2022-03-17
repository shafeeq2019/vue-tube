<template lang="html">
  <div>
    <b-modal id="FilmModal" centered title="Add Video" @hidden="resetModal()">
      <div v-if="getCategoriesToSelect.length > 0">
        <b-alert variant="success" :show="showSuccessAlert" dismissible
          >Video was added successfully</b-alert
        >
        <b-alert variant="danger" :show="showErrorAlert" dismissible
          >Please enter a name and the URL for the new Video and selecet a
          Category
        </b-alert>
        <b-form-input
          type="text"
          placeholder="Enter a name for the video you want to add"
          v-model="videoTitle"
          style="margin-bottom:5px;"
        />
        <b-form-input
          type="url"
          placeholder="Enter a URL for the video you want to add"
          v-model="videoURL"
          style="margin-bottom:5px;"
        />
        <b-form-select
          v-model="selectedCategory"
          :options="getCategoriesToSelect"
          size="md"
          class="mb-3"
        >
          <template slot="first">
            <option :value="null" disabled>Please select a category</option>
          </template>
        </b-form-select>
      </div>
      <div v-else>
        <b-alert show variant="warning">You dont have any category !</b-alert>
      </div>
      <div slot="modal-footer">
        <div v-if="getCategoriesToSelect.length > 0">
          <b-button class="btn" size="sm" @click="addVideoFunction()"
            >Add video</b-button
          >
        </div>
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
      videoTitle: "",
      videoURL: "",
    };
  },
  methods: {
    ...mapMutations(["fetchData", "logout", "AddCategory", "clearAlerts"]),
    ...mapActions(["addVideo"]),
    toggleModal(ModalName) {
      this.$root.$emit("bv::toggle::modal", ModalName, "#btnToggle");
    },
    addVideoFunction() {
      let video;
      if (this.selectedCategory && this.videoURL && this.videoTitle) {
        const embedLink =
          "https://www.youtube.com/embed/" +
          this.videoURL.split("watch?v=").pop();
        //https://www.youtube.com/watch?v=zqclF5UPkEE
        //https://www.youtube.com/embed/zqclF5UPkEE
        video = {
          title: this.videoTitle,
          url: embedLink,
        };
        this.addVideo(video);
      }
    },
    resetModal() {
      this.category = "";
      this.videoTitle = "";
      this.videoURL = "";
      this.selectedCategory = null;
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
    selectedCategory: {
      get() {
        return this.$store.state.selectedCategory;
      },
      set(value) {
        this.$store.commit("changeSelectedCategory", value);
      },
    },
  },
};
</script>

<style lang="css" scoped></style>
