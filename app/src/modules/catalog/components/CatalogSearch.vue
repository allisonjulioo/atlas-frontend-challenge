<template>
  <AtlasSearchField
    id="catalog-search"
    v-model="term"
    label="Buscar profissional"
    placeholder="Buscar por nome ou profissão"
    :maxlength="maxLength"
    @submit="submit"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AtlasSearchField } from '@atlas/design-system'
import { useCatalogSearch } from '@/modules/catalog/hooks/useCatalogSearch'

const { term, maxLength } = storeToRefs(useCatalogSearch())

const { submit } = useCatalogSearch()
</script>
