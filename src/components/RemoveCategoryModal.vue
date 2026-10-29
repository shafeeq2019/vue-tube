<template>
  <BModal v-model="isOpen" centered title="Remove Category" @hidden="resetModal()">
    <div v-if="store.categoryOptions.length > 0">
      <BAlert variant="danger" :model-value="!!errorMessage" dismissible @close="errorMessage = ''">
        {{ errorMessage }}
      </BAlert>
      <BFormSelect v-model="selectedCategory" :options="store.categoryOptions">
        <template #first>
          <option :value="null" disabled>Please select a category</option>
        </template>
      </BFormSelect>
      <small v-if="selectedCategory">All videos in this category will be deleted as well.</small>
    </div>
    <BAlert v-else :model-value="true" variant="warning">You don't have any categories to remove!</BAlert>
    <template #footer>
      <BButton
        v-if="store.categoryOptions.length > 0"
        size="sm"
        variant="danger"
        :disabled="!selectedCategory || removing"
        @click="remove()"
      >
        Remove
      </BButton>
    </template>
  </BModal>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAppStore } from "../stores/app.js";

const store = useAppStore();
const selectedCategory = ref(null);
const errorMessage = ref("");
const removing = ref(false);

const isOpen = computed({
  get: () => store.activeModal === "removeCategory",
  set: (open) => (open ? store.openModal("removeCategory") : store.closeModal()),
});

async function remove() {
  removing.value = true;
  try {
    await store.removeCategory(selectedCategory.value);
    store.closeModal();
  } catch (error) {
    console.error(error);
    errorMessage.value = "The category could not be removed. Please try again.";
  } finally {
    removing.value = false;
  }
}

function resetModal() {
  selectedCategory.value = null;
  errorMessage.value = "";
}
</script>
