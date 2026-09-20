<template>
  <nav class="atlas-bottom-nav" :aria-label="label">
    <a
      v-for="item in items"
      :key="item.href"
      class="atlas-bottom-nav__item"
      :class="{ 'atlas-bottom-nav__item--active': item.active }"
      :href="item.href"
      :aria-current="item.active ? 'page' : undefined"
      @click="emit('navigate', item, $event)"
    >
      <svg class="atlas-bottom-nav__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          :d="item.icon"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
      </svg>

      <span class="atlas-bottom-nav__label">{{ item.label }}</span>
      <span v-if="item.badge" class="atlas-bottom-nav__badge">{{ item.badge }}</span>
    </a>
  </nav>
</template>

<script setup lang="ts">
import type { BottomNavItem } from '../../shared/models/components'

withDefaults(defineProps<{
  items: BottomNavItem[]
  label?: string
}>(), { label: 'Navegação principal' })

const emit = defineEmits<{ navigate: [item: BottomNavItem, event: MouseEvent] }>()
</script>

<style lang="scss" scoped>
.atlas-bottom-nav {
  @apply fixed inset-x-0 bottom-0 z-30 grid auto-cols-fr grid-flow-col border-t border-line
    bg-surface/95 backdrop-blur lg:hidden;

  padding-bottom: env(safe-area-inset-bottom);

  &__item {
    @apply relative flex min-h-14 flex-col items-center justify-center gap-1 px-2
      text-[0.6875rem] font-medium text-content-muted no-underline;

    &--active {
      @apply text-accent;
    }
  }

  &__icon {
    @apply h-5 w-5;
  }

  &__label {
    @apply truncate;
  }

  &__badge {
    @apply absolute right-1/4 top-2 rounded-full bg-accent px-1.5 text-[0.625rem]
      font-semibold text-content-on-accent;
  }
}
</style>
