<template>
  <div class="catalog-toolbar">
    <div class="catalog-toolbar__actions">
      <AtlasButton class="catalog-toolbar__filters" variant="text" size="sm" @click="toggle">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 6h14M6 10h8M8.5 14h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        Filtros

        <AnimatePresence>
          <motion.span
            v-if="activeCount"
            class="catalog-toolbar__count"
            :initial="COUNT_HIDDEN"
            :animate="COUNT_VISIBLE"
            :exit="COUNT_HIDDEN"
            :transition="COUNT_TRANSITION"
          >
            {{ activeCount }}
          </motion.span>
        </AnimatePresence>
      </AtlasButton>

      <div class="catalog-toolbar__group">
        <AtlasDropdown
          id="catalog-distance"
          label="Distância máxima"
          placeholder="Distância"
          :options="distanceOptions"
          :model-value="distanceKey"
          @update:model-value="setDistance"
        >
          <template #icon>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path
                d="M10 2.5c-2.9 0-5.2 2.3-5.2 5.1 0 3.8 5.2 9.9 5.2 9.9s5.2-6.1 5.2-9.9c0-2.8-2.3-5.1-5.2-5.1z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
              />
              <circle cx="10" cy="7.6" r="1.9" fill="currentColor" />
            </svg>
          </template>
        </AtlasDropdown>

        <AtlasDropdown
          id="catalog-sort"
          label="Ordenar por"
          :options="sortOptions"
          :model-value="sortKey"
          @update:model-value="setSort"
        />
      </div>
    </div>

    <p class="catalog-toolbar__total" role="status" aria-live="polite">{{ totalLabel }}</p>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AnimatePresence, motion } from 'motion-v'
import { AtlasButton, AtlasDropdown } from '@atlas/design-system'
import { useCatalogDrawer } from '@/modules/catalog/hooks/useCatalogDrawer'
import { useCatalogFacets } from '@/modules/catalog/hooks/useCatalogFacets'
import { useCatalogFilters } from '@/modules/catalog/hooks/useCatalogFilters'
import { useCatalogSummary } from '@/modules/catalog/hooks/useCatalogSummary'

const COUNT_TRANSITION = { type: 'spring', stiffness: 600, damping: 24 } as const

const COUNT_HIDDEN = { scale: 0.4, opacity: 0 }

const COUNT_VISIBLE = { scale: 1, opacity: 1 }

const { activeCount } = storeToRefs(useCatalogFilters())

const { setSort, setDistance } = useCatalogFilters()

const { distanceOptions, distanceKey, sortOptions, sortKey } = storeToRefs(useCatalogFacets())

const { totalLabel } = storeToRefs(useCatalogSummary())

const { toggle } = useCatalogDrawer()
</script>

<style lang="scss" scoped>
.catalog-toolbar {
  @apply flex flex-col gap-5;

  &__actions {
    @apply flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-6;
  }

  &__filters {
    @apply min-h-11 flex-none;

    svg {
      @apply h-5 w-5 flex-none;
    }
  }

  &__group {
    @apply flex min-w-0 items-center gap-5 sm:ml-auto sm:gap-6;
  }

  &__count {
    @apply grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5
      text-[0.6875rem] text-content-on-accent;
  }

  &__total {
    @apply text-sm text-content-muted;
  }
}
</style>
