<template lang="html">
  <div>
    <b-modal id="FilmModal" centered title="Add Video" @hidden="resetModal()">
      <div v-if="getCategoriesToSelect.length > 0">
        <b-alert variant="success" :show="showSuccessAlert" dismissible>Video was added successfully</b-alert>
        <b-alert variant="danger" :show="!!errorMessage" dismissible @dismissed="errorMessage = ''">{{ errorMessage }}</b-alert>
        <b-form-input type="text" placeholder="Enter a name for the video you want to add" v-model="videoTitle"
          class="inputs" />
        <b-form-input type="url" placeholder="Enter a YouTube URL for the video you want to add" v-model="videoURL"
          class="inputs" />
        <b-form-select v-model="selectedCategory" :options="getCategoriesToSelect" size="md" class="inputs">
          <template slot="first">
            <option :value="null" disabled>Please select a category</option>
          </template>
        </b-form-select>
      </div>
      <div v-else>
        <b-alert show variant="warning">You don't have any categories yet!</b-alert>
      </div>
      <div slot="modal-footer">
        <div v-if="getCategoriesToSelect.length > 0">
          <b-button class="btn" size="sm" @click="addVideoFunction()">Add video</b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import getVideoId from "get-video-id";

export default {
  data() {
    return {
      videoTitle: "",
      videoURL: "",
      errorMessage: "",
    };
  },
  methods: {
    ...mapMutations(["clearAlerts"]),
    ...mapActions(["addVideo"]),
    async addVideoFunction() {
      this.clearAlerts();
      const title = this.videoTitle.trim();
      if (!title || !this.videoURL || !this.selectedCategory) {
        this.errorMessage =
          "Please enter a name and the URL for the new video and select a category";
        return;
      }
      const { id, service } = getVideoId(this.videoURL.trim());
      if (!id || service !== "youtube") {
        this.errorMessage = "Please enter a valid YouTube video URL";
        return;
      }
      this.errorMessage = "";
      await this.addVideo({
        title: title,
        url: "https://www.youtube.com/embed/" + id,
      });
      if (this.showErrorAlert) {
        this.errorMessage = "The video could not be saved. Please try again.";
      } else {
        this.videoTitle = "";
        this.videoURL = "";
      }
    },
    resetModal() {
      this.videoTitle = "";
      this.videoURL = "";
      this.errorMessage = "";
      this.selectedCategory = null;
      this.clearAlerts();
    },
  },
  computed: {
    ...mapState(["showSuccessAlert", "showErrorAlert"]),
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
