<template lang="html">
  <div style="margin:10px 0 0 10px;" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
    <b-tabs content-class="mt-3" justified v-model="tabIndex">
      <b-tab :title-link-class="linkClass(index)" v-for="(i, index) in categories" :title="i.data.categoryName"
        :key="index">
        <b-container>
          <b-row>
            <b-col cols="12" sm="12" md="6" xl="6" style="margin-bottom:50px"
              v-for="(video, index) in getCategoryVideos(i.id)" :key="index">
              <videoComponent :videoObj="video"></videoComponent>
            </b-col>
          </b-row>
        </b-container>
      </b-tab>
    </b-tabs>
    <b-container v-if="categories.length == 0">
      <b-row>
        <b-col cols="12">
          <div>
            <b-card title="No Categories to view">
              <b-card-text>
                you dont have any category yet
              </b-card-text>
              <b-button @click="toggleModal('CatModal')">click to add some</b-button>
            </b-card>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import videoComponent from "../components/videoComponent.vue";
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
      touchStartX: 0,
      touchEndX: 0,
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
      "users",
    ]),
    ...mapGetters(["getCategoriesToSelect"]),
  },

  methods: {
    ...mapMutations(["removeCategory"]),
    ...mapActions(["fetchAllData"]),
    linkClass(idx) {
      if (this.tabIndex === idx) {
        localStorage.setItem("tab-index", this.tabIndex);
        return ["nav-tab-active"];
      } else {
        return ["nav-tab"];
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
    touchStart(event) {
      this.touchStartX = event.touches[0].clientX;
    },
    touchMove(event) {
      this.touchEndX = event.touches[0].clientX;
    },
    touchEnd() {
      const deltaX = this.touchEndX - this.touchStartX;
      if (deltaX > 50) {
        // Swipe right, go to the previous tab
        if (this.tabIndex > 0) {
          this.tabIndex--;
        }
      } else if (deltaX < -50) {
        // Swipe left, go to the next tab
        if (this.tabIndex < this.categories.length - 1) {
          this.tabIndex++;
        }
      }
    }
  },
  created() {
    const localStorageTabIndex = localStorage.getItem("tab-index");
    this.tabIndex = parseInt(localStorageTabIndex);
  },
};
</script>


<style lang="css">
.nav-tab {
  color: var(--text);
}

.nav-tabs .nav-tab-active.active {
  color: var(--text);
  background-color: var(--tab_bkg);
  border-bottom-color: transparent;
}

.nav-tabs .nav-tab:hover {
  color: var(--text);
}

.w-tab2 {
  border: solid 2px black;
  background-color: red;
}

.w-highlight-container {
  border: solid 2px black;
  background-color: #ffd;
}

.tab-content {
  height: calc(100vh - (124px)) !important;
}
</style>
