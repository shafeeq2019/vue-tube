<template>
  <BModal v-model="isOpen" centered title="Rename Category" @hidden="resetModal()">
    <div v-if="store.categoryOptions.length > 0">
      <BAlert variant="success" :model-value="!!successMessage" dismissible @close="successMessage = ''">
        {{ successMessage }}
      </BAlert>
      <BAlert variant="danger" :model-value="!!errorMessage" dismissible @close="errorMessage = ''">
        {{ errorMessage }}
      </BAlert>
      <BFormSelect v-model="categoryID" :options="store.categoryOptions" @update:model-value="pickCategory">
        <template #first>
          <option :value="null" disabled>Please select a category</option>
        </template>
      </BFormSelect>
      <BForm @submit.prevent="submit()">
        <BFormInput v-model="name" type="text" placeholder="New name" :disabled="!categoryID" />
      </BForm>
    </div>
    <BAlert v-else :model-value="true" variant="warning">You don't have any categories yet!</BAlert>
    <template #footer>
      <BButton v-if="store.categoryOptions.length > 0" size="sm" @click="submit()">Rename</BButton>
    </template>
  </BModal>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAppStore } from "../stores/app.js";

const store = useAppStore();
const categoryID = ref(null);
const name = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const saving = ref(false);

const isOpen = computed({
  get: () => store.activeModal === "renameCategory",
  set: (open) => (open ? store.openModal("renameCategory") : store.closeModal()),
});

function pickCategory(id) {
  const category = store.categories.find((c) => c.id === id);
  name.value = category ? category.data.categoryName : "";
  successMessage.value = "";
}

async function submit() {
  if (saving.value) {
    return;
  }
  successMessage.value = "";
  const newName = name.value.trim();
  if (!categoryID.value || !newName) {
    errorMessage.value = "Please select a category and enter a new name";
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
    successMessage.value = "Category was renamed successfully";
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
  successMessage.value = "";
}
</script>
