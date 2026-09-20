import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Logo from '@/components/exposed/Logo.vue'

const meta = {
  title: 'Marca/Logo',
  component: Logo,
  tags: ['autodocs'],
  args: { label: 'Atlas' },
  render: args => ({
    components: { Logo },
    setup: () => ({ args }),
    template: '<div class="h-10"><Logo v-bind="args" /></div>',
  }),
} satisfies Meta<typeof Logo>

export default meta

type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const SobreInk: Story = {
  parameters: { backgrounds: { value: 'ink' } },
  render: () => ({
    components: { Logo },
    template: '<div class="h-10 text-surface"><Logo /></div>',
  }),
}
