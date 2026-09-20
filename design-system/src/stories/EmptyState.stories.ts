import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from '@/components/exposed/Button.vue'
import EmptyState from '@/components/exposed/EmptyState.vue'

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    title: 'Nenhum profissional encontrado',
    description: 'Tente remover algum filtro ou buscar por outra profissão.',
  },
} satisfies Meta<typeof EmptyState>

export default meta

type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const ComAcao: Story = {
  render: args => ({
    components: { Button, EmptyState },
    setup: () => ({ args }),
    template: `
      <EmptyState v-bind="args">
        <Button variant="secondary">Limpar filtros</Button>
      </EmptyState>
    `,
  }),
}
