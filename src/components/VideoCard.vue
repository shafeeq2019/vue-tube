<template>
  <article class="video-card">
    <div class="frame">
      <iframe
        v-if="playing || !thumbnail"
        :src="playing ? video.data.video.url + '?autoplay=1' : video.data.video.url"
        :title="video.data.video.title"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
      ></iframe>
      <!-- Only a thumbnail until the user wants to watch: one iframe per video is heavy -->
      <button v-else type="button" class="thumbnail" :aria-label="'Play ' + video.data.video.title" @click="playing = true">
        <img :src="thumbnail" alt="" loading="lazy" />
        <span class="play" aria-hidden="true"><AppIcon name="play" :size="18" /></span>
      </button>
      <div class="actions">
        <button type="button" class="action" aria-label="Edit video" title="Edit or move" @click="emit('edit', video)">
          <AppIcon name="edit" :size="15" />
        </button>
        <button type="button" class="action danger" aria-label="Delete video" title="Delete" @click="emit('remove', video)">
          <AppIcon name="trash" :size="15" />
        </button>
      </div>
    </div>
    <div class="info">
      <h2 class="title" :title="video.data.video.title">{{ video.data.video.title }}</h2>
      <p v-if="meta" class="meta">{{ meta }}</p>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from "vue";
import { thumbnailUrl } from "../utils/video.js";
import { timeAgo } from "../utils/time.js";
import AppIcon from "./AppIcon.vue";

const props = defineProps({
  video: {
    type: Object,
    required: true,
  },
  // Shown in front of the date, e.g. the category in search results
  label: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["edit", "remove"]);
const playing = ref(false);
const thumbnail = computed(() => thumbnailUrl(props.video.data.video.url));

const meta = computed(() => {
  const createdAt = props.video.data.createdAt;
  const added =
    createdAt && typeof createdAt.toMillis === "function" ? "added " + timeAgo(createdAt.toMillis()) : "";
  return [props.label, added].filter(Boolean).join(" · ");
});
</script>

<style scoped>
.video-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.frame {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--vt-radius-lg);
  background: var(--vt-surface-2);
}

iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.thumbnail {
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.thumbnail:hover img {
  transform: scale(1.03);
}

.thumbnail:focus-visible {
  outline: 3px solid var(--vt-accent);
  outline-offset: -3px;
  border-radius: var(--vt-radius-lg);
}

.play {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: var(--vt-overlay);
  color: #f2f2f5;
  transform: translate(-50%, -50%);
  transition: background-color 0.15s, transform 0.15s;
}

.thumbnail:hover .play,
.thumbnail:focus-visible .play {
  background: var(--vt-accent);
  color: var(--vt-on-accent);
  transform: translate(-50%, -50%) scale(1.06);
}

.actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.15s;
}

.frame:hover .actions,
.frame:focus-within .actions {
  opacity: 1;
}

/* Touch devices have no hover, so always show the buttons there */
@media (hover: none) {
  .actions {
    opacity: 1;
  }
}

.action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 10px;
  background: var(--vt-overlay);
  color: #f2f2f5;
  cursor: pointer;
}

.action:hover {
  background: rgba(11, 11, 15, 0.9);
}

.action.danger {
  color: #ff8e77;
}

.action:focus-visible {
  outline: 2px solid var(--vt-accent);
  outline-offset: 1px;
}

.info {
  padding: 0 2px;
}

.title {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.35;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.meta {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--vt-muted);
}
</style>
