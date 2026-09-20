<template>
  <div class="harness">
    <header class="harness__bar">
      <strong>Remote <code>catalog</code></strong>
    </header>

    <main class="harness__main">
      <NuxtPage />
    </main>
  </div>
</template>

<style lang="scss">
.harness {
  @apply flex min-h-dvh flex-col;

  &__bar {
    @apply flex flex-wrap items-baseline gap-3 border-b border-line bg-surface px-4 py-3
      text-xs text-content-muted md:px-6;
  }

  &__main {
    @apply mx-auto w-full max-w-shell flex-1 px-4 pb-12 pt-6 md:px-6;
  }
}
</style>
