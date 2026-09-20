<template>
  <AtlasProfessionalGrid
    :items="items"
    :favorites="ids"
    :base-path="basePath"
    :pending="pending"
    :priority-count="PRIORITY_CARD_COUNT"
    :skeleton-count="SKELETON_COUNT"
    @select="openProfile"
    @toggle-favorite="onToggleFavorite"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AtlasProfessionalGrid } from '@atlas/design-system'
import type { ProfessionalSummary } from '@atlas/contracts'
import { PRIORITY_CARD_COUNT, SKELETON_COUNT } from '@/modules/catalog/constants'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'
import { useCatalogNavigation } from '@/modules/catalog/hooks/useCatalogNavigation'
import { useFavorites } from '@/modules/catalog/hooks/useFavorites'

const { items, pending } = storeToRefs(useCatalogList())

const { basePath } = storeToRefs(useCatalogNavigation())

const { openProfile } = useCatalogNavigation()

const { ids } = storeToRefs(useFavorites())

const { toggle } = useFavorites()

const onToggleFavorite = (professional: ProfessionalSummary) => {
  toggle(professional.id)
}
</script>
