<template>
  <ul class="profile-reviews">
    <li v-for="review in reviews" :key="review.id" class="profile-reviews__item">
      <header class="profile-reviews__head">
        <strong class="profile-reviews__author">{{ review.author }}</strong>
        <AtlasRating :value="review.rating" />
      </header>

      <p class="profile-reviews__comment">{{ review.comment }}</p>

      <time class="profile-reviews__date" :datetime="review.date">{{ formatMonthYear(review.date) }}</time>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AtlasRating } from '@atlas/design-system'
import { formatMonthYear } from '@atlas/contracts'
import { useProfessionalDetails } from '@/modules/catalog/hooks/useProfessionalDetails'

const { reviews } = storeToRefs(useProfessionalDetails())
</script>

<style lang="scss">
.profile-reviews {
  @apply m-0 flex list-none flex-col gap-5 p-0;

  &__item {
    @apply flex flex-col gap-2;
  }

  &__head {
    @apply flex items-center gap-3;
  }

  &__author {
    @apply text-sm;
  }

  &__comment {
    @apply text-sm text-content-muted;
  }

  &__date {
    @apply text-xs text-content-subtle;
  }
}
</style>
