<template>
  <main class="remote">
    <Logo class="remote__logo" />

    <h1 class="remote__title">Remote <code>ui</code></h1>
    <p class="remote__text">
      <code>npm run storybook</code> nesta pasta abre o catálogo de componentes em
      <code>localhost:6006</code>.
    </p>
  </main>
</template>

<style lang="scss" scoped>
.remote {
  @apply mx-auto flex max-w-xl flex-col items-start gap-4 px-4 py-16;

  &__logo {
    @apply h-10;
  }

  &__title {
    @apply text-3xl font-bold;
  }
}
</style>
