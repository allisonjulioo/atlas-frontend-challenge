<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { siteUrl } = useRuntimeConfig().public

useHead({
  titleTemplate: title => (title ? `${title} · Atlas` : 'Atlas · Catálogo de profissionais'),
  link: [{ rel: 'canonical', href: siteUrl }],
})
</script>
