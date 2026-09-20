<template>
  <header class="app-header">
    <div class="app-header__bar">
      <NuxtLink class="app-header__brand" :to="{ name: ROUTE_NAME.catalogList }" aria-label="Atlas, ir para o catálogo">
        <RemoteUiLogo class="app-header__logo" />
      </NuxtLink>

      <nav class="app-header__projects" aria-label="Projetos">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          :aria-label="link.icon ? link.label : undefined"
          target="_blank"
          rel="noreferrer"
        >
          <svg v-if="link.icon" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="link.icon" fill="currentColor" />
          </svg>

          <template v-else>{{ link.label }}</template>
        </a>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ROUTE_NAME } from '@/shared/constants'
import { useProjectLinks } from '@/shared/hooks/useProjectLinks'

const { links } = useProjectLinks()
</script>

<style lang="scss" scoped>
.app-header {
  @apply sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur;

  &__bar {
    @apply mx-auto flex max-w-shell items-center gap-8 px-5 py-4 md:px-8;
  }

  &__brand {
    @apply mr-auto flex h-10 items-center no-underline;
  }

  &__logo {
    @apply h-10;
  }

  &__projects {
    @apply hidden items-center gap-4 text-sm lg:flex;

    a {
      @apply flex items-center text-content-muted no-underline transition-colors hover:text-content;
    }

    svg {
      @apply h-5 w-5;
    }
  }
}
</style>
