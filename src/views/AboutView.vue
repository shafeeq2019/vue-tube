<template>
  <main class="page">
    <p class="vt-muted mb-2">About</p>
    <h1 class="vt-display title">A home for the videos you want to keep.</h1>
    <p class="lead-text">
      At VueTube you can sign up for free and start adding your favourite YouTube videos right away. Sort them into
      your own categories, and they stay in sync on every device.
    </p>
  </main>
</template>

<style scoped>
.page {
  max-width: 720px;
  padding: clamp(24px, 6vw, 72px) clamp(16px, 4vw, 40px);
}

.title {
  margin: 0 0 20px;
  font-size: clamp(36px, 6vw, 56px);
  line-height: 1;
}

.lead-text {
  font-size: 18px;
  line-height: 1.6;
  color: var(--vt-muted);
}
</style>
