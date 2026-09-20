<template>
  <span class="atlas-rating" role="img" :aria-label="label">
    <template v-if="variant === 'compact'">
      <svg class="atlas-rating__star" viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.21l-4.94 2.6.94-5.5-4-3.9 5.53-.8z"
          fill="currentColor"
        />
      </svg>
      <strong class="atlas-rating__value">{{ formatRating(value) }}</strong>
      <span v-if="count !== undefined" class="atlas-rating__count">({{ formatReviewCount(count) }})</span>
    </template>

    <template v-else>
      <span class="atlas-rating__stars" aria-hidden="true">
        <span class="atlas-rating__track">★★★★★</span>
        <span class="atlas-rating__fill" :style="{ width: fillPercentage }">★★★★★</span>
      </span>
      <strong class="atlas-rating__value">{{ formatRating(value) }}</strong>
      <span v-if="count !== undefined" class="atlas-rating__count">{{ formatReviewCount(count) }} avaliações</span>
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatRating, formatReviewCount } from '@atlas/contracts'

const props = withDefaults(defineProps<{
  value: number
  count?: number
  variant?: 'compact' | 'full'
}>(), { variant: 'compact' })

const MAX_RATING = 5

const fillPercentage = computed(() => {
  const clamped = Math.max(0, Math.min(MAX_RATING, props.value))

  return `${(clamped / MAX_RATING) * 100}%`
})

const label = computed(() => {
  if (props.count === undefined) {
    return `Nota ${formatRating(props.value)} de ${MAX_RATING}`
  }

  return `Nota ${formatRating(props.value)} de ${MAX_RATING}, ${props.count} avaliações`
})
</script>

<style lang="scss" scoped>
.atlas-rating {
  @apply inline-flex items-center gap-1 text-[0.8125rem] text-content-muted;

  &__star {
    @apply h-3.5 w-3.5 flex-none text-rating;
  }

  &__value {
    @apply font-semibold text-content;
  }

  &__stars {
    @apply relative inline-block text-base leading-none tracking-[1px];
  }

  &__track {
    @apply text-content-subtle;
  }

  &__fill {
    @apply absolute inset-0 overflow-hidden whitespace-nowrap text-rating;
  }
}
</style>
