<template>
  <div class="catalog-toolbar">
    <div class="catalog-toolbar__actions">
      <button class="catalog-toolbar__action" type="button" @click="open">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 6h14M6 10h8M8.5 14h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        Filtros
        <span v-if="activeCount" class="catalog-toolbar__count">{{ activeCount }}</span>
      </button>

      <div class="catalog-toolbar__action catalog-toolbar__action--select">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M10 2.5c-2.9 0-5.2 2.3-5.2 5.1 0 3.8 5.2 9.9 5.2 9.9s5.2-6.1 5.2-9.9c0-2.8-2.3-5.1-5.2-5.1z"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          />
          <circle cx="10" cy="7.6" r="1.9" fill="currentColor" />
        </svg>

        <label class="catalog-toolbar__label" for="catalog-distance">Distância</label>
        <select
          id="catalog-distance"
          class="catalog-toolbar__select"
          :value="query.maxDistanceKm ?? ''"
          @change="setDistance(($event.target as HTMLSelectElement).value)"
        >
          <option value="">Distância</option>
          <option v-for="km in distanceOptions" :key="km" :value="km">Até {{ km }} km</option>
        </select>
      </div>

      <div class="catalog-toolbar__action catalog-toolbar__action--select">
        <label class="catalog-toolbar__label" for="catalog-sort">Ordenar por</label>
        <select
          id="catalog-sort"
          class="catalog-toolbar__select"
          :value="query.sort"
          @change="setSort(($event.target as HTMLSelectElement).value)"
        >
          <option v-for="key in SORT_KEYS" :key="key" :value="key">{{ SORT_LABEL[key] }}</option>
        </select>

        <svg class="catalog-toolbar__caret" viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M5.5 8l4.5 4.5L14.5 8"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </div>

    <p class="catalog-toolbar__total" role="status" aria-live="polite">{{ totalLabel }}</p>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { SORT_KEYS, SORT_LABEL } from '@atlas/contracts'
import { useCatalogDrawer } from '@/modules/catalog/hooks/useCatalogDrawer'
import { useCatalogFacets } from '@/modules/catalog/hooks/useCatalogFacets'
import { useCatalogFilters } from '@/modules/catalog/hooks/useCatalogFilters'
import { useCatalogSummary } from '@/modules/catalog/hooks/useCatalogSummary'

const { query, activeCount } = storeToRefs(useCatalogFilters())

const { setSort, setDistance } = useCatalogFilters()

const { distanceOptions } = storeToRefs(useCatalogFacets())

const { totalLabel } = storeToRefs(useCatalogSummary())

const { open } = useCatalogDrawer()
</script>

<style lang="scss" scoped>
.catalog-toolbar {
  @apply flex flex-col gap-5;

  &__actions {
    @apply flex items-center gap-2 overflow-x-auto border-b border-line pb-3;

    scrollbar-width: none;

    &::-webkit-scrollbar {
      @apply hidden;
    }
  }

  &__action {
    @apply relative inline-flex min-h-11 flex-none items-center gap-2 rounded-control border-none
      bg-transparent px-3 text-sm font-semibold text-content transition-colors duration-fast ease-atlas;

    &:hover {
      @apply bg-surface-soft;
    }

    > svg {
      @apply h-5 w-5 flex-none text-content-muted;
    }

    &--select {
      @apply pr-8;
    }
  }

  &__label {
    @apply absolute h-px w-px overflow-hidden whitespace-nowrap;

    clip-path: inset(50%);
  }

  &__select {
    @apply cursor-pointer appearance-none border-none bg-transparent pr-1 text-sm font-semibold
      text-content outline-none;
  }

  &__caret {
    @apply pointer-events-none absolute right-2 h-4 w-4 text-content-muted;
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
