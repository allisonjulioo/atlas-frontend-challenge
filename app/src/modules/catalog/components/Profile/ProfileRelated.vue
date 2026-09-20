<template>
  <AtlasProfessionalGrid
    :items="related"
    :favorites="ids"
    :base-path="basePath"
    @select="openProfile"
    @toggle-favorite="onToggleFavorite"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AtlasProfessionalGrid } from '@atlas/design-system'
import type { ProfessionalSummary } from '@atlas/contracts'
import { useCatalogNavigation } from '@/modules/catalog/hooks/useCatalogNavigation'
import { useFavorites } from '@/modules/catalog/hooks/useFavorites'
import { useProfessional } from '@/modules/catalog/hooks/useProfessional'

const { related } = storeToRefs(useProfessional())

const { basePath } = storeToRefs(useCatalogNavigation())

const { openProfile } = useCatalogNavigation()

const { ids } = storeToRefs(useFavorites())

const { toggle } = useFavorites()

const onToggleFavorite = (professional: ProfessionalSummary) => {
  toggle(professional.id)
}
</script>
