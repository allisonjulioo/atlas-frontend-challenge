<template>
  <ul class="profile-services">
    <li v-for="service in services" :key="service.name" class="profile-services__item">
      <span class="profile-services__name">{{ service.name }}</span>

      <span v-if="service.price === null" class="profile-services__quote">Sob orçamento</span>
      <span v-else class="profile-services__price">
        {{ formatPrice(service.price) }}<span class="profile-services__unit">/{{ service.unit }}</span>
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { formatPrice } from '@atlas/contracts'
import { useProfessionalDetails } from '@/modules/catalog/hooks/useProfessionalDetails'

const { services } = storeToRefs(useProfessionalDetails())
</script>

<style lang="scss">
.profile-services {
  @apply m-0 flex list-none flex-col p-0;

  &__item {
    @apply flex items-baseline justify-between gap-4 border-b border-line py-3 last:border-b-0;
  }

  &__name {
    @apply text-sm;
  }

  &__price {
    @apply whitespace-nowrap font-semibold tabular-nums;
  }

  &__unit {
    @apply text-xs font-medium text-content-subtle;
  }

  &__quote {
    @apply whitespace-nowrap text-xs text-content-subtle;
  }
}
</style>
