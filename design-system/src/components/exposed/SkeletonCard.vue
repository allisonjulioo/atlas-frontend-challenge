<template>
  <div class="atlas-skeleton" aria-hidden="true">
    <span class="atlas-skeleton__block atlas-skeleton__media" />

    <div class="atlas-skeleton__body">
      <div class="atlas-skeleton__row">
        <span class="atlas-skeleton__block atlas-skeleton__line atlas-skeleton__line--title" />
        <span class="atlas-skeleton__block atlas-skeleton__line atlas-skeleton__line--rating" />
      </div>

      <span class="atlas-skeleton__block atlas-skeleton__line atlas-skeleton__line--body" />

      <div class="atlas-skeleton__footer">
        <span class="atlas-skeleton__block atlas-skeleton__line atlas-skeleton__line--price" />
        <span class="atlas-skeleton__block atlas-skeleton__line atlas-skeleton__line--cta" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.atlas-skeleton {
  @apply flex flex-col overflow-hidden rounded-card border-none bg-surface shadow-card;

  &__block {
    @apply block rounded bg-surface-soft;

    animation: atlas-skeleton-pulse 1.4s cubic-bezier(0.22, 1, 0.36, 1) infinite;
  }

  &__media {
    @apply w-full rounded-none;

    aspect-ratio: 4 / 3;
  }

  &__body {
    @apply flex flex-1 flex-col gap-3 p-4;
  }

  &__row {
    @apply flex items-center justify-between gap-2;
  }

  &__footer {
    @apply mt-auto flex items-center justify-between gap-3 border-t border-line pt-3;
  }

  &__line {
    @apply h-3;

    &--title {
      @apply h-4 w-1/2;
    }

    &--rating {
      @apply w-14;
    }

    &--body {
      @apply w-full;
    }

    &--price {
      @apply h-4 w-20;
    }

    &--cta {
      @apply w-16;
    }
  }
}

@keyframes atlas-skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.55;
  }
}
</style>
