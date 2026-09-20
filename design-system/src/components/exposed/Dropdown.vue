<template>
  <div ref="root" class="atlas-dropdown" @keydown.esc="close">
    <button
      :id="id"
      class="atlas-dropdown__trigger"
      type="button"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-label="label"
      @click="toggle"
    >
      <slot name="icon" />

      <span class="atlas-dropdown__value">{{ currentLabel }}</span>

      <motion.svg
        class="atlas-dropdown__caret"
        viewBox="0 0 20 20"
        aria-hidden="true"
        :animate="{ rotate: isOpen ? 180 : 0 }"
        :transition="CARET_TRANSITION"
      >
        <path
          d="M5.5 8l4.5 4.5L14.5 8"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
      </motion.svg>
    </button>

    <AnimatePresence>
      <motion.ul
        v-if="isOpen"
        class="atlas-dropdown__panel"
        role="listbox"
        :aria-label="label"
        :initial="PANEL_HIDDEN"
        :animate="PANEL_VISIBLE"
        :exit="PANEL_HIDDEN"
        :transition="PANEL_TRANSITION"
      >
        <li v-for="option in allOptions" :key="option.value">
          <button
            class="atlas-dropdown__option"
            :class="{ 'atlas-dropdown__option--selected': option.value === modelValue }"
            type="button"
            role="option"
            :aria-selected="option.value === modelValue"
            @click="select(option.value)"
          >
            {{ option.label }}
          </button>
        </li>
      </motion.ul>
    </AnimatePresence>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import type { SelectOption } from '../../shared/models/components'

const props = withDefaults(defineProps<{
  options: SelectOption[]
  modelValue: string
  id?: string
  label?: string
  placeholder?: string
}>(), { id: 'atlas-dropdown', label: 'Selecionar', placeholder: '' })

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const CARET_TRANSITION = { duration: 0.18, ease: [0.22, 1, 0.36, 1] }

const PANEL_TRANSITION = { duration: 0.18, ease: [0.22, 1, 0.36, 1] }

const PANEL_HIDDEN = { opacity: 0, y: -6, scale: 0.98 }

const PANEL_VISIBLE = { opacity: 1, y: 0, scale: 1 }

const root = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const allOptions = computed(() => {
  if (!props.placeholder) {
    return props.options
  }

  return [{ value: '', label: props.placeholder }, ...props.options]
})

const currentLabel = computed(() => {
  const selected = allOptions.value.find(option => option.value === props.modelValue)

  return selected?.label ?? props.placeholder ?? props.label
})

const close = () => {
  isOpen.value = false
}

const toggle = () => {
  isOpen.value = !isOpen.value
}

const select = (value: string) => {
  emit('update:modelValue', value)
  close()
}

const onDocumentPointerDown = (event: PointerEvent) => {
  if (root.value?.contains(event.target as Node)) {
    return
  }

  close()
}

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown))

onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown))
</script>

<style lang="scss" scoped>
.atlas-dropdown {
  @apply relative inline-flex;

  &__trigger {
    @apply inline-flex min-h-11 items-center gap-2 border-none bg-transparent p-0
      text-sm font-semibold text-content-subtle transition-colors duration-fast ease-atlas;

    &:hover {
      @apply text-content;
    }

    &:focus-visible {
      @apply text-content outline-none;
    }

    :slotted(svg) {
      @apply h-5 w-5 flex-none;
    }
  }

  &__value {
    @apply whitespace-nowrap;
  }

  &__caret {
    @apply h-4 w-4 flex-none;
  }

  &__panel {
    @apply absolute right-0 top-full z-30 m-0 mt-1 flex min-w-full list-none flex-col gap-0.5
      rounded-card border border-line bg-surface p-1 shadow-overlay;
  }

  &__option {
    @apply flex w-full min-h-10 items-center whitespace-nowrap rounded-control border-none
      bg-transparent px-3 text-left text-sm text-content transition-colors duration-fast ease-atlas;

    &:hover {
      @apply bg-surface-soft;
    }

    &--selected {
      @apply font-semibold text-brand;
    }
  }
}
</style>
