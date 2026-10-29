<template>
  <BModal v-model="isOpen" centered title="Add Video" @hidden="resetModal()">
    <div v-if="store.categoryOptions.length > 0">
      <BAlert variant="success" :model-value="!!successMessage" dismissible @close="successMessage = ''">
        {{ successMessage }}
      </BAlert>
      <BAlert variant="danger" :model-value="!!errorMessage" dismissible @close="errorMessage = ''">
        {{ errorMessage }}
      </BAlert>
      <BFormInput v-model="videoTitle" type="text" placeholder="Enter a name for the video you want to add" />
      <BFormInput v-model="videoURL" type="url" placeholder="Enter a YouTube URL for the video you want to add" />
      <BFormSelect v-model="store.selectedCategory" :options="store.categoryOptions">
        <template #first>
          <option :value="null" disabled>Please select a category</option>
        </template>
      </BFormSelect>
    </div>
    <BAlert v-else :model-value="true" variant="warning">You don't have any categories yet!</BAlert>
    <template #footer>
      <BButton v-if="store.categoryOptions.length > 0" size="sm" @click="submit()">
        Add video
      </BButton>
    </template>
  </BModal>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAppStore } from "../stores/app.js";
import { toYouTubeEmbedUrl } from "../utils/video.js";

const store = useAppStore();
const videoTitle = ref("");
const videoURL = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const saving = ref(false);

const isOpen = computed({
  get: () => store.activeModal === "addVideo",
  set: (open) => (open ? store.openModal("addVideo") : store.closeModal()),
});

// The button stays enabled (disabling it would drop the focus out of the
// modal and break closing it with Escape), so guard against double submits.
async function submit() {
  if (saving.value) {
    return;
  }
  successMessage.value = "";
  const title = videoTitle.value.trim();
  if (!title || !videoURL.value || !store.selectedCategory) {
    errorMessage.value =
      "Please enter a name and the URL for the new video and select a category";
    return;
  }
  const embedUrl = toYouTubeEmbedUrl(videoURL.value);
  if (!embedUrl) {
    errorMessage.value = "Please enter a valid YouTube video URL";
    return;
  }
  errorMessage.value = "";
  saving.value = true;
  try {
    await store.addVideo(store.selectedCategory, { title: title, url: embedUrl });
    successMessage.value = "Video was added successfully";
    videoTitle.value = "";
    videoURL.value = "";
  } catch (error) {
    console.error(error);
    errorMessage.value = "The video could not be saved. Please try again.";
  } finally {
    saving.value = false;
  }
}

function resetModal() {
  videoTitle.value = "";
  videoURL.value = "";
  errorMessage.value = "";
  successMessage.value = "";
  store.selectedCategory = null;
}
</script>
