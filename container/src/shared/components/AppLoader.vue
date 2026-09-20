<template>
  <div v-if="isVisible" class="app-loader" :class="{ 'app-loader--faded': isFaded }" role="status">
    <span class="app-loader__spinner" />
    <span class="app-loader__text">Carregando catálogo…</span>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppLoader } from '@/shared/hooks/useAppLoader'

const nuxtApp = useNuxtApp()

const { isVisible, isFaded } = storeToRefs(useAppLoader())

const { hide } = useAppLoader()

onMounted(() => {
  nuxtApp.hook('app:suspense:resolve', () => requestAnimationFrame(hide))

  if (!nuxtApp.isHydrating) {
    requestAnimationFrame(hide)
  }
})
</script>
