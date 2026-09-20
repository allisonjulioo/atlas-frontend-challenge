<template>
  <ul v-if="pending" class="atlas-grid" aria-busy="true">
    <li v-for="index in skeletonCount" :key="`skeleton-${index}`">
      <SkeletonCard />
    </li>
  </ul>

  <ul v-else class="atlas-grid">
    <li v-for="(professional, index) in items" :key="professional.id">
      <ProfessionalCard
        :professional="professional"
        :href="`${basePath}/${professional.slug}`"
        :priority="index < priorityCount"
        :favorite="favorites.includes(professional.id)"
        @select="(item, event) => emit('select', item, event)"
        @toggle-favorite="(item) => emit('toggleFavorite', item)"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { ProfessionalSummary } from '@atlas/contracts'
import ProfessionalCard from './ProfessionalCard.vue'
import SkeletonCard from './SkeletonCard.vue'

withDefaults(defineProps<{
  items: ProfessionalSummary[]
  basePath: string
  favorites?: string[]
  pending?: boolean
  priorityCount?: number
  skeletonCount?: number
}>(), {
  favorites: () => [],
  pending: false,
  priorityCount: 4,
  skeletonCount: 12,
})

const emit = defineEmits<{
  select: [professional: ProfessionalSummary, event: MouseEvent]
  toggleFavorite: [professional: ProfessionalSummary]
}>()
</script>

<style lang="scss" scoped>
.atlas-grid {
  @apply m-0 grid list-none gap-6 p-0 [grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr))];

  > li {
    @apply flex;

    > * {
      @apply w-full;
    }
  }
}
</style>
