<template>
  <ul class="profile-gallery">
    <li v-for="(image, index) in gallery" :key="image.url" class="profile-gallery__item">
      <img
        class="profile-gallery__image"
        :src="image.url"
        :alt="image.alt"
        :width="image.width"
        :height="image.height"
        :loading="index === 0 ? 'eager' : 'lazy'"
        decoding="async"
      >
    </li>
  </ul>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useProfessionalDetails } from '@/modules/catalog/hooks/useProfessionalDetails'

const { gallery } = storeToRefs(useProfessionalDetails())
</script>

<style lang="scss" scoped>
.profile-gallery {
  @apply m-0 flex list-none gap-3 overflow-x-auto p-0 pb-2;

  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  scrollbar-width: thin;

  &__item {
    @apply w-[min(78vw,340px)] flex-none;

    scroll-snap-align: start;
  }

  &__image {
    @apply h-auto w-full rounded-control bg-surface-soft object-cover;

    aspect-ratio: 4 / 3;
  }
}
</style>
