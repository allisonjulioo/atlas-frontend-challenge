<template>
  <RemoteCatalogCatalogView title="Explorar" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePageMeta } from '@atlas/contracts'

const route = useRoute()

const { siteUrl } = useRuntimeConfig().public

const { meta } = storeToRefs(usePageMeta())

const isFiltered = computed(() => Object.keys(route.query).length > 0)

useSeoMeta({
  title: () => meta.value.title || 'Encontre profissionais autônomos perto de você',
  description: () => meta.value.description,
  ogTitle: () => `${meta.value.title || 'Atlas'} · Atlas`,
  ogDescription: () => meta.value.description,
  ogType: 'website',
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/` }],
  meta: [{ name: 'robots', content: computed(() => (isFiltered.value ? 'noindex,follow' : 'index,follow')) }],
})
</script>
