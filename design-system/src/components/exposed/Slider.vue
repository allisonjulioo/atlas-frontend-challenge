<template>
  <div class="atlas-slider">
    <label class="atlas-slider__label" :for="id">{{ label }}</label>

    <div class="atlas-slider__control">
      <div class="atlas-slider__rail">
        <span class="atlas-slider__track" />

        <motion.span
          class="atlas-slider__fill"
          :animate="{ width: `${percent}%` }"
          :transition="FILL_TRANSITION"
        >
          <motion.span
            class="atlas-slider__thumb"
            :animate="{ x: '50%', y: '-50%', scale: isActive ? 1.2 : 1 }"
            :transition="THUMB_TRANSITION"
          />
        </motion.span>
      </div>

      <input
        :id="id"
        class="atlas-slider__input"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="current"
        :aria-valuetext="hint"
        @input="current = Number(($event.target as HTMLInputElement).value)"
        @change="emit('change', current)"
        @pointerdown="isActive = true"
        @pointerup="isActive = false"
        @focus="isActive = true"
        @blur="isActive = false"
      >
    </div>

    <p v-if="hint" class="atlas-slider__hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { motion } from 'motion-v'

const props = withDefaults(defineProps<{
  value: number
  min?: number
  max?: number
  step?: number
  id?: string
  label?: string
  hint?: string
}>(), { min: 0, max: 100, step: 1, id: 'atlas-slider', label: 'Selecionar valor', hint: '' })

const emit = defineEmits<{ change: [value: number] }>()

const FILL_TRANSITION = { type: 'spring', stiffness: 700, damping: 45 } as const

const THUMB_TRANSITION = { duration: 0.15, ease: [0.22, 1, 0.36, 1] }

const current = ref(props.value)
const isActive = ref(false)

const percent = computed(() => {
  const range = props.max - props.min

  if (range <= 0) {
    return 0
  }

  return ((current.value - props.min) / range) * 100
})

watch(() => props.value, (value) => {
  current.value = value
})
</script>

<style lang="scss" scoped>
.atlas-slider {
  @apply flex flex-col;

  &__label {
    @apply absolute h-px w-px overflow-hidden whitespace-nowrap;

    clip-path: inset(50%);
  }

  &__control {
    @apply relative flex h-11 items-center px-2.5;
  }

  &__rail {
    @apply relative h-1.5 w-full;
  }

  &__track {
    @apply absolute inset-0 rounded-full bg-line;
  }

  &__fill {
    @apply absolute inset-y-0 left-0 rounded-full bg-brand;
  }

  &__thumb {
    @apply absolute right-0 top-1/2 block h-5 w-5 rounded-full border-2 border-surface bg-brand shadow-card;
  }

  &__input {
    @apply absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0;

    &::-webkit-slider-thumb {
      @apply h-5 w-5 appearance-none;
    }

    &::-moz-range-thumb {
      @apply h-5 w-5 border-none;
    }
  }

  &__hint {
    @apply text-xs text-content-subtle;
  }
}
</style>
