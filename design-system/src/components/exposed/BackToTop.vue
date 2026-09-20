<template>
  <AnimatePresence>
    <motion.button
      v-if="isVisible"
      class="atlas-back-to-top"
      type="button"
      :aria-label="label"
      :initial="HIDDEN"
      :animate="VISIBLE"
      :exit="HIDDEN"
      :transition="TRANSITION"
      @click="scrollToTop"
    >
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M10 15.5V5m0 0L5.5 9.5M10 5l4.5 4.5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </motion.button>
  </AnimatePresence>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { AnimatePresence, motion } from 'motion-v'

const props = withDefaults(defineProps<{ threshold?: number, label?: string }>(), {
  threshold: 600,
  label: 'Voltar ao topo',
})

const TRANSITION = { type: 'spring', stiffness: 520, damping: 34 } as const

const HIDDEN = { opacity: 0, scale: 0.6, y: 12 }

const VISIBLE = { opacity: 1, scale: 1, y: 0 }

const isVisible = ref(false)

const sync = () => {
  isVisible.value = window.scrollY > props.threshold
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  sync()
  window.addEventListener('scroll', sync, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', sync))
</script>

<style lang="scss" scoped>
.atlas-back-to-top {
  @apply fixed bottom-24 right-5 z-30 grid h-12 w-12 place-items-center rounded-full border-none
    bg-brand text-content-on-brand shadow-overlay transition-colors duration-fast ease-atlas
    md:right-8 lg:bottom-8;

  &:hover {
    @apply bg-brand/90;
  }

  svg {
    @apply h-5 w-5;
  }
}
</style>
