<template>
  <BModal v-model="isOpen" centered title="Add Category" @hidden="resetModal()">
    <BAlert variant="success" :model-value="!!successMessage" dismissible @close="successMessage = ''">
      {{ successMessage }}
    </BAlert>
    <BAlert variant="danger" :model-value="!!errorMessage" dismissible @close="errorMessage = ''">
      {{ errorMessage }}
    </BAlert>
    <BForm @submit.prevent="submit()">
      <BFormInput v-model="category" type="text" placeholder="Enter a name for the category you want to add" />
    </BForm>
    <template #footer>
      <BButton size="sm" @click="submit()">Add Category</BButton>
    </template>
  </BModal>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAppStore } from "../stores/app.js";

const store = useAppStore();
const category = ref("");
const errorMessage = ref("");
const successMessage = ref("");
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
  successMessage.value = "";
  const name = category.value.trim();
  if (!name) {
    errorMessage.value = "Please enter a name for the new category";
    return;
  }
  errorMessage.value = "";
  saving.value = true;
  try {
    await store.addCategory(name);
    successMessage.value = "Category was added successfully";
    category.value = "";
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
  successMessage.value = "";
}
</script>
