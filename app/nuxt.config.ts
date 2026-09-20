import { fileURLToPath } from 'node:url'

import { appRoutes } from './src/router/routes'

export default defineNuxtConfig({
  modules: ['@module-federation/nuxt', '@pinia/nuxt'],

  pages: true,

  devtools: { componentInspector: false },

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      title: 'Catálogo de profissionais',
      meta: [{ name: 'robots', content: 'noindex' }],
    },
  },
  css: ['@atlas/design-system/styles'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:3001',
    },
  },
  srcDir: 'src',

  devServer: { port: 3002 },
  compatibilityDate: '2026-09-20',

  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },

  typescript: { typeCheck: false, strict: true },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  hooks: {
    'pages:extend': (pages) => {
      pages.splice(0, pages.length, ...appRoutes)
    },
  },

  moduleFederation: {
    config: {
      name: 'catalog',
      shared: {
        'vue': { singleton: true, requiredVersion: '^3.5.0' },
        'vue-router': { singleton: true, requiredVersion: '^5.1.0' },
        'pinia': { singleton: true, requiredVersion: '^4.0.0' },
      },
    },
  },
})
