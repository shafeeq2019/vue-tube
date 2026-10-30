<template>
  <BModal v-model="isOpen" centered title="Delete category" @hidden="resetModal()">
    <BAlert variant="danger" :model-value="!!errorMessage" dismissible @close="errorMessage = ''">
      {{ errorMessage }}
    </BAlert>
    <p v-if="category" class="mb-0">
      Delete “{{ category.data.categoryName }}”?
      <template v-if="videoCount > 0">
        Its {{ videoCount === 1 ? "video" : videoCount + " videos" }} will be deleted as well.
      </template>
    </p>
    <template #footer>
      <button type="button" class="vt-btn vt-btn-ghost" @click="store.closeModal()">Cancel</button>
      <button type="button" class="vt-btn vt-btn-danger-solid" :disabled="!category || removing" @click="remove()">
        Delete
      </button>
    </template>
  </BModal>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useAppStore } from "../stores/app.js";

const store = useAppStore();
const errorMessage = ref("");
const removing = ref(false);
// Fixed when the modal opens, so it never switches to another category.
const category = ref(null);

const isOpen = computed({
  get: () => store.activeModal === "removeCategory",
  set: (open) => (open ? store.openModal("removeCategory") : store.closeModal()),
});

const videoCount = computed(() =>
  category.value ? (store.videosByCategory[category.value.id] || []).length : 0
);

watch(
  isOpen,
  (open) => {
    if (open) {
      category.value = store.activeCategory;
    }
  },
  { immediate: true }
);

async function remove() {
  removing.value = true;
  try {
    await store.removeCategory(category.value.id);
    store.closeModal();
  } catch (error) {
    console.error(error);
    errorMessage.value = "The category could not be deleted. Please try again.";
  } finally {
    removing.value = false;
  }
}

function resetModal() {
  category.value = null;
  errorMessage.value = "";
}
</script>
