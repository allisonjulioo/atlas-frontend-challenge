import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Avatar from '@/components/exposed/Avatar.vue'
import { professional } from './fixtures'

const meta = {
  title: 'Dados/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    src: professional.avatarUrl,
    name: professional.name,
    size: 72,
  },
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const Grande: Story = {
  args: { size: 112 },
}

export const SemImagem: Story = {
  args: { src: 'https://exemplo.invalido/foto.jpg' },
}
