<template>
  <div class="dashboard" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
    <BTabs v-if="store.categories.length > 0" v-model:index="tabIndex" content-class="mt-3" justified>
      <BTab v-for="category in store.categories" :key="category.id" :title="category.data.categoryName">
        <BContainer>
          <BRow>
            <BCol
              v-for="video in store.videosByCategory[category.id] || []"
              :key="video.id"
              cols="12"
              md="6"
              class="mb-5"
            >
              <VideoCard :video="video" @remove="confirmDelete($event)" />
            </BCol>
          </BRow>
          <p v-if="!store.videosByCategory[category.id]" class="text-body-secondary">
            No videos in this category yet.
            <BLink @click="store.openModal('addVideo')">Add one</BLink>
          </p>
        </BContainer>
      </BTab>
    </BTabs>
    <BContainer v-else>
      <BCard title="No Categories to view">
        <BCardText>You don't have any categories yet.</BCardText>
        <BButton @click="store.openModal('addCategory')">Click to add one</BButton>
      </BCard>
    </BContainer>

    <BModal
      v-model="showDeleteConfirm"
      centered
      size="sm"
      title="Delete video"
      ok-title="Delete"
      ok-variant="danger"
      @ok="deleteVideo()"
    >
      Do you really want to delete "{{ videoToDelete?.data.video.title }}"?
    </BModal>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useAppStore } from "../stores/app.js";
import VideoCard from "../components/VideoCard.vue";

const TAB_INDEX_KEY = "tab-index";

const store = useAppStore();
const savedIndex = parseInt(localStorage.getItem(TAB_INDEX_KEY), 10);
const tabIndex = ref(Number.isNaN(savedIndex) ? 0 : savedIndex);
const videoToDelete = ref(null);
const showDeleteConfirm = ref(false);
let touchStartX = 0;
let touchEndX = 0;

watch(tabIndex, (index) => {
  localStorage.setItem(TAB_INDEX_KEY, index);
});

function confirmDelete(video) {
  videoToDelete.value = video;
  showDeleteConfirm.value = true;
}

async function deleteVideo() {
  try {
    await store.removeVideo(videoToDelete.value.id);
  } catch (error) {
    console.error(error);
  }
}

function touchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchEndX = touchStartX;
}

function touchMove(event) {
  touchEndX = event.touches[0].clientX;
}

function touchEnd() {
  const deltaX = touchEndX - touchStartX;
  if (deltaX > 50 && tabIndex.value > 0) {
    // Swipe right, go to the previous tab
    tabIndex.value--;
  } else if (deltaX < -50 && tabIndex.value < store.categories.length - 1) {
    // Swipe left, go to the next tab
    tabIndex.value++;
  }
}
</script>

<style scoped>
.dashboard {
  margin: 10px 0 0 10px;
}

.dashboard :deep(.tab-content) {
  min-height: calc(100vh - 124px);
}
</style>
