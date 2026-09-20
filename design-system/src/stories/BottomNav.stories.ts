import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BottomNav from '@/components/exposed/BottomNav.vue'
import { navItems } from './fixtures'

const meta = {
  title: 'Navegação/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  args: { items: navItems },
  render: args => ({
    components: { BottomNav },
    setup: () => ({ args }),
    template: '<div class="relative h-40"><BottomNav v-bind="args" /></div>',
  }),
} satisfies Meta<typeof BottomNav>

export default meta

type Story = StoryObj<typeof meta>

export const Padrao: Story = {}
