<template>
  <AtlasTabs
    :options="categoryTabs"
    :model-value="selectedCategory"
    label="Categorias"
    @update:model-value="selectCategory"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AtlasTabs } from '@atlas/design-system'
import { useCatalogFacets } from '@/modules/catalog/hooks/useCatalogFacets'

const { categoryTabs, selectedCategory } = storeToRefs(useCatalogFacets())

const { selectCategory } = useCatalogFacets()
</script>
