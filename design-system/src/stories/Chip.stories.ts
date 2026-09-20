import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Chip from '@/components/exposed/Chip.vue'

const meta = {
  title: 'Filtros/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: { active: false, removable: false },
  render: args => ({
    components: { Chip },
    setup: () => ({ args }),
    template: '<Chip v-bind="args">Casa e reformas</Chip>',
  }),
} satisfies Meta<typeof Chip>

export default meta

type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const Ativo: Story = {
  args: { active: true, removable: true },
}

export const LinhaDeFiltros: Story = {
  render: () => ({
    components: { Chip },
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <Chip active removable>Casa e reformas</Chip>
        <Chip active removable>Até 10 km</Chip>
        <Chip active removable>4,5 ou mais</Chip>
        <Chip>Limpar tudo</Chip>
      </div>
    `,
  }),
}
