import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SearchField from '@/components/exposed/SearchField.vue'

const meta = {
  title: 'Filtros/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    modelValue: '',
    label: 'Buscar profissional',
    placeholder: 'Buscar por nome ou profissão',
  },
  render: args => ({
    components: { SearchField },
    setup: () => {
      const term = ref(args.modelValue)

      return { args, term }
    },
    template: '<div class="w-[min(90vw,560px)]"><SearchField v-bind="args" v-model="term" /></div>',
  }),
} satisfies Meta<typeof SearchField>

export default meta

type Story = StoryObj<typeof meta>

export const Vazio: Story = {}

export const Preenchido: Story = {
  args: { modelValue: 'eletricista' },
}
