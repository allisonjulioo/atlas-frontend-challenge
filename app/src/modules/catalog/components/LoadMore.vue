<template>
  <div v-if="hasMore" class="load-more">
    <div :ref="setSentinel" class="load-more__sentinel" aria-hidden="true" />

    <AtlasButton variant="secondary" :disabled="loadingMore" @click="loadMore">
      {{ buttonLabel }}
    </AtlasButton>
  </div>

  <p v-else-if="showEndMessage" class="load-more__end" role="status">
    Você chegou ao fim da lista.
  </p>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { AtlasButton } from '@atlas/design-system'
import { useCatalogAutoLoad } from '@/modules/catalog/hooks/useCatalogAutoLoad'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'

const { buttonLabel, showEndMessage, hasMore } = storeToRefs(useCatalogAutoLoad())

const { setSentinel, reset } = useCatalogAutoLoad()

const { loadingMore } = storeToRefs(useCatalogList())

const { loadMore } = useCatalogList()

onBeforeUnmount(reset)
</script>

<style lang="scss" scoped>
.load-more {
  @apply flex flex-col items-center gap-4 py-10;

  &__sentinel {
    @apply h-px w-full;
  }

  &__end {
    @apply py-10 text-center text-sm text-content-subtle;
  }
}
</style>
