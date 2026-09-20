<template>
  <div class="catalog-filters">
    <div class="catalog-filters__head">
      <h2 class="catalog-filters__title">Filtros</h2>
      <button v-if="activeCount" class="catalog-filters__clear" type="button" @click="clearAll">
        Limpar ({{ activeCount }})
      </button>
    </div>

    <fieldset class="catalog-filters__group">
      <legend class="catalog-filters__legend">Categoria</legend>
      <label
        v-for="bucket in categoryBuckets"
        :key="bucket.value"
        class="catalog-filters__option"
        :class="{ 'catalog-filters__option--empty': isBucketDisabled(bucket.count, isCategoryChecked(bucket.value)) }"
      >
        <input
          type="checkbox"
          :checked="isCategoryChecked(bucket.value)"
          :disabled="isBucketDisabled(bucket.count, isCategoryChecked(bucket.value))"
          @change="toggleCategory(bucket.value)"
        >
        <span class="catalog-filters__option-label">{{ bucket.label }}</span>
        <span class="catalog-filters__option-count">{{ bucket.count }}</span>
      </label>
    </fieldset>

    <fieldset class="catalog-filters__group">
      <legend class="catalog-filters__legend">Disponibilidade</legend>
      <label
        v-for="bucket in availabilityBuckets"
        :key="bucket.value"
        class="catalog-filters__option"
        :class="{ 'catalog-filters__option--empty': isBucketDisabled(bucket.count, isAvailabilityChecked(bucket.value)) }"
      >
        <input
          type="checkbox"
          :checked="isAvailabilityChecked(bucket.value)"
          :disabled="isBucketDisabled(bucket.count, isAvailabilityChecked(bucket.value))"
          @change="toggleAvailability(bucket.value)"
        >
        <span class="catalog-filters__option-label">{{ bucket.label }}</span>
        <span class="catalog-filters__option-count">{{ bucket.count }}</span>
      </label>
    </fieldset>

    <fieldset class="catalog-filters__group">
      <legend class="catalog-filters__legend">Valor por hora</legend>

      <div class="catalog-filters__range">
        <label class="catalog-filters__range-field">
          <span>Mínimo</span>
          <input
            type="number"
            inputmode="numeric"
            step="5"
            :min="priceRange.min"
            :max="priceRange.max"
            :value="query.minPrice ?? ''"
            :placeholder="String(priceRange.min)"
            @change="setMinPrice(($event.target as HTMLInputElement).value)"
          >
        </label>

        <label class="catalog-filters__range-field">
          <span>Máximo</span>
          <input
            type="number"
            inputmode="numeric"
            step="5"
            :min="priceRange.min"
            :max="priceRange.max"
            :value="query.maxPrice ?? ''"
            :placeholder="String(priceRange.max)"
            @change="setMaxPrice(($event.target as HTMLInputElement).value)"
          >
        </label>
      </div>

      <p v-if="hasFacets" class="catalog-filters__hint">
        Catálogo entre {{ formatPrice(priceRange.min) }} e {{ formatPrice(priceRange.max) }}
      </p>
    </fieldset>

    <fieldset class="catalog-filters__group">
      <legend class="catalog-filters__legend">Distância</legend>

      <input
        class="catalog-filters__slider"
        type="range"
        min="0"
        :max="distanceMax"
        :step="distanceStep"
        :value="distanceValue"
        aria-label="Distância máxima"
        @change="setDistance(($event.target as HTMLInputElement).value)"
      >

      <p class="catalog-filters__hint">{{ distanceLabel }}</p>
    </fieldset>

    <label class="catalog-filters__switch">
      <input
        type="checkbox"
        :checked="query.verifiedOnly"
        @change="setVerifiedOnly(($event.target as HTMLInputElement).checked)"
      >
      <span>Somente perfis verificados</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { formatPrice } from '@atlas/contracts'
import { useCatalogFacets } from '@/modules/catalog/hooks/useCatalogFacets'
import { useCatalogFilters } from '@/modules/catalog/hooks/useCatalogFilters'

const { query, activeCount } = storeToRefs(useCatalogFilters())

const {
  toggleCategory,
  toggleAvailability,
  setMinPrice,
  setMaxPrice,
  setDistance,
  setVerifiedOnly,
  clearAll,
} = useCatalogFilters()

const {
  categoryBuckets,
  availabilityBuckets,
  priceRange,
  hasFacets,
  distanceMax,
  distanceStep,
  distanceValue,
  distanceLabel,
} = storeToRefs(useCatalogFacets())

const { isCategoryChecked, isAvailabilityChecked, isBucketDisabled } = useCatalogFacets()
</script>

<style lang="scss" scoped>
.catalog-filters {
  @apply flex flex-col gap-4;

  &__head {
    @apply flex items-center justify-between gap-3;
  }

  &__title {
    @apply text-base font-semibold;
  }

  &__clear {
    @apply border-none bg-transparent px-2 py-1 text-xs font-semibold text-brand;
  }

  &__group {
    @apply flex flex-col border-none p-0;
  }

  &__legend {
    @apply px-0 pb-2 text-xs font-semibold text-content-subtle;
  }

  &__option {
    @apply flex min-h-9 cursor-pointer items-center gap-3 text-sm;

    input {
      @apply h-[18px] w-[18px] flex-none accent-brand;
    }

    &--empty {
      @apply cursor-not-allowed text-content-subtle;
    }
  }

  &__option-label {
    @apply flex-1;
  }

  &__option-count {
    @apply text-xs tabular-nums text-content-subtle;
  }

  &__range {
    @apply grid grid-cols-2 gap-2;
  }

  &__range-field {
    @apply flex flex-col gap-1 text-xs text-content-muted;

    input {
      @apply min-h-10 w-full rounded-control border border-line bg-surface px-2 text-sm text-content
        transition-colors duration-fast ease-atlas;

      &:focus {
        @apply border-brand outline-none;
      }
    }
  }

  &__slider {
    @apply h-11 w-full cursor-pointer appearance-none bg-transparent;

    &::-webkit-slider-runnable-track {
      @apply h-1.5 rounded-full bg-line;
    }

    &::-webkit-slider-thumb {
      @apply -mt-[7px] h-5 w-5 appearance-none rounded-full border-2 border-surface bg-brand shadow-card;
    }

    &::-moz-range-track {
      @apply h-1.5 rounded-full bg-line;
    }

    &::-moz-range-thumb {
      @apply h-5 w-5 rounded-full border-2 border-surface bg-brand shadow-card;
    }
  }

  &__hint {
    @apply mt-2 text-xs text-content-subtle;
  }

  &__switch {
    @apply flex cursor-pointer items-center gap-2 text-sm;

    input {
      @apply h-[18px] w-[18px] accent-brand;
    }
  }
}
</style>
