<template>
  <span class="atlas-badge" :class="`atlas-badge--${tone}`">
    <slot name="icon" />
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'neutral' | 'brand' | 'accent' | 'soft' }>(), { tone: 'neutral' })
</script>

<style lang="scss" scoped>
.atlas-badge {
  @apply inline-flex items-center gap-1 whitespace-nowrap rounded-full border-none px-2 py-0.5
    text-[0.6875rem] font-semibold;

  &--neutral {
    @apply bg-surface-soft text-content-muted;
  }

  &--brand {
    @apply bg-brand text-content-on-brand;
  }

  &--accent {
    @apply bg-accent text-content-on-accent;
  }

  &--soft {
    @apply bg-brand/10 text-brand;
  }
}
</style>
