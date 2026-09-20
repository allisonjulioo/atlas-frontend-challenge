<template>
  <div v-if="errorMessage" class="professional-profile__error" role="alert">
    <p>{{ errorMessage }}</p>
    <AtlasButton variant="secondary" size="sm" @click="load">Tentar novamente</AtlasButton>
  </div>

  <AtlasEmptyState
    v-else-if="notFound"
    title="Profissional não encontrado"
    description="O perfil pode ter saído do catálogo ou o endereço está incorreto."
  />

  <article v-else-if="professional" class="professional-profile">
    <header class="professional-profile__header">
      <AtlasAvatar
        :src="professional.avatarUrl"
        :name="professional.name"
        :size="112"
        loading="eager"
        fetchpriority="high"
      />

      <div class="professional-profile__identity">
        <p class="professional-profile__category">{{ categoryLabel }}</p>
        <h1 class="professional-profile__name">{{ professional.name }}</h1>
        <p class="professional-profile__profession">{{ professional.profession }}</p>

        <AtlasRating :value="professional.rating" :count="professional.reviewsCount" variant="full" />

        <ul class="professional-profile__badges">
          <li v-for="badge in badges" :key="badge.key">
            <AtlasBadge :tone="badge.tone">{{ badge.label }}</AtlasBadge>
          </li>
        </ul>
      </div>
    </header>

    <aside class="professional-profile__cta">
      <div class="professional-profile__cta-card">
        <AtlasPriceTag :value="professional.hourlyRate" size="lg" />

        <div class="professional-profile__actions">
          <AtlasButton variant="accent" block>Solicitar orçamento</AtlasButton>
          <AtlasButton variant="secondary" block @click="toggleFavorite">{{ favoriteLabel }}</AtlasButton>
        </div>

        <dl class="professional-profile__facts">
          <div v-for="fact in facts" :key="fact.key">
            <dt>{{ fact.label }}</dt>
            <dd>{{ fact.value }}</dd>
          </div>
        </dl>
      </div>
    </aside>

    <div class="professional-profile__body">
      <section class="professional-profile__section">
        <h2 class="professional-profile__section-title">Sobre</h2>
        <p class="professional-profile__bio">{{ professional.bio }}</p>
      </section>

      <section class="professional-profile__section">
        <h2 class="professional-profile__section-title">Serviços e valores</h2>
        <ProfileServices />
      </section>

      <section v-if="gallery.length" class="professional-profile__section">
        <h2 class="professional-profile__section-title">Trabalhos recentes</h2>
        <ProfileGallery />
      </section>
    </div>

    <div class="professional-profile__tail">
      <section v-if="reviews.length" class="professional-profile__section">
        <h2 class="professional-profile__section-title">
          Avaliações
          <span class="professional-profile__section-count">{{ professional.reviewsCount }}</span>
        </h2>
        <ProfileReviews />
      </section>

      <section v-if="hasRelated" class="professional-profile__section">
        <h2 class="professional-profile__section-title">Profissionais parecidos</h2>
        <ProfileRelated />
      </section>
    </div>
  </article>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, onServerPrefetch } from 'vue'
import { storeToRefs } from 'pinia'
import {
  AtlasAvatar,
  AtlasBadge,
  AtlasButton,
  AtlasEmptyState,
  AtlasPriceTag,
  AtlasRating,
} from '@atlas/design-system'
import { useProfessional } from '@/modules/catalog/hooks/useProfessional'
import { useProfessionalDetails } from '@/modules/catalog/hooks/useProfessionalDetails'
import ProfileGallery from '@/modules/catalog/components/Profile/ProfileGallery.vue'
import ProfileRelated from '@/modules/catalog/components/Profile/ProfileRelated.vue'
import ProfileReviews from '@/modules/catalog/components/Profile/ProfileReviews.vue'
import ProfileServices from '@/modules/catalog/components/Profile/ProfileServices.vue'

const { professional, notFound, errorMessage } = storeToRefs(useProfessional())

const { init, load, reset } = useProfessional()

const { categoryLabel, badges, facts, gallery, reviews, hasRelated, favoriteLabel } = storeToRefs(useProfessionalDetails())

const { toggleFavorite } = useProfessionalDetails()

onServerPrefetch(init)

onMounted(init)

onBeforeUnmount(reset)
</script>

<style lang="scss">
.professional-profile {
  @apply grid grid-cols-[minmax(0,1fr)] gap-10
    lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-x-14;

  grid-template-areas: 'header' 'cta' 'body' 'tail';

  @screen lg {
    grid-template-areas: 'header cta' 'body cta' 'tail tail';
  }

  &__header {
    @apply flex min-w-0 items-start gap-4 md:gap-6;

    grid-area: header;
  }

  &__identity {
    @apply flex min-w-0 flex-col gap-2;
  }

  &__category {
    @apply text-xs font-semibold text-content-subtle;
  }

  &__name {
    @apply text-2xl font-bold md:text-3xl;
  }

  &__profession {
    @apply text-content-muted;
  }

  &__badges {
    @apply m-0 mt-1 flex list-none flex-wrap gap-2 p-0;
  }

  &__cta {
    @apply lg:self-stretch;

    grid-area: cta;
  }

  &__cta-card {
    @apply flex flex-col gap-5 rounded-card bg-surface p-5 shadow-card md:p-6
      lg:sticky lg:top-[var(--atlas-header-offset)];
  }

  &__actions {
    @apply flex flex-col gap-2;
  }

  &__facts {
    @apply m-0 grid gap-4 border-t border-line pt-5;

    > div {
      @apply flex items-baseline justify-between gap-3;
    }

    dt {
      @apply text-xs text-content-subtle;
    }

    dd {
      @apply m-0 text-right text-sm font-medium;
    }
  }

  &__body {
    @apply flex min-w-0 flex-col gap-12;

    grid-area: body;
  }

  &__tail {
    @apply flex min-w-0 flex-col gap-12;

    grid-area: tail;
  }

  &__section {
    @apply flex flex-col gap-5;
  }

  &__section-title {
    @apply flex items-baseline gap-2 text-lg font-semibold;
  }

  &__section-count {
    @apply text-sm font-medium text-content-subtle;
  }

  &__bio {
    @apply max-w-[68ch] text-content-muted;
  }

  &__error {
    @apply flex flex-col items-start gap-4 rounded-card bg-accent/10 p-6 text-accent;
  }
}
</style>
