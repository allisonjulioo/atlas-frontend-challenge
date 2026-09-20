<template>
  <button
    class="atlas-chip"
    :class="{ 'atlas-chip--active': active, 'atlas-chip--removable': removable }"
    type="button"
    :aria-pressed="removable ? undefined : active"
  >
    <slot />
    <span v-if="removable" class="atlas-chip__remove" aria-hidden="true">×</span>
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  active?: boolean
  removable?: boolean
}>(), { active: false, removable: false })
</script>

<style lang="scss" scoped>
.atlas-chip {
  @apply inline-flex min-h-9 items-center gap-2 whitespace-nowrap rounded-full border-none
    bg-surface-soft px-4 text-xs font-medium text-content transition-colors duration-fast ease-atlas;

  &:hover {
    @apply bg-surface-soft;
  }

  &--active {
    @apply bg-accent/10 font-semibold text-accent;

    &:hover {
      @apply bg-accent/20;
    }
  }

  &__remove {
    @apply text-sm leading-none text-content-subtle;
  }

  &--removable:hover &__remove {
    @apply text-accent;
  }
}
</style>
