<template>
  <div v-if="hasChips" class="catalog-chips">
    <AtlasChip
      v-for="chip in chips"
      :key="chip.key"
      removable
      active
      @click="remove(chip)"
    >
      {{ chip.label }}
    </AtlasChip>

    <AtlasChip @click="clearAll">Limpar tudo</AtlasChip>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AtlasChip } from '@atlas/design-system'
import { useCatalogChips } from '@/modules/catalog/hooks/useCatalogChips'

const { chips, hasChips } = storeToRefs(useCatalogChips())

const { remove, clearAll } = useCatalogChips()
</script>

<style lang="scss" scoped>
.catalog-chips {
  @apply mb-6 flex gap-2 overflow-x-auto pb-1;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    @apply hidden;
  }
}
</style>
