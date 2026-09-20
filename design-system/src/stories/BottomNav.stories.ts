import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BottomNav from '@/components/exposed/BottomNav.vue'
import { navItems } from './fixtures'

const meta = {
  title: 'Navegação/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  args: { items: navItems },
  render: args => ({
    components: { BottomNav },
    setup: () => ({ args }),
    template: `
      <div class="relative mx-auto h-40 w-full max-w-sm overflow-hidden rounded-xl border border-line bg-canvas
        [&_.atlas-bottom-nav]:!absolute [&_.atlas-bottom-nav]:!grid">
        <BottomNav v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<typeof BottomNav>

export default meta

type Story = StoryObj<typeof meta>

export const Padrao: Story = {}
