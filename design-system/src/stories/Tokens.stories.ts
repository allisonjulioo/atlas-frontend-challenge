import type { Meta, StoryObj } from '@storybook/vue3-vite'

const PALETTE = [
  { name: 'Dusk Blue', token: 'brand', hex: '#3d5a80', usage: 'Ação primária, links, foco' },
  { name: 'Powder Blue', token: 'brand-soft', hex: '#98c1d9', usage: 'Apoio e divisórias' },
  { name: 'Light Cyan', token: 'surface-soft', hex: '#e0fbfc', usage: 'Superfície de apoio, chip, campo' },
  { name: 'Burnt Peach', token: 'accent', hex: '#ee6c4d', usage: 'CTA, estrela, selo de destaque' },
  { name: 'Jet Black', token: 'ink', hex: '#293241', usage: 'Texto' },
]

const TEXT = [
  { token: 'content', label: 'Texto principal' },
  { token: 'content-muted', label: 'Texto secundário' },
  { token: 'content-subtle', label: 'Texto de apoio' },
]

const RADIUS = [
  { token: 'rounded-control', value: '4px', usage: 'Botão, campo, select' },
  { token: 'rounded-card', value: '8px', usage: 'Card, painel, diálogo' },
  { token: 'rounded-full', value: '999px', usage: 'Chip, badge, busca' },
]

const SHADOW = [
  { token: 'shadow-card', usage: 'Card em repouso' },
  { token: 'shadow-card-hover', usage: 'Card em hover' },
  { token: 'shadow-overlay', usage: 'Diálogo e menu' },
]

const meta = {
  title: 'Fundamentos/Tokens',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { value: 'surface' },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Paleta: Story = {
  render: () => ({
    setup: () => ({ palette: PALETTE }),
    template: `
      <ul class="m-0 grid list-none gap-4 p-0 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        <li v-for="color in palette" :key="color.token" class="overflow-hidden rounded-card bg-surface shadow-card">
          <div class="h-20" :style="{ background: color.hex }"></div>
          <div class="flex flex-col gap-1 p-3">
            <strong class="text-sm">{{ color.name }}</strong>
            <code class="text-xs text-content-muted">{{ color.token }} · {{ color.hex }}</code>
            <span class="text-xs text-content-subtle">{{ color.usage }}</span>
          </div>
        </li>
      </ul>
    `,
  }),
}

export const Texto: Story = {
  render: () => ({
    setup: () => ({ text: TEXT }),
    template: `
      <div class="flex flex-col gap-3">
        <p v-for="item in text" :key="item.token" :class="\`text-\${item.token}\`">
          {{ item.label }} (text-{{ item.token }})
        </p>
      </div>
    `,
  }),
}

export const Forma: Story = {
  render: () => ({
    setup: () => ({ radius: RADIUS, shadow: SHADOW }),
    template: `
      <div class="flex flex-col gap-8">
        <section class="flex flex-col gap-3">
          <h3 class="text-sm font-semibold text-content-subtle">Raio</h3>
          <div class="flex flex-wrap gap-4">
            <div v-for="item in radius" :key="item.token" class="flex flex-col items-center gap-2">
              <div class="h-20 w-20 bg-brand" :class="item.token"></div>
              <code class="text-xs">{{ item.token }}</code>
              <span class="text-xs text-content-subtle">{{ item.value }}</span>
            </div>
          </div>
        </section>

        <section class="flex flex-col gap-3">
          <h3 class="text-sm font-semibold text-content-subtle">Sombra</h3>
          <div class="flex flex-wrap gap-6">
            <div v-for="item in shadow" :key="item.token" class="flex flex-col items-center gap-2">
              <div class="h-20 w-28 rounded-card bg-surface" :class="item.token"></div>
              <code class="text-xs">{{ item.token }}</code>
              <span class="text-xs text-content-subtle">{{ item.usage }}</span>
            </div>
          </div>
        </section>
      </div>
    `,
  }),
}
