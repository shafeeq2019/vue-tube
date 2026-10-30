<template>
  <BModal v-model="isOpen" centered title="Add video" @hidden="resetModal()">
    <BAlert variant="success" :model-value="!!successMessage" dismissible @close="successMessage = ''">
      {{ successMessage }}
    </BAlert>
    <BAlert variant="danger" :model-value="!!errorMessage" dismissible @close="errorMessage = ''">
      {{ errorMessage }}
    </BAlert>
    <form id="add-video-form" @submit.prevent="submit()">
      <label class="vt-label">
        YouTube link
        <span class="link-input">
          <AppIcon name="link" />
          <input v-model="videoURL" type="url" placeholder="https://youtu.be/…" autocomplete="off" />
        </span>
      </label>

      <div class="preview">
        <div class="preview-thumb">
          <img v-if="previewThumbnail" :src="previewThumbnail" alt="" />
          <AppIcon v-else name="play" :size="18" />
        </div>
        <label class="vt-label preview-title">
          Title
          <input v-model="videoTitle" class="vt-input" type="text" placeholder="What is this video?" maxlength="200" />
        </label>
      </div>
    </form>
    <CategoryPicker v-model="categoryID" allow-create />
    <template #footer>
      <button type="button" class="vt-btn vt-btn-ghost" @click="store.closeModal()">Cancel</button>
      <button type="submit" form="add-video-form" class="vt-btn vt-btn-primary">
        {{ saveLabel }}
      </button>
    </template>
  </BModal>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useAppStore } from "../stores/app.js";
import { thumbnailUrl, toYouTubeEmbedUrl } from "../utils/video.js";
import AppIcon from "./AppIcon.vue";
import CategoryPicker from "./CategoryPicker.vue";

const store = useAppStore();
const videoTitle = ref("");
const videoURL = ref("");
const categoryID = ref(null);
const errorMessage = ref("");
const successMessage = ref("");
const saving = ref(false);

const isOpen = computed({
  get: () => store.activeModal === "addVideo",
  set: (open) => (open ? store.openModal("addVideo") : store.closeModal()),
});

const previewThumbnail = computed(() => thumbnailUrl(toYouTubeEmbedUrl(videoURL.value)));

const saveLabel = computed(() => {
  const category = store.categories.find((c) => c.id === categoryID.value);
  return category ? `Save to ${category.data.categoryName}` : "Save video";
});

// Preselect the category the user is looking at.
watch(
  isOpen,
  (open) => {
    if (open && !categoryID.value) {
      categoryID.value = store.activeCategory?.id || null;
    }
  },
  { immediate: true }
);

// The button stays enabled (disabling it would drop the focus out of the
// modal and break closing it with Escape), so guard against double submits.
async function submit() {
  if (saving.value) {
    return;
  }
  successMessage.value = "";
  const title = videoTitle.value.trim();
  if (!title || !videoURL.value || !categoryID.value) {
    errorMessage.value = "Please enter the link and a title and pick a category";
    return;
  }
  if (title.length > 200) {
    errorMessage.value = "The title can be at most 200 characters long";
    return;
  }
  const embedUrl = toYouTubeEmbedUrl(videoURL.value);
  if (!embedUrl) {
    errorMessage.value = "Please enter a valid YouTube video link";
    return;
  }
  errorMessage.value = "";
  saving.value = true;
  try {
    await store.addVideo(categoryID.value, { title: title, url: embedUrl });
    successMessage.value = "Video was added";
    videoTitle.value = "";
    videoURL.value = "";
  } catch (error) {
    console.error(error);
    errorMessage.value = "The video could not be saved. Please try again.";
  } finally {
    saving.value = false;
  }
}

// Prefill the form with a video shared via the PWA share target. A watcher
// (not the modal's show event) also covers a modal that mounts already open.
watch(
  () => [isOpen.value, store.pendingShare],
  ([open, shared]) => {
    if (open && shared) {
      videoTitle.value = shared.title || "";
      videoURL.value = shared.url || "";
      store.pendingShare = null;
    }
  },
  { immediate: true }
);

function resetModal() {
  videoTitle.value = "";
  videoURL.value = "";
  errorMessage.value = "";
  successMessage.value = "";
  categoryID.value = null;
}
</script>

<style scoped>
.link-input {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 14px;
  border: 1px solid var(--vt-border-strong);
  border-radius: var(--vt-radius);
  background: var(--vt-input-bg);
  color: var(--vt-muted);
}

.link-input:focus-within {
  border-color: var(--vt-accent);
  box-shadow: 0 0 0 3px var(--vt-accent-ring);
}

.link-input input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--vt-text);
  font: 400 15px var(--vt-font);
}

.preview {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  padding: 12px;
  border-radius: var(--vt-radius-lg);
  background: var(--vt-surface-2);
}

.preview-thumb {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 128px;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 10px;
  background: var(--vt-border);
  color: var(--vt-muted);
}

.preview-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-title {
  flex: 1;
  min-width: 0;
  margin: 0;
}

@media (max-width: 420px) {
  .preview {
    flex-direction: column;
    align-items: stretch;
  }

  .preview-thumb {
    width: 100%;
  }
}
</style>
