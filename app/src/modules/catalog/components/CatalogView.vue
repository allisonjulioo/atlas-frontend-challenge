<template>
  <div class="catalog-view">
    <header class="catalog-view__head">
      <h1 class="catalog-view__title">{{ title }}</h1>

      <CatalogSearch class="catalog-view__search" />
    </header>

    <CatalogToolbar class="catalog-view__toolbar" />

    <aside class="catalog-view__sidebar">
      <CatalogFilters />
    </aside>

    <div class="catalog-view__results">
      <CatalogChips />

      <div v-if="errorMessage" class="catalog-view__error" role="alert">
        <p>{{ errorMessage }}</p>
        <AtlasButton variant="secondary" size="sm" @click="load">Tentar novamente</AtlasButton>
      </div>

      <AtlasEmptyState
        v-else-if="isEmpty"
        title="Nenhum profissional encontrado"
        description="Tente remover um filtro ou buscar por outra profissão."
      >
        <AtlasButton v-if="hasActiveFilters" variant="secondary" @click="clearAll">
          Limpar filtros
        </AtlasButton>
      </AtlasEmptyState>

      <template v-else>
        <CatalogGrid />
        <LoadMore v-if="!pending" />
      </template>
    </div>

    <dialog :ref="setDialog" class="catalog-view__drawer" @close="close" @click.self="close">
      <div class="catalog-view__drawer-inner">
        <CatalogFilters />

        <div class="catalog-view__drawer-footer">
          <AtlasButton block @click="close">{{ drawerActionLabel }}</AtlasButton>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, onServerPrefetch } from 'vue'
import { storeToRefs } from 'pinia'
import { AtlasButton, AtlasEmptyState } from '@atlas/design-system'
import { useCatalogDrawer } from '@/modules/catalog/hooks/useCatalogDrawer'
import { useCatalogFilters } from '@/modules/catalog/hooks/useCatalogFilters'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'
import { useCatalogSummary } from '@/modules/catalog/hooks/useCatalogSummary'
import CatalogChips from '@/modules/catalog/components/CatalogChips.vue'
import CatalogFilters from '@/modules/catalog/components/CatalogFilters.vue'
import CatalogGrid from '@/modules/catalog/components/CatalogGrid.vue'
import CatalogSearch from '@/modules/catalog/components/CatalogSearch.vue'
import CatalogToolbar from '@/modules/catalog/components/CatalogToolbar.vue'
import LoadMore from '@/modules/catalog/components/LoadMore.vue'

withDefaults(defineProps<{ title?: string }>(), { title: 'Encontre profissionais' })

const { hasActiveFilters } = storeToRefs(useCatalogFilters())

const { clearAll } = useCatalogFilters()

const { errorMessage, pending } = storeToRefs(useCatalogList())

const { isEmpty, drawerActionLabel } = storeToRefs(useCatalogSummary())

const { init, load, reset } = useCatalogList()

const { setDialog, close } = useCatalogDrawer()

onServerPrefetch(init)

onMounted(init)

onBeforeUnmount(reset)
</script>

<style lang="scss" scoped>
.catalog-view {
  @apply grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-x-12;

  grid-template-areas: 'head' 'toolbar' 'results';

  @screen lg {
    grid-template-areas: 'head head' 'sidebar toolbar' 'sidebar results';
  }

  &__head {
    @apply flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8;

    grid-area: head;
  }

  &__title {
    @apply text-xl font-bold md:text-4xl;
  }

  &__search {
    @apply w-full sm:max-w-md;
  }

  &__toolbar {
    grid-area: toolbar;
  }

  &__results {
    grid-area: results;
  }

  &__sidebar {
    @apply hidden lg:sticky lg:top-8 lg:block lg:max-h-[calc(100dvh-4rem)] lg:overflow-y-auto;

    grid-area: sidebar;
  }

  &__error {
    @apply flex flex-col items-start gap-4 rounded-card bg-accent/10 p-6 text-accent;
  }

  &__drawer {
    @apply m-0 mt-auto w-full max-w-full rounded-t-card border-none bg-surface p-0 text-content lg:hidden;

    margin-inline: auto;

    &::backdrop {
      @apply bg-ink/50;
    }
  }

  &__drawer-inner {
    @apply flex max-h-[85dvh] flex-col gap-6 overflow-y-auto px-5 pb-5 pt-6;

    overscroll-behavior: contain;
  }

  &__drawer-footer {
    @apply sticky -bottom-4 bg-surface py-3;
  }
}
</style>
