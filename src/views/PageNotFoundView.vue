<template>
  <main class="not-found">
    <p class="code vt-display" aria-hidden="true">404</p>
    <h1 class="vt-display h2">Looks like you're lost</h1>
    <p class="vt-muted">The page you are looking for is not available.</p>
    <RouterLink to="/" class="vt-btn vt-btn-primary">Go to home</RouterLink>
  </main>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(48px, 10vw, 120px) 16px;
  text-align: center;
}

.code {
  margin: 0;
  font-size: clamp(96px, 20vw, 180px);
  line-height: 1;
  color: var(--vt-accent);
}
</style>
