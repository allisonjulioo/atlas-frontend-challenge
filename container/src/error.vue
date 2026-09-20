<template>
  <div class="error-page">
    <p class="error-page__code">{{ error.statusCode }}</p>
    <h1 class="error-page__title">{{ title }}</h1>
    <p class="error-page__message">{{ message }}</p>

    <button class="error-page__action" type="button" @click="backToCatalog">
      Voltar ao catálogo
    </button>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const isNotFound = computed(() => props.error.statusCode === 404)

const title = computed(() => (isNotFound.value ? 'Não encontramos essa página' : 'Algo deu errado por aqui'))

const message = computed(() => {
  if (isNotFound.value) {
    return 'O profissional pode ter saído do catálogo ou o endereço está incorreto.'
  }

  return 'Tente novamente em instantes. Se persistir, o catálogo pode estar indisponível.'
})

const backToCatalog = () => {
  clearError({ redirect: '/' })
}

useHead({ title })
</script>

<style lang="scss" scoped>
.error-page {
  @apply flex min-h-[70dvh] flex-col items-center justify-center gap-3 px-4 py-8 text-center;

  &__code {
    @apply text-sm font-semibold tracking-widest text-content-subtle;
  }

  &__title {
    @apply text-3xl font-bold;
  }

  &__message {
    @apply max-w-[46ch] text-content-muted;
  }

  &__action {
    @apply mt-4 min-h-control rounded-control bg-brand px-5 font-semibold text-content-on-brand;

    &:hover {
      @apply bg-brand/90;
    }
  }
}
</style>
