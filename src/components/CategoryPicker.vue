<template>
  <fieldset class="picker">
    <legend class="vt-label mb-2">Category</legend>
    <div class="options">
      <button
        v-for="option in store.categoryOptions"
        :key="option.value"
        type="button"
        class="vt-chip"
        :aria-pressed="modelValue === option.value"
        @click="emit('update:modelValue', option.value)"
      >
        {{ option.text }}
      </button>
      <template v-if="allowCreate">
        <form v-if="creating" class="new-form" @submit.prevent="create()">
          <label class="vt-sr-only" for="new-category-name">New category name</label>
          <input
            id="new-category-name"
            ref="nameInput"
            v-model="newName"
            class="vt-input"
            type="text"
            placeholder="New category"
            maxlength="100"
            @keydown.esc.stop="creating = false"
          />
          <button type="submit" class="vt-btn vt-btn-ghost vt-btn-sm" :disabled="saving">Add</button>
        </form>
        <button v-else type="button" class="vt-chip vt-chip-dashed" @click="startCreating()">
          <AppIcon name="plus" :size="14" />
          New
        </button>
      </template>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
  </fieldset>
</template>

<script setup>
import { nextTick, ref } from "vue";
import { useAppStore } from "../stores/app.js";
import AppIcon from "./AppIcon.vue";

defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  // Offer creating a category right here
  allowCreate: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);
const store = useAppStore();
const creating = ref(false);
const newName = ref("");
const saving = ref(false);
const error = ref("");
const nameInput = ref(null);

async function startCreating() {
  creating.value = true;
  error.value = "";
  await nextTick();
  nameInput.value.focus();
}

async function create() {
  const name = newName.value.trim();
  if (!name || saving.value) {
    return;
  }
  saving.value = true;
  try {
    const id = await store.addCategory(name);
    emit("update:modelValue", id);
    newName.value = "";
    creating.value = false;
  } catch (e) {
    console.error(e);
    error.value = "The category could not be saved. Please try again.";
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.picker {
  margin: 0 0 8px;
  padding: 0;
  border: 0;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.new-form {
  display: flex;
  gap: 8px;
}

.new-form .vt-input {
  width: 180px;
  height: 40px;
}

.error {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--vt-danger);
}
</style>
