<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <AppLoader />
</template>

<script setup lang="ts">
import { APP_LOADER_STYLE } from '@/shared/constants'

const { siteUrl } = useRuntimeConfig().public

useHead({
  titleTemplate: title => (title ? `${title} · Atlas` : 'Atlas · Catálogo de profissionais'),
  link: [{ rel: 'canonical', href: siteUrl }],
  style: [{ innerHTML: APP_LOADER_STYLE }],
})
</script>
