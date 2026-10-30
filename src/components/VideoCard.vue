<template>
  <div>
    <h5 class="my-2 text-truncate" :title="video.data.video.title">{{ video.data.video.title }}</h5>
    <div class="frame-container">
      <div class="video-actions">
        <BButton size="sm" variant="light" aria-label="Edit video" @click="emit('edit', video)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
          </svg>
        </BButton>
        <BButton size="sm" variant="danger" aria-label="Delete video" @click="emit('remove', video)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
          </svg>
        </BButton>
      </div>
      <iframe
        v-if="playing || !thumbnail"
        :src="playing ? video.data.video.url + '?autoplay=1' : video.data.video.url"
        :title="video.data.video.title"
        height="100%"
        width="100%"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
      ></iframe>
      <!-- Only a thumbnail until the user wants to watch: one iframe per video is heavy -->
      <button v-else type="button" class="thumbnail" :aria-label="'Play ' + video.data.video.title" @click="playing = true">
        <img :src="thumbnail" :alt="video.data.video.title" loading="lazy" />
        <span class="play-icon" aria-hidden="true">
          <svg viewBox="0 0 68 48" width="68" height="48">
            <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26" fill="#f00" />
            <path d="M45 24 27 14v20" fill="#fff" />
          </svg>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { thumbnailUrl } from "../utils/video.js";

const props = defineProps({
  video: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["edit", "remove"]);
const playing = ref(false);
const thumbnail = computed(() => thumbnailUrl(props.video.data.video.url));
</script>

<style scoped>
.frame-container {
  position: relative;
  height: 250px;
  margin-bottom: 10px;
}

.video-actions {
  display: none;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  gap: 6px;
}

.frame-container:hover .video-actions,
.frame-container:focus-within .video-actions {
  display: flex;
}

/* Touch devices have no hover, so always show the buttons there */
@media (hover: none) {
  .video-actions {
    display: flex;
  }
}

.thumbnail {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: hidden;
  background: #000;
  border: 1px solid var(--bs-border-color);
  border-radius: 4px;
  cursor: pointer;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.85;
  transition: opacity 0.15s;
}

.thumbnail:hover .play-icon,
.thumbnail:focus-visible .play-icon {
  opacity: 1;
}
</style>
