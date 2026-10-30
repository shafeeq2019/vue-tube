<template>
  <BModal v-model="isOpen" centered title="Edit video" @hidden="resetModal()">
    <BAlert variant="danger" :model-value="!!errorMessage" dismissible @close="errorMessage = ''">
      {{ errorMessage }}
    </BAlert>
    <form id="edit-video-form" @submit.prevent="submit()">
      <label class="vt-label">
        Title
        <input v-model="title" class="vt-input" type="text" maxlength="200" />
      </label>
    </form>
    <CategoryPicker v-model="categoryID" />
    <template #footer>
      <button type="button" class="vt-btn vt-btn-ghost" @click="store.closeModal()">Cancel</button>
      <button type="submit" form="edit-video-form" class="vt-btn vt-btn-primary">Save</button>
    </template>
  </BModal>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useAppStore } from "../stores/app.js";
import CategoryPicker from "./CategoryPicker.vue";

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
