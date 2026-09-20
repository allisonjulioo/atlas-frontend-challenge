<template>
  <span class="atlas-avatar" :style="style">
    <img
      v-if="!failed"
      class="atlas-avatar__image"
      :src="src"
      :alt="`Foto de ${name}`"
      :width="size"
      :height="size"
      :loading="loading"
      :fetchpriority="fetchpriority"
      decoding="async"
      @error="failed = true"
    >
    <span v-else class="atlas-avatar__initials" aria-hidden="true">{{ initials }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  src: string
  name: string
  size?: number
  loading?: 'lazy' | 'eager'
  fetchpriority?: 'high' | 'low' | 'auto'
}>(), { size: 72, loading: 'lazy', fetchpriority: 'auto' })

const INITIALS_LENGTH = 2

const failed = ref(false)

const initials = computed(() => props.name
  .split(' ')
  .filter(Boolean)
  .slice(0, INITIALS_LENGTH)
  .map(part => part.charAt(0).toUpperCase())
  .join(''))

const style = computed(() => ({ '--atlas-avatar-size': `${props.size}px` }))
</script>

<style lang="scss" scoped>
.atlas-avatar {
  @apply relative block flex-none overflow-hidden rounded-control bg-surface-soft;

  width: var(--atlas-avatar-size);
  height: var(--atlas-avatar-size);

  &__image {
    @apply h-full w-full object-cover;
  }

  &__initials {
    @apply grid h-full w-full place-items-center bg-surface-soft font-bold text-brand;

    font-size: calc(var(--atlas-avatar-size) * 0.36);
  }
}
</style>
