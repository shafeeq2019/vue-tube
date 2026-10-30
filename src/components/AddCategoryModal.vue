<template>
  <BModal v-model="isOpen" centered title="New category" @hidden="resetModal()">
    <BAlert variant="danger" :model-value="!!errorMessage" dismissible @close="errorMessage = ''">
      {{ errorMessage }}
    </BAlert>
    <form id="add-category-form" @submit.prevent="submit()">
      <label class="vt-label mb-0">
        Name
        <input v-model="category" class="vt-input" type="text" placeholder="e.g. Music, Tutorials, Watch later" maxlength="100" />
      </label>
    </form>
    <template #footer>
      <button type="button" class="vt-btn vt-btn-ghost" @click="store.closeModal()">Cancel</button>
      <button type="submit" form="add-category-form" class="vt-btn vt-btn-primary">Create category</button>
    </template>
  </BModal>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAppStore } from "../stores/app.js";

const store = useAppStore();
const category = ref("");
const errorMessage = ref("");
const saving = ref(false);

const isOpen = computed({
  get: () => store.activeModal === "addCategory",
  set: (open) => (open ? store.openModal("addCategory") : store.closeModal()),
});

// The button stays enabled (disabling it would drop the focus out of the
// modal and break closing it with Escape), so guard against double submits.
async function submit() {
  if (saving.value) {
    return;
  }
  const name = category.value.trim();
  if (!name) {
    errorMessage.value = "Please enter a name for the new category";
    return;
  }
  if (name.length > 100) {
    errorMessage.value = "The name can be at most 100 characters long";
    return;
  }
  errorMessage.value = "";
  saving.value = true;
  try {
    // Show the new, still empty category right away.
    store.setActiveCategory(await store.addCategory(name));
    store.searchQuery = "";
    store.closeModal();
  } catch (error) {
    console.error(error);
    errorMessage.value = "The category could not be saved. Please try again.";
  } finally {
    saving.value = false;
  }
}

function resetModal() {
  category.value = "";
  errorMessage.value = "";
}
</script>
