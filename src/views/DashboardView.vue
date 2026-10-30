<template>
  <div class="dashboard" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
    <!-- Search results across all categories -->
    <template v-if="store.searchQuery.trim()">
      <header class="page-header">
        <div>
          <p class="eyebrow">Search</p>
          <h1 class="page-title vt-display">“{{ store.searchQuery.trim() }}”</h1>
          <p class="vt-muted mb-0">{{ countLabel(store.searchResults.length, "result") }}</p>
        </div>
        <button type="button" class="vt-btn vt-btn-ghost vt-btn-sm" @click="store.searchQuery = ''">Clear search</button>
      </header>
      <div v-if="store.searchResults.length" class="video-grid">
        <VideoCard
          v-for="video in store.searchResults"
          :key="video.id"
          :video="video"
          :label="categoryNames[video.data.categoryID]"
          @edit="store.editVideo($event)"
          @remove="confirmDelete($event)"
        />
      </div>
      <p v-else class="vt-muted">No video title matches your search.</p>
    </template>

    <template v-else-if="category">
      <!-- On small screens the categories are chips instead of the sidebar -->
      <nav aria-label="Categories" class="chips d-lg-none">
        <button
          v-for="c in store.categories"
          :key="c.id"
          type="button"
          class="vt-chip"
          :aria-current="c.id === category.id ? 'true' : null"
          @click="store.setActiveCategory(c.id)"
        >
          {{ c.data.categoryName }}
          <span class="count">{{ (store.videosByCategory[c.id] || []).length }}</span>
        </button>
        <button type="button" class="vt-chip vt-chip-dashed" @click="store.openModal('addCategory')">
          <AppIcon name="plus" :size="14" />
          New
        </button>
      </nav>

      <header class="page-header">
        <div class="min-w-0">
          <p class="eyebrow d-none d-lg-block">Category</p>
          <h1 class="page-title vt-display text-break">{{ category.data.categoryName }}</h1>
          <p class="vt-muted mb-0">{{ countLabel(videos.length, "video") }}</p>
        </div>
        <div class="d-flex gap-2">
          <button
            type="button"
            class="vt-btn vt-btn-ghost vt-btn-sm"
            aria-label="Rename category"
            @click="store.openModal('renameCategory')"
          >
            <AppIcon name="edit" :size="14" />
            <span class="d-none d-sm-inline">Rename</span>
          </button>
          <button
            type="button"
            class="vt-btn vt-btn-danger vt-btn-sm"
            aria-label="Delete category"
            @click="store.openModal('removeCategory')"
          >
            <AppIcon name="trash" :size="14" />
            <span class="d-none d-sm-inline">Delete</span>
          </button>
        </div>
      </header>

      <div v-if="videos.length" class="video-grid">
        <VideoCard
          v-for="video in videos"
          :key="video.id"
          :video="video"
          @edit="store.editVideo($event)"
          @remove="confirmDelete($event)"
        />
      </div>
      <div v-else class="vt-card empty">
        <h2 class="vt-display h4 mb-2">Nothing here yet</h2>
        <p class="vt-muted">Add the first video to {{ category.data.categoryName }}.</p>
        <button type="button" class="vt-btn vt-btn-primary" @click="store.openModal('addVideo')">
          <AppIcon name="plus" />
          Add video
        </button>
      </div>
    </template>

    <div v-else class="vt-card empty">
      <h1 class="vt-display h3 mb-2">Create your first category</h1>
      <p class="vt-muted">Categories are your shelves: music, tutorials, watch later – whatever you like.</p>
      <button type="button" class="vt-btn vt-btn-primary" @click="store.openModal('addCategory')">
        <AppIcon name="plus" />
        New category
      </button>
    </div>

    <BModal v-model="showDeleteConfirm" centered size="sm" title="Delete video">
      Do you really want to delete “{{ videoToDelete?.data.video.title }}”?
      <template #footer>
        <button type="button" class="vt-btn vt-btn-ghost" @click="showDeleteConfirm = false">Cancel</button>
        <button type="button" class="vt-btn vt-btn-danger-solid" @click="deleteVideo()">Delete</button>
      </template>
    </BModal>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAppStore } from "../stores/app.js";
import VideoCard from "../components/VideoCard.vue";
import AppIcon from "../components/AppIcon.vue";

const store = useAppStore();
const videoToDelete = ref(null);
const showDeleteConfirm = ref(false);
let touchStartX = 0;
let touchEndX = 0;

const category = computed(() => store.activeCategory);
const videos = computed(() => (category.value && store.videosByCategory[category.value.id]) || []);
const categoryNames = computed(() =>
  Object.fromEntries(store.categories.map((c) => [c.id, c.data.categoryName]))
);

function countLabel(count, noun) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function confirmDelete(video) {
  videoToDelete.value = video;
  showDeleteConfirm.value = true;
}

async function deleteVideo() {
  showDeleteConfirm.value = false;
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

// Swipe between categories on touch screens
function touchEnd() {
  if (!category.value || store.searchQuery.trim()) {
    return;
  }
  const index = store.categories.findIndex((c) => c.id === category.value.id);
  const deltaX = touchEndX - touchStartX;
  if (deltaX > 50 && index > 0) {
    // Swipe right, go to the previous category
    store.setActiveCategory(store.categories[index - 1].id);
  } else if (deltaX < -50 && index < store.categories.length - 1) {
    // Swipe left, go to the next category
    store.setActiveCategory(store.categories[index + 1].id);
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.chips {
  display: flex;
  gap: 8px;
  margin: 0 calc(-1 * clamp(16px, 3vw, 40px));
  padding: 0 clamp(16px, 3vw, 40px) 4px;
  overflow-x: auto;
  scrollbar-width: none;
}

.page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.eyebrow {
  margin: 0 0 6px;
  font-size: 13px;
  color: var(--vt-muted);
}

.page-title {
  margin: 0 0 8px;
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1;
}

.min-w-0 {
  min-width: 0;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px 24px;
}

.empty {
  max-width: 560px;
}
</style>
