<template>
  <AtlasCarousel class="profile-gallery" label="Trabalhos recentes">
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
  </AtlasCarousel>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AtlasCarousel } from '@atlas/design-system'
import { useProfessionalDetails } from '@/modules/catalog/hooks/useProfessionalDetails'

const { gallery } = storeToRefs(useProfessionalDetails())
</script>

<style lang="scss" scoped>
.profile-gallery {
  &__item {
    @apply w-[min(78vw,340px)];
  }

  &__image {
    @apply h-auto w-full rounded-control bg-surface-soft object-cover;

    aspect-ratio: 4 / 3;
  }
}
</style>
