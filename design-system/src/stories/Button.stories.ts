import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from '@/components/exposed/Button.vue'

const meta = {
  title: 'Ações/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'accent', 'secondary', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    as: { control: 'inline-radio', options: ['button', 'a'] },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    block: false,
  },
  render: args => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Contratar</Button>',
  }),
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Accent: Story = {
  args: { variant: 'accent' },
}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Ghost: Story = {
  args: { variant: 'ghost' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Variantes: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <Button variant="primary">Contratar</Button>
        <Button variant="accent">Solicitar orçamento</Button>
        <Button variant="secondary">Ver agenda</Button>
        <Button variant="ghost">Limpar filtros</Button>
        <Button variant="primary" size="sm">Compacto</Button>
        <Button variant="primary" disabled>Indisponível</Button>
      </div>
    `,
  }),
}
