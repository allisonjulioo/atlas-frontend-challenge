<template>
  <div class="atlas-tabs" role="tablist" :aria-label="label">
    <button
      v-for="option in options"
      :key="option.value"
      class="atlas-tabs__item"
      :class="{ 'atlas-tabs__item--active': option.value === modelValue }"
      type="button"
      role="tab"
      :aria-selected="option.value === modelValue"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
      <span v-if="option.count !== undefined" class="atlas-tabs__count">{{ option.count }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TabOption } from '../../shared/models/components'

withDefaults(defineProps<{
  options: TabOption[]
  modelValue: string
  label?: string
}>(), { label: 'Categorias' })

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style lang="scss" scoped>
.atlas-tabs {
  @apply flex gap-2 overflow-x-auto border-b border-line;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    @apply hidden;
  }

  &__item {
    @apply relative flex min-h-12 flex-none items-center gap-2 whitespace-nowrap border-none
      bg-transparent px-5 text-sm font-semibold text-content-muted
      transition-colors duration-fast ease-atlas;

    &::after {
      @apply absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-transparent;

      content: '';
    }

    &:hover {
      @apply text-content;
    }

    &--active {
      @apply text-accent;

      &::after {
        @apply bg-accent;
      }
    }
  }

  &__count {
    @apply rounded-full bg-surface-soft px-1.5 py-0.5 text-[0.6875rem] font-medium tabular-nums
      text-content-subtle;
  }
}
</style>
