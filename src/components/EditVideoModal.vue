<template>
  <BModal v-model="isOpen" centered title="Edit Video" @hidden="resetModal()">
    <BAlert variant="danger" :model-value="!!errorMessage" dismissible @close="errorMessage = ''">
      {{ errorMessage }}
    </BAlert>
    <BForm @submit.prevent="submit()">
      <label class="form-label" for="edit-video-title">Title</label>
      <BFormInput id="edit-video-title" v-model="title" type="text" />
      <label class="form-label" for="edit-video-category">Category</label>
      <BFormSelect id="edit-video-category" v-model="categoryID" :options="store.categoryOptions" />
    </BForm>
    <template #footer>
      <BButton size="sm" variant="secondary" @click="store.closeModal()">Cancel</BButton>
      <BButton size="sm" variant="primary" @click="submit()">Save</BButton>
    </template>
  </BModal>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useAppStore } from "../stores/app.js";

const store = useAppStore();
const title = ref("");
const categoryID = ref(null);
const errorMessage = ref("");
const saving = ref(false);

const isOpen = computed({
  get: () => store.activeModal === "editVideo",
  set: (open) => (open ? store.openModal("editVideo") : store.closeModal()),
});

watch(
  () => store.editingVideo,
  (video) => {
    if (video) {
      title.value = video.data.video.title;
      categoryID.value = video.data.categoryID;
      errorMessage.value = "";
    }
  },
  { immediate: true }
);

async function submit() {
  if (saving.value || !store.editingVideo) {
    return;
  }
  const newTitle = title.value.trim();
  if (!newTitle || !categoryID.value) {
    errorMessage.value = "Please enter a title and select a category";
    return;
  }
  if (newTitle.length > 200) {
    errorMessage.value = "The title can be at most 200 characters long";
    return;
  }
  saving.value = true;
  try {
    await store.updateVideo(store.editingVideo.id, {
      title: newTitle,
      categoryID: categoryID.value,
    });
    store.closeModal();
  } catch (error) {
    console.error(error);
    errorMessage.value = "The video could not be saved. Please try again.";
  } finally {
    saving.value = false;
  }
}

function resetModal() {
  store.editingVideo = null;
  errorMessage.value = "";
}
</script>
