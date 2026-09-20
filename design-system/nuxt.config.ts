import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  modules: ['@module-federation/nuxt'],

  pages: false,
  devtools: { componentInspector: false },

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      title: 'Atlas Design System',
      meta: [{ name: 'robots', content: 'noindex' }],
    },
  },
  css: ['~/assets/styles/main.scss'],
  srcDir: 'src',

  devServer: { port: 3003 },
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

  moduleFederation: {
    config: {
      name: 'ui',
      shared: {
        'vue': { singleton: true, requiredVersion: '^3.5.0' },
        'vue-router': { singleton: true, requiredVersion: '^5.1.0' },
      },
    },
  },
})
