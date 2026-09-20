<template>
  <component
    :is="as"
    class="atlas-button"
    :class="[`atlas-button--${variant}`, `atlas-button--${size}`, { 'atlas-button--block': block }]"
    v-bind="attributes"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'text'
  size?: 'sm' | 'md'
  as?: 'button' | 'a'
  href?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  block?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  as: 'button',
  type: 'button',
})

const attributes = computed(() => {
  if (props.as === 'a') {
    return { 'href': props.disabled ? undefined : props.href, 'aria-disabled': props.disabled || undefined }
  }

  return { type: props.type, disabled: props.disabled }
})
</script>

<style lang="scss" scoped>
.atlas-button {
  @apply inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control
    border-none font-semibold leading-none no-underline
    transition-colors duration-fast ease-atlas;

  &--sm {
    @apply min-h-9 px-3 py-2 text-sm;
  }

  &--md {
    @apply min-h-control px-5 py-3 text-sm;
  }

  &--block {
    @apply flex w-full;
  }

  &--primary {
    @apply bg-brand text-content-on-brand;

    &:hover {
      @apply bg-brand/90;
    }
  }

  &--accent {
    @apply bg-accent text-content-on-accent;

    &:hover {
      @apply bg-accent/90;
    }
  }

  &--secondary {
    @apply bg-surface-soft text-content;

    &:hover {
      @apply bg-surface-soft;
    }
  }

  &--ghost {
    @apply bg-transparent text-content-muted;

    &:hover {
      @apply bg-surface-soft text-content;
    }
  }

  &--text {
    @apply bg-transparent px-0 text-content-subtle;

    &:hover {
      @apply bg-transparent text-content;
    }

    &:focus-visible {
      @apply text-content outline-none;
    }
  }

  &:disabled,
  &[aria-disabled='true'] {
    @apply pointer-events-none opacity-55;
  }
}
</style>
