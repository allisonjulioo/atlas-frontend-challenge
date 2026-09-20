<template>
  <p class="atlas-price" :class="`atlas-price--${size}`">
    <span class="atlas-price__value">{{ formatPrice(value) }}</span>
    <span class="atlas-price__unit">/{{ unit }}</span>
  </p>
</template>

<script setup lang="ts">
import { formatPrice } from '@atlas/contracts'

withDefaults(defineProps<{
  value: number
  unit?: string
  size?: 'sm' | 'md' | 'lg'
}>(), { unit: 'hora', size: 'md' })
</script>

<style lang="scss" scoped>
.atlas-price {
  @apply flex items-baseline gap-px text-content;

  &__value {
    @apply font-bold tabular-nums;
  }

  &__unit {
    @apply text-xs text-content-subtle;
  }

  &--sm &__value {
    @apply text-sm;
  }

  &--md &__value {
    @apply text-lg;
  }

  &--lg &__value {
    @apply text-3xl;
  }
}
</style>
