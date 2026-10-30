<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-if="name === 'play'" d="M5 2.8v10.4l8.6-5.2z" fill="currentColor" stroke="none" />
    <path v-else-if="name === 'plus'" d="M8 3v10M3 8h10" stroke-width="2" />
    <template v-else-if="name === 'search'">
      <circle cx="7" cy="7" r="4.8" />
      <path d="m10.6 10.6 3.4 3.4" />
    </template>
    <path v-else-if="name === 'edit'" d="M11 2.5 13.5 5 6 12.5 2.5 13.5 3.5 10z" />
    <path v-else-if="name === 'trash'" d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5" />
    <path v-else-if="name === 'close'" d="m4 4 8 8M12 4l-8 8" />
    <template v-else-if="name === 'more'">
      <circle cx="3" cy="8" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="13" cy="8" r="1.3" fill="currentColor" stroke="none" />
    </template>
    <path
      v-else-if="name === 'link'"
      d="M6.5 9.5a3 3 0 0 0 4.2 0l2.3-2.3a3 3 0 0 0-4.2-4.2l-.8.8M9.5 6.5a3 3 0 0 0-4.2 0L3 8.8A3 3 0 0 0 7.2 13l.8-.8"
    />
    <template v-else-if="name === 'sun'">
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
    </template>
    <path v-else-if="name === 'moon'" d="M13.5 9.5A5.5 5.5 0 1 1 6.5 2.5a4.5 4.5 0 0 0 7 7z" />
    <path v-else-if="name === 'logout'" d="M6 2.5H3.5v11H6M10.5 5l3 3-3 3M13.5 8H6.5" />
  </svg>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 16,
  },
});
</script>
