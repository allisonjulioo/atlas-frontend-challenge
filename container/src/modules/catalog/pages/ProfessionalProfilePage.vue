<template>
  <div class="profile-page">
    <nav class="profile-page__breadcrumb" aria-label="Você está em">
      <NuxtLink :to="{ name: ROUTE_NAME.catalogList }">Catálogo</NuxtLink>
      <span aria-hidden="true">/</span>
      <span>{{ meta.title || 'Perfil' }}</span>
    </nav>

    <RemoteCatalogProfessionalProfile />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePageMeta } from '@atlas/contracts'
import { PROFILE_BASE_PATH, ROUTE_NAME } from '@/shared/constants'

const route = useRoute()

const { siteUrl } = useRuntimeConfig().public

const { meta } = storeToRefs(usePageMeta())

const canonical = computed(() => `${siteUrl}${PROFILE_BASE_PATH}/${route.params.slug}`)

useSeoMeta({
  title: () => meta.value.title || 'Perfil do profissional',
  description: () => meta.value.description,
  ogType: 'profile',
  ogImage: () => meta.value.image ?? undefined,
})

useHead({
  link: [{ rel: 'canonical', href: canonical }],
  meta: [{ name: 'robots', content: computed(() => (meta.value.notFound ? 'noindex,nofollow' : 'index,follow')) }],
  script: computed(() => (meta.value.structuredData
    ? [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({ ...meta.value.structuredData, url: canonical.value }),
      }]
    : [])),
})
</script>

<style lang="scss" scoped>
.profile-page {
  @apply flex flex-col gap-8;

  &__breadcrumb {
    @apply flex items-center gap-2 text-xs text-content-subtle;

    a {
      @apply text-content-muted no-underline;

      &:hover {
        @apply text-brand;
      }
    }
  }
}
</style>
