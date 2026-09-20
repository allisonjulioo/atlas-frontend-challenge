<template>
  <div class="catalog-view" :class="{ 'catalog-view--collapsed': !isSidebarOpen }">
    <header class="catalog-view__head">
      <h1 class="catalog-view__title">{{ title }}</h1>

      <CatalogSearch class="catalog-view__search" />
    </header>

    <motion.aside
      class="catalog-view__sidebar"
      :class="{ 'catalog-view__sidebar--collapsed': !isSidebarOpen }"
      :animate="isSidebarOpen ? SIDEBAR_VISIBLE : SIDEBAR_HIDDEN"
      :transition="SIDEBAR_TRANSITION"
    >
      <CatalogFilters />
    </motion.aside>

    <div class="catalog-view__main">
      <CatalogToolbar />

      <CatalogChips />

      <div v-if="errorMessage" class="catalog-view__error" role="alert">
        <p>{{ errorMessage }}</p>
        <AtlasButton variant="secondary" size="sm" @click="load">Tentar novamente</AtlasButton>
      </div>

      <AtlasEmptyState v-else-if="isEmpty" title="Nenhum profissional encontrado" />

      <template v-else>
        <CatalogGrid />
        <LoadMore v-if="!pending" />
      </template>
    </div>

    <AtlasBackToTop />

    <motion.dialog
      :ref="setDialog"
      class="catalog-view__drawer"
      :initial="DRAWER_HIDDEN"
      :animate="isOpen ? DRAWER_VISIBLE : DRAWER_HIDDEN"
      :transition="DRAWER_TRANSITION"
      @cancel.prevent="close"
      @click.self="close"
    >
      <div class="catalog-view__drawer-inner">
        <div class="catalog-view__drawer-scroll">
          <CatalogFilters />
        </div>

        <div class="catalog-view__drawer-footer">
          <AtlasButton block @click="close">{{ drawerActionLabel }}</AtlasButton>
        </div>
      </div>
    </motion.dialog>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, onServerPrefetch } from 'vue'
import { storeToRefs } from 'pinia'
import { motion } from 'motion-v'
import { AtlasBackToTop, AtlasButton, AtlasEmptyState } from '@atlas/design-system'
import { useCatalogDrawer } from '@/modules/catalog/hooks/useCatalogDrawer'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'
import { useCatalogSummary } from '@/modules/catalog/hooks/useCatalogSummary'
import { DRAWER_ANIMATION_MS } from '@/modules/catalog/constants'
import CatalogChips from '@/modules/catalog/components/CatalogChips.vue'
import CatalogFilters from '@/modules/catalog/components/CatalogFilters.vue'
import CatalogGrid from '@/modules/catalog/components/CatalogGrid.vue'
import CatalogSearch from '@/modules/catalog/components/CatalogSearch.vue'
import CatalogToolbar from '@/modules/catalog/components/CatalogToolbar.vue'
import LoadMore from '@/modules/catalog/components/LoadMore.vue'

withDefaults(defineProps<{ title?: string }>(), { title: 'Encontre profissionais' })

const SIDEBAR_TRANSITION = { duration: 0.22, ease: [0.22, 1, 0.36, 1] }

const SIDEBAR_VISIBLE = { opacity: 1, x: 0 }

const SIDEBAR_HIDDEN = { opacity: 0, x: -24 }

const DRAWER_TRANSITION = { duration: DRAWER_ANIMATION_MS / 1000, ease: [0.22, 1, 0.36, 1] }

const DRAWER_VISIBLE = { y: '0%' }

const DRAWER_HIDDEN = { y: '100%' }

const { errorMessage, pending } = storeToRefs(useCatalogList())

const { isEmpty, drawerActionLabel } = storeToRefs(useCatalogSummary())

const { init, load, reset } = useCatalogList()

const { isOpen, isSidebarOpen } = storeToRefs(useCatalogDrawer())

const { setDialog, close, init: initDrawer, reset: resetDrawer } = useCatalogDrawer()

onServerPrefetch(init)

onMounted(() => {
  initDrawer()
  init()
})

onBeforeUnmount(() => {
  resetDrawer()
  reset()
})
</script>

<style lang="scss">
.catalog-view {
  @apply grid grid-cols-[minmax(0,1fr)] gap-8
    lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-x-12;

  @screen lg {
    transition: grid-template-columns 220ms cubic-bezier(0.22, 1, 0.36, 1),
      column-gap 220ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  grid-template-areas: 'head' 'main';

  @screen lg {
    grid-template-areas: 'head head' 'sidebar main';
  }

  &--collapsed {
    @apply lg:gap-x-0 lg:grid-cols-[0px_minmax(0,1fr)];
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

  &__main {
    @apply flex min-w-0 flex-col gap-6;

    grid-area: main;
  }

  &__sidebar {
    @apply hidden lg:sticky lg:top-[var(--atlas-header-offset)] lg:block
      lg:max-h-[calc(100dvh-var(--atlas-header-offset)-1.5rem)] lg:overflow-y-auto;

    grid-area: sidebar;

    &--collapsed {
      @apply pointer-events-none lg:overflow-hidden;
    }
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
    @apply flex max-h-[85dvh] flex-col px-5 pb-5 pt-6;
  }

  &__drawer-scroll {
    @apply -mr-2 min-h-0 flex-1 overflow-y-auto pr-2;

    overscroll-behavior: contain;
  }

  &__drawer-footer {
    @apply flex-none bg-surface pt-4;
  }
}
</style>
