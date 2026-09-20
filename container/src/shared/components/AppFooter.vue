<template>
  <footer class="app-footer">
    <p>Atlas · catálogo de profissionais autônomos</p>
    <p class="app-footer__note">
      Container <code>shell</code> · remotes <code>catalog</code> e <code>ui</code> via Module Federation
    </p>
  </footer>
</template>

<style lang="scss" scoped>
.app-footer {
  @apply mt-8 border-t border-line px-5 py-8 text-center text-xs text-content-subtle md:px-8 md:py-10;

  &__note {
    @apply mt-1;
  }
}
</style>
