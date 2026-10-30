<template>
  <main class="auth-layout">
    <section class="hero" :class="{ compact }">
      <p class="badge-pill">
        <span class="dot"></span>
        Installable as an app · syncs across devices
      </p>
      <h1 class="headline vt-display">Your videos.<br />Your shelves.</h1>
      <p class="lead-text">
        Save YouTube videos into your own categories and find them again in seconds. Share straight from the YouTube
        app.
      </p>
      <slot name="hero"></slot>
      <div class="collage" aria-hidden="true">
        <span v-for="tile in tiles" :key="tile.color" :class="{ low: tile.low }" :style="{ background: tile.color }">
          <AppIcon v-if="tile.play" name="play" :size="22" />
        </span>
      </div>
    </section>
    <slot></slot>
  </main>
</template>

<script setup>
import AppIcon from "./AppIcon.vue";

defineProps({
  // Smaller headline next to a form
  compact: {
    type: Boolean,
    default: false,
  },
});

const tiles = [
  { color: "#3A2A2A" },
  { color: "#26313F", low: true },
  { color: "#2E2A3F" },
  { color: "#223532" },
  { color: "var(--vt-accent)", low: true, play: true },
  { color: "#3B3324" },
];
</script>

<style scoped>
.auth-layout {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 64px;
  max-width: 1280px;
  margin: 0 auto;
  padding: clamp(24px, 6vw, 72px) clamp(16px, 4vw, 40px) 72px;
}

.hero {
  display: flex;
  flex: 1 1 480px;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.badge-pill {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 6px 12px;
  border: 1px solid var(--vt-border-strong);
  border-radius: 999px;
  font-size: 13px;
  color: var(--vt-text-2);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: var(--vt-accent);
}

.headline {
  margin: 0;
  font-size: clamp(48px, 8vw, 88px);
  line-height: 0.95;
  letter-spacing: -0.045em;
}

.compact .headline {
  font-size: clamp(44px, 6vw, 72px);
}

.lead-text {
  max-width: 460px;
  margin: 0;
  font-size: 18px;
  line-height: 1.55;
  color: var(--vt-muted);
}

.collage {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  max-width: 520px;
  margin-top: 8px;
  padding-bottom: 16px;
}

.collage span {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  color: var(--vt-on-accent);
}

.collage .low {
  transform: translateY(16px);
}

@media (max-width: 991.98px) {
  .compact .collage {
    display: none;
  }
}
</style>
