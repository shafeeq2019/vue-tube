<template>
  <BModal v-model="isOpen" centered title="Rename category" @hidden="resetModal()">
    <BAlert variant="danger" :model-value="!!errorMessage" dismissible @close="errorMessage = ''">
      {{ errorMessage }}
    </BAlert>
    <form id="rename-category-form" @submit.prevent="submit()">
      <label class="vt-label mb-0">
        Name
        <input v-model="name" class="vt-input" type="text" maxlength="100" />
      </label>
    </form>
    <template #footer>
      <button type="button" class="vt-btn vt-btn-ghost" @click="store.closeModal()">Cancel</button>
      <button type="submit" form="rename-category-form" class="vt-btn vt-btn-primary">Rename</button>
    </template>
  </BModal>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useAppStore } from "../stores/app.js";

const store = useAppStore();
const name = ref("");
const errorMessage = ref("");
const saving = ref(false);
// Renames the category shown on the dashboard.
const categoryID = ref(null);

const isOpen = computed({
  get: () => store.activeModal === "renameCategory",
  set: (open) => (open ? store.openModal("renameCategory") : store.closeModal()),
});

watch(
  isOpen,
  (open) => {
    const category = store.activeCategory;
    if (open && category) {
      categoryID.value = category.id;
      name.value = category.data.categoryName;
    }
  },
  { immediate: true }
);

async function submit() {
  if (saving.value) {
    return;
  }
  const newName = name.value.trim();
  if (!categoryID.value || !newName) {
    errorMessage.value = "Please enter a new name";
    return;
  }
  if (newName.length > 100) {
    errorMessage.value = "The name can be at most 100 characters long";
    return;
  }
  errorMessage.value = "";
  saving.value = true;
  try {
    await store.renameCategory(categoryID.value, newName);
    store.closeModal();
  } catch (error) {
    console.error(error);
    errorMessage.value = "The category could not be renamed. Please try again.";
  } finally {
    saving.value = false;
  }
}

function resetModal() {
  categoryID.value = null;
  name.value = "";
  errorMessage.value = "";
}
</script>
