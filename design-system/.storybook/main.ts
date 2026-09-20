import { fileURLToPath } from 'node:url'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import vue from '@vitejs/plugin-vue'
import type { StorybookConfig } from '@storybook/vue3-vite'

const hasVuePlugin = (plugins: unknown[]): boolean => plugins.some((plugin) => {
  if (Array.isArray(plugin)) {
    return hasVuePlugin(plugin)
  }

  return Boolean(plugin) && typeof plugin === 'object' && (plugin as { name?: string }).name === 'vite:vue'
})

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.ts', '../src/stories/**/*.mdx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal: (config) => {
    if (process.env.ATLAS_VERCEL_BUILD) {
      config.base = '/storybook/'
    }
    config.plugins ??= []

    if (!hasVuePlugin(config.plugins)) {
      config.plugins.push(vue())
    }

    config.resolve ??= {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': fileURLToPath(new URL('../src', import.meta.url)),
    }

    config.css ??= {}
    config.css.postcss = {
      plugins: [tailwindcss(fileURLToPath(new URL('../tailwind.config.ts', import.meta.url))), autoprefixer()],
    }

    return config
  },
}

export default config
