<template>
  <div>
    <h5 class="my-2">{{ video.data.video.title }}</h5>
    <div class="frame-container">
      <BButton size="sm" variant="danger" class="iframe-button" aria-label="Delete video" @click="emit('remove', video)">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
        </svg>
      </BButton>
      <iframe
        :src="video.data.video.url"
        :title="video.data.video.title"
        height="100%"
        width="100%"
        loading="lazy"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script setup>
defineProps({
  video: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["remove"]);
</script>

<style scoped>
.frame-container {
  position: relative;
  height: 250px;
  margin-bottom: 10px;
}

.iframe-button {
  display: none;
  position: absolute;
  top: 10px;
  left: 10px;
}

.frame-container:hover .iframe-button {
  display: initial;
}

/* Touch devices have no hover, so always show the delete button there */
@media (hover: none) {
  .iframe-button {
    display: initial;
  }
}
</style>
