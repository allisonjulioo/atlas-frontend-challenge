import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SkeletonCard from '@/components/exposed/SkeletonCard.vue'

const meta = {
  title: 'Catálogo/SkeletonCard',
  component: SkeletonCard,
  tags: ['autodocs'],
  render: () => ({
    components: { SkeletonCard },
    template: '<div class="w-[260px]"><SkeletonCard /></div>',
  }),
} satisfies Meta<typeof SkeletonCard>

export default meta

type Story = StoryObj<typeof meta>

export const Padrao: Story = {}
