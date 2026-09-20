<template>
  <form class="atlas-search" role="search" @submit.prevent="emit('submit', model)">
    <label class="atlas-search__label" :for="id">{{ label }}</label>

    <div class="atlas-search__field">
      <input
        :id="id"
        v-model="model"
        class="atlas-search__input"
        type="search"
        name="q"
        enterkeyhint="search"
        autocomplete="off"
        :maxlength="maxlength"
        :placeholder="placeholder"
      >

      <button
        v-if="model"
        class="atlas-search__clear"
        type="button"
        aria-label="Limpar busca"
        @click="model = ''"
      >
        ×
      </button>

      <button class="atlas-search__submit" type="submit" aria-label="Buscar">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <circle
            cx="9"
            cy="9"
            r="6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  id?: string
  label?: string
  placeholder?: string
  maxlength?: number
}>(), {
  id: 'atlas-search',
  label: 'Buscar',
  placeholder: 'Buscar…',
  maxlength: 80,
})

const emit = defineEmits<{ submit: [value: string] }>()

const model = defineModel<string>({ required: true })
</script>

<style lang="scss" scoped>
.atlas-search {
  @apply w-full;

  &__label {
    @apply absolute h-px w-px overflow-hidden whitespace-nowrap;

    clip-path: inset(50%);
  }

  &__field {
    @apply flex items-center gap-1 rounded-full border-none bg-surface p-1 pl-5 shadow-card
      transition-shadow duration-fast ease-atlas;

    &:focus-within {
      @apply shadow-card-hover;
    }
  }

  &__input {
    @apply min-h-11 w-full min-w-0 flex-1 border-none bg-transparent text-base outline-none
      placeholder:text-content-subtle;

    &::-webkit-search-cancel-button {
      @apply hidden;
    }
  }

  &__clear {
    @apply grid h-9 w-9 flex-none place-items-center rounded-full border-none bg-transparent
      text-xl leading-none text-content-subtle;

    &:hover {
      @apply bg-surface-soft text-content;
    }
  }

  &__submit {
    @apply grid h-11 w-11 flex-none place-items-center rounded-full border-none bg-accent
      text-content-on-accent transition-colors duration-fast ease-atlas;

    &:hover {
      @apply bg-accent/90;
    }

    svg {
      @apply h-5 w-5;
    }
  }
}
</style>
