<template lang="html">
  <div style="margin:10px 0 0 10px;">
    <b-tabs content-class="mt-3" justified v-model="tabIndex">
      <b-tab
        :title-link-class="linkClass(index)"
        v-for="(i, index) in categories"
        :title="i.data.categoryName"
        :key="index"
      >
        <b-container>
          <b-row>
            <b-col
              cols="12"
              sm="12"
              md="6"
              xl="6"
              style="margin-bottom:50px"
              v-for="(video, index) in getCategoryVideos(i.id)"
              :key="index"
            >
              <videoComponent :videoObj="video"></videoComponent>
            </b-col>
          </b-row>
        </b-container>
      </b-tab>
    </b-tabs>
    <div v-if="categories.length < 1">
      <b-card
        bg-variant="dark"
        text-variant="white"
        title="No Categories to view"
        style="width:400px;"
      >
        <b-card-text>
          you dont have any category yet
        </b-card-text>
        <b-button @click="toggleModal('CatModal')">click to add some</b-button>
      </b-card>
    </div>
  </div>
</template>

<script>
import videoComponent from "./videoComponent.vue";
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import GlobalComponents from "../GlobalComponents.js";

export default {
  components: {
    videoComponent,
    ...GlobalComponents,
  },
  data() {
    return {
      tabIndex: 0,
      category: "",
    };
  },
  computed: {
    ...mapState([
      "userID",
      "categories",
      "isAuthonticated",
      "showSuccessAlert",
      "showErrorAlert",
      "selectedCategory",
      "videos",
      "users"
    ]),
    ...mapGetters(["getCategoriesToSelect"]),
  },

  methods: {
    ...mapMutations(["removeCategory", "fetchData"]),
    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ["text-dark"];
      } else {
        return ["text-dark"];
      }
    },
    toggleModal(ModalName) {
      this.$root.$emit("bv::toggle::modal", ModalName, "#btnToggle");
    },
    getCategoryVideos(categoryId) {
      let sortedVideos = [];
      for (let video of this.videos) {
        if (video.data.categoryID == categoryId) {
          sortedVideos.push(video);
        }
      }
      return sortedVideos;
    },
  },
  created() {},
};
</script>

<style lang="css" scoped>

</style>
