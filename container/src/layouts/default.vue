<template>
  <div class="shell">
    <SkipLink />
    <AppHeader />

    <main id="conteudo" class="shell__main">
      <slot />
    </main>

    <AppFooter />
    <AppBottomNav />
  </div>
</template>

<style lang="scss" scoped>
.shell {
  @apply flex min-h-dvh flex-col;

  &__main {
    @apply mx-auto w-full max-w-shell flex-1 px-5 pb-28 pt-10 md:px-8 lg:pb-16;
  }
}
</style>
