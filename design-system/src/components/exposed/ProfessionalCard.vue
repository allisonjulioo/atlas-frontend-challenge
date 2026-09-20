<template>
  <article class="atlas-card">
    <div class="atlas-card__media">
      <img
        class="atlas-card__image"
        :src="professional.coverUrl"
        :alt="`Foto de ${professional.name}, ${professional.profession}`"
        width="600"
        height="450"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'auto'"
        decoding="async"
      >

      <ul class="atlas-card__flags">
        <li v-if="professional.verified">
          <Badge tone="brand">Verificado</Badge>
        </li>
        <li v-if="isImmediate">
          <Badge tone="accent">Disponível agora</Badge>
        </li>
      </ul>

      <button
        class="atlas-card__favorite"
        type="button"
        :aria-pressed="favorite"
        :aria-label="favoriteLabel"
        @click="emit('toggleFavorite', professional)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 20.5l-1.4-1.27C5.6 14.7 2.7 12.06 2.7 8.8 2.7 6.2 4.74 4.2 7.3 4.2c1.47 0 2.9.7 3.8 1.8.9-1.1 2.33-1.8 3.8-1.8 2.56 0 4.6 2 4.6 4.6 0 3.26-2.9 5.9-7.9 10.43z"
            :fill="favorite ? 'currentColor' : 'none'"
            stroke="currentColor"
            stroke-width="1.6"
          />
        </svg>
      </button>

      <div class="atlas-card__overlay">
        <h3 class="atlas-card__name">
          <a class="atlas-card__link" :href="href" @click="handleClick">{{ professional.name }}</a>
        </h3>
        <p class="atlas-card__location">{{ professional.city }} · {{ formatDistance(professional.distanceKm) }}</p>
      </div>
    </div>

    <div class="atlas-card__body">
      <div class="atlas-card__headline-row">
        <p class="atlas-card__profession">{{ professional.profession }}</p>
        <Rating :value="professional.rating" :count="professional.reviewsCount" />
      </div>

      <p class="atlas-card__headline">{{ professional.headline }}</p>

      <footer class="atlas-card__footer">
        <PriceTag :value="professional.hourlyRate" size="sm" />
        <span class="atlas-card__cta" aria-hidden="true">Ver perfil</span>
      </footer>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDistance, type ProfessionalSummary } from '@atlas/contracts'
import Badge from './Badge.vue'
import PriceTag from './PriceTag.vue'
import Rating from './Rating.vue'

const props = withDefaults(defineProps<{
  professional: ProfessionalSummary
  href: string
  priority?: boolean
  favorite?: boolean
}>(), { priority: false, favorite: false })

const emit = defineEmits<{
  select: [professional: ProfessionalSummary, event: MouseEvent]
  toggleFavorite: [professional: ProfessionalSummary]
}>()

const PRIMARY_BUTTON = 0

const isImmediate = computed(() => props.professional.availability === 'imediata')

const favoriteLabel = computed(() => {
  if (props.favorite) {
    return `Remover ${props.professional.name} dos favoritos`
  }

  return `Salvar ${props.professional.name} nos favoritos`
})

const hasModifier = (event: MouseEvent) => event.metaKey || event.ctrlKey || event.shiftKey || event.altKey

const handleClick = (event: MouseEvent) => {
  if (event.defaultPrevented || event.button !== PRIMARY_BUTTON || hasModifier(event)) {
    return
  }

  emit('select', props.professional, event)
}
</script>

<style lang="scss" scoped>
.atlas-card {
  @apply relative flex flex-col overflow-hidden rounded-card border-none bg-surface
    shadow-card transition-[box-shadow,transform] duration-base ease-atlas;

  content-visibility: auto;
  contain-intrinsic-size: auto 350px;

  &:hover {
    @apply -translate-y-0.5 shadow-card-hover;
  }

  &__media {
    @apply grid overflow-hidden bg-surface-soft;

    grid-template-areas: 'stack';
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    aspect-ratio: 4 / 3;

    > * {
      @apply min-h-0 min-w-0;

      grid-area: stack;
    }
  }

  &__image {
    @apply h-full w-full object-cover transition-transform duration-base ease-atlas;
  }

  .atlas-card:hover &__image {
    @apply scale-[1.03];
  }

  &__flags {
    @apply z-10 m-3 flex list-none flex-col items-start gap-1 self-start justify-self-start p-0;
  }

  &__favorite {
    @apply z-20 m-3 grid h-9 w-9 place-items-center self-start justify-self-end rounded-full
      border-none bg-surface/85 text-content-muted backdrop-blur;

    &:hover {
      @apply bg-surface text-accent;
    }

    &[aria-pressed='true'] {
      @apply text-accent;
    }

    svg {
      @apply h-5 w-5;
    }
  }

  &__overlay {
    @apply z-10 flex flex-col gap-1 self-end px-4 pb-4 pt-12;

    background: linear-gradient(to top, rgb(var(--atlas-ink) / 82%), transparent);
  }

  &__name {
    @apply text-base font-semibold text-white;
  }

  &__link {
    @apply no-underline;

    &::after {
      @apply absolute inset-0;

      content: '';
    }

    &:focus-visible {
      @apply outline-none ring-0;

      &::after {
        @apply ring-2 ring-inset ring-accent;
      }
    }
  }

  &__location {
    @apply text-xs text-white/80;
  }

  &__body {
    @apply flex flex-1 flex-col gap-3 p-4;
  }

  &__headline-row {
    @apply flex items-center justify-between gap-2;
  }

  &__profession {
    @apply truncate text-sm font-semibold;
  }

  &__headline {
    @apply line-clamp-2 text-xs leading-snug text-content-muted;
  }

  &__footer {
    @apply mt-auto flex items-center justify-between gap-3 border-t border-line pt-3;
  }

  &__cta {
    @apply text-xs font-semibold text-accent;
  }
}
</style>
