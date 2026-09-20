<template>
  <div class="catalog-page">
    <header class="catalog-page__hero">
      <h1 class="catalog-page__title">Encontre o profissional certo</h1>
      <p class="catalog-page__subtitle">
        Eletricistas, cabeleireiros, professores e mais, com valor, avaliação e disponibilidade à vista.
      </p>
    </header>

    <RemoteCatalogCatalogView />
  </div>
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

<style lang="scss" scoped>
.catalog-page {
  @apply flex flex-col gap-10;

  &__title {
    @apply text-3xl font-bold md:text-4xl;
  }

  &__subtitle {
    @apply mt-3 max-w-[56ch] text-lg text-content-muted;
  }
}
</style>
