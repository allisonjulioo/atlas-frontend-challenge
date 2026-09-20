<template>
  <a class="skip-link" :href="`#${target}`">Ir para o conteúdo</a>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ target?: string }>(), { target: 'conteudo' })
</script>

<style lang="scss" scoped>
.skip-link {
  @apply absolute left-4 z-30 -top-16 rounded-control bg-brand px-4 py-3 text-sm font-semibold
    text-content-on-brand no-underline transition-[top] duration-fast ease-atlas;

  &:focus {
    @apply top-4;
  }
}
</style>
