import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PriceTag from '@/components/exposed/PriceTag.vue'

const meta = {
  title: 'Dados/PriceTag',
  component: PriceTag,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    value: 145,
    unit: 'hora',
    size: 'md',
  },
} satisfies Meta<typeof PriceTag>

export default meta

type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const Grande: Story = {
  args: { size: 'lg' },
}

export const PorDiaria: Story = {
  args: { value: 380, unit: 'diária' },
}
