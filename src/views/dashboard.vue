<template lang="html">
  <div style="margin:10px 0 0 10px;" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
    <b-tabs content-class="mt-3" justified v-model="tabIndex">
      <b-tab :title-link-class="linkClass(index)" v-for="(category, index) in categories"
        :title="category.data.categoryName" :key="category.id">
        <b-container>
          <b-row>
            <b-col cols="12" sm="12" md="6" xl="6" style="margin-bottom:50px"
              v-for="video in videosByCategory[category.id] || []" :key="video.id">
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
                You don't have any categories yet.
              </b-card-text>
              <b-button @click="toggleModal('CatModal')">Click to add one</b-button>
            </b-card>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import videoComponent from "../components/videoComponent.vue";
import { mapState, mapGetters } from "vuex";

const TAB_INDEX_KEY = "tab-index";

export default {
  components: {
    videoComponent,
  },
  data() {
    const savedIndex = parseInt(localStorage.getItem(TAB_INDEX_KEY), 10);
    return {
      tabIndex: Number.isNaN(savedIndex) ? 0 : savedIndex,
      touchStartX: 0,
      touchEndX: 0,
    };
  },
  computed: {
    ...mapState(["categories"]),
    ...mapGetters(["videosByCategory"]),
  },
  watch: {
    tabIndex(index) {
      localStorage.setItem(TAB_INDEX_KEY, index);
    },
  },

  methods: {
    linkClass(idx) {
      return this.tabIndex === idx ? ["nav-tab-active"] : ["nav-tab"];
    },
    toggleModal(ModalName) {
      this.$root.$emit("bv::toggle::modal", ModalName, "#btnToggle");
    },
    touchStart(event) {
      this.touchStartX = event.touches[0].clientX;
      this.touchEndX = this.touchStartX;
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

.tab-content {
  height: calc(100vh - (124px)) !important;
}
</style>
