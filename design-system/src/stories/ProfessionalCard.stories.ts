import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ProfessionalCard from '@/components/exposed/ProfessionalCard.vue'
import SkeletonCard from '@/components/exposed/SkeletonCard.vue'
import { professional } from './fixtures'

const meta = {
  title: 'Catálogo/ProfessionalCard',
  component: ProfessionalCard,
  tags: ['autodocs'],
  args: {
    professional,
    href: '#',
    priority: true,
    favorite: false,
  },
  render: args => ({
    components: { ProfessionalCard },
    setup: () => ({ args }),
    template: '<div class="w-[260px]"><ProfessionalCard v-bind="args" /></div>',
  }),
} satisfies Meta<typeof ProfessionalCard>

export default meta

type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const Favoritado: Story = {
  args: { favorite: true },
}

export const SobAgendamento: Story = {
  args: {
    professional: { ...professional, availability: 'agendada', verified: false },
  },
}

export const Grade: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    components: { ProfessionalCard, SkeletonCard },
    setup: () => ({
      items: [
        professional,
        { ...professional, id: 'pro-0002', name: 'Rafael Nunes', profession: 'Encanador', hourlyRate: 95, rating: 4.4, reviewsCount: 87, availability: 'esta-semana', verified: false, coverUrl: 'https://picsum.photos/seed/atlas-cover-2/600/800' },
        { ...professional, id: 'pro-0003', name: 'Helena Prado', profession: 'Cabeleireira', hourlyRate: 180, rating: 4.9, reviewsCount: 402, coverUrl: 'https://picsum.photos/seed/atlas-cover-3/600/800' },
      ],
    }),
    template: `
      <ul class="m-0 grid list-none gap-4 p-0 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
        <li v-for="item in items" :key="item.id"><ProfessionalCard :professional="item" href="#" /></li>
        <li><SkeletonCard /></li>
      </ul>
    `,
  }),
}
