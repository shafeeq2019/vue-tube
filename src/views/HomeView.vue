<template>
  <AuthLayout>
    <template #hero>
      <div class="d-flex flex-wrap gap-2">
        <RouterLink to="/signUp" class="vt-btn vt-btn-primary vt-btn-lg">Get started – it's free</RouterLink>
        <RouterLink to="/login" class="vt-btn vt-btn-ghost vt-btn-lg">Log in</RouterLink>
      </div>
    </template>
    <ul class="features">
      <li v-for="feature in features" :key="feature.title" class="vt-card feature">
        <h2 class="vt-display h5 mb-1">{{ feature.title }}</h2>
        <p class="vt-muted mb-0">{{ feature.text }}</p>
      </li>
    </ul>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from "../components/AuthLayout.vue";

const features = [
  { title: "Your own categories", text: "Sort documentaries, music and tutorials onto separate shelves." },
  { title: "Synced everywhere", text: "Changes show up instantly in every open tab and on all your devices." },
  { title: "Share from YouTube", text: "Install VueTube as an app and use Share → VueTube in the YouTube app." },
];
</script>

<style scoped>
.features {
  display: flex;
  flex: 1 1 340px;
  flex-direction: column;
  gap: 12px;
  max-width: 440px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.feature {
  padding: 24px;
}
</style>
