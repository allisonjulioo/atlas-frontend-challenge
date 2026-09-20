import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Rating from '@/components/exposed/Rating.vue'

const meta = {
  title: 'Dados/Rating',
  component: Rating,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['compact', 'full'] },
    value: { control: { type: 'range', min: 0, max: 5, step: 0.1 } },
  },
  args: {
    value: 4.8,
    count: 213,
    variant: 'compact',
  },
} satisfies Meta<typeof Rating>

export default meta

type Story = StoryObj<typeof meta>

export const Compacto: Story = {}

export const Completo: Story = {
  args: { variant: 'full' },
}

export const SemContagem: Story = {
  args: { count: undefined },
}
