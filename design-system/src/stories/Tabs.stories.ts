import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Tabs from '@/components/exposed/Tabs.vue'
import { categoryTabs } from './fixtures'

const meta = {
  title: 'Filtros/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    options: categoryTabs,
    modelValue: 'todas',
  },
  render: args => ({
    components: { Tabs },
    setup: () => {
      const selected = ref(args.modelValue)

      return { args, selected }
    },
    template: '<div class="w-[min(90vw,720px)]"><Tabs v-bind="args" v-model="selected" /></div>',
  }),
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

export const Categorias: Story = {}

export const ComSelecao: Story = {
  args: { modelValue: 'beleza' },
}
