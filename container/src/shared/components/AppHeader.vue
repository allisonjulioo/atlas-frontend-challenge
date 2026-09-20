<template>
  <header class="app-header">
    <div class="app-header__bar">
      <NuxtLink class="app-header__brand" :to="{ name: ROUTE_NAME.catalogList }" aria-label="Atlas, ir para o catálogo">
        <RemoteUiLogo class="app-header__logo" />
      </NuxtLink>

      <nav class="app-header__nav" aria-label="Principal">
        <NuxtLink :to="{ name: ROUTE_NAME.catalogList }">Catálogo</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ROUTE_NAME } from '@/shared/constants'
</script>

<style lang="scss" scoped>
.app-header {
  @apply sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur;

  &__bar {
    @apply mx-auto flex max-w-shell items-center gap-8 px-5 py-4 md:px-8;
  }

  &__brand {
    @apply mr-auto flex h-8 items-center no-underline lg:mr-0;
  }

  &__logo {
    @apply h-7;
  }

  &__nav {
    @apply hidden gap-4 text-sm lg:mr-auto lg:flex;

    a {
      @apply text-content-muted no-underline;

      &.router-link-active {
        @apply font-semibold text-content;
      }
    }
  }
}
</style>
