<template>
  <div class="atlas-empty" role="status">
    <svg class="atlas-empty__icon" viewBox="0 0 48 48" aria-hidden="true">
      <circle
        cx="21"
        cy="21"
        r="13"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      />
      <path
        d="M31 31l10 10"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />
    </svg>

    <h2 class="atlas-empty__title">{{ title }}</h2>
    <p v-if="description" class="atlas-empty__description">{{ description }}</p>

    <div v-if="$slots.default" class="atlas-empty__actions">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<style lang="scss" scoped>
.atlas-empty {
  @apply flex flex-col items-center gap-3 px-4 py-12 text-center;

  &__icon {
    @apply h-10 w-10 text-content-subtle;
  }

  &__title {
    @apply text-lg font-semibold;
  }

  &__description {
    @apply max-w-[44ch] text-sm text-content-muted;
  }

  &__actions {
    @apply mt-2;
  }
}
</style>
