<template>
  <div class="atlas-carousel">
    <ul ref="viewport" class="atlas-carousel__viewport" :aria-label="label" @scroll="sync">
      <slot />
    </ul>

    <AnimatePresence>
      <motion.button
        v-if="canPrev"
        class="atlas-carousel__control atlas-carousel__control--prev"
        type="button"
        aria-label="Ver anteriores"
        :initial="CONTROL_HIDDEN"
        :animate="CONTROL_VISIBLE"
        :exit="CONTROL_HIDDEN"
        :transition="CONTROL_TRANSITION"
        @click="page(-1)"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M12.5 4.5L7 10l5.5 5.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </motion.button>
    </AnimatePresence>

    <AnimatePresence>
      <motion.button
        v-if="canNext"
        class="atlas-carousel__control atlas-carousel__control--next"
        type="button"
        aria-label="Ver proximos"
        :initial="CONTROL_HIDDEN"
        :animate="CONTROL_VISIBLE"
        :exit="CONTROL_HIDDEN"
        :transition="CONTROL_TRANSITION"
        @click="page(1)"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M7.5 4.5L13 10l-5.5 5.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </motion.button>
    </AnimatePresence>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { AnimatePresence, motion } from 'motion-v'

withDefaults(defineProps<{ label?: string }>(), { label: 'Galeria' })

const CONTROL_TRANSITION = { duration: 0.18, ease: [0.22, 1, 0.36, 1] }

const CONTROL_HIDDEN = { opacity: 0, scale: 0.8, y: '-50%' }

const CONTROL_VISIBLE = { opacity: 1, scale: 1, y: '-50%' }

const PAGE_RATIO = 0.8

const EDGE_TOLERANCE = 2

const viewport = ref<HTMLElement | null>(null)
const observer = ref<ResizeObserver>()
const canPrev = ref(false)
const canNext = ref(false)

const sync = () => {
  const element = viewport.value

  if (!element) {
    return
  }

  canPrev.value = element.scrollLeft > EDGE_TOLERANCE
  canNext.value = element.scrollLeft + element.clientWidth < element.scrollWidth - EDGE_TOLERANCE
}

const page = (direction: number) => {
  viewport.value?.scrollBy({ left: direction * viewport.value.clientWidth * PAGE_RATIO, behavior: 'smooth' })
}

onMounted(() => {
  sync()

  if (typeof ResizeObserver === 'undefined' || !viewport.value) {
    return
  }

  observer.value = new ResizeObserver(sync)
  observer.value.observe(viewport.value)
})

onBeforeUnmount(() => {
  observer.value?.disconnect()
  observer.value = undefined
})
</script>

<style lang="scss" scoped>
.atlas-carousel {
  @apply relative;

  &__viewport {
    @apply m-0 flex list-none gap-3 overflow-x-auto p-0;

    scroll-snap-type: x mandatory;
    overscroll-behavior-x: contain;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      @apply hidden;
    }
  }

  :slotted(li) {
    @apply flex-none;

    scroll-snap-align: start;
  }

  &__control {
    @apply absolute top-1/2 z-10 hidden h-10 w-10 place-items-center rounded-full
      border-none bg-surface text-content shadow-card transition-colors duration-fast ease-atlas md:grid;

    &:hover {
      @apply bg-surface-soft;
    }

    svg {
      @apply h-5 w-5;
    }

    &--prev {
      @apply left-2;
    }

    &--next {
      @apply right-2;
    }
  }
}
</style>
