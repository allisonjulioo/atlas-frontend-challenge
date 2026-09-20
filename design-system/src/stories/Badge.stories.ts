import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Badge from '@/components/exposed/Badge.vue'

const meta = {
  title: 'Dados/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'brand', 'accent', 'soft'] },
  },
  args: { tone: 'neutral' },
  render: args => ({
    components: { Badge },
    setup: () => ({ args }),
    template: '<Badge v-bind="args">Verificado</Badge>',
  }),
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Neutral: Story = {}

export const Brand: Story = {
  args: { tone: 'brand' },
}

export const Accent: Story = {
  args: { tone: 'accent' },
}

export const Tons: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <Badge tone="neutral">Sob agendamento</Badge>
        <Badge tone="brand">Perfil verificado</Badge>
        <Badge tone="accent">Disponível agora</Badge>
        <Badge tone="soft">Destaque</Badge>
      </div>
    `,
  }),
}
