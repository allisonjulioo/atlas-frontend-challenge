import { fileURLToPath } from 'node:url'

import { appRoutes } from './src/router/routes'

const UI_REMOTE = process.env.ATLAS_UI_REMOTE ?? 'http://localhost:3003/_mf/mf-manifest.json'
const CATALOG_REMOTE = process.env.ATLAS_CATALOG_REMOTE ?? 'http://localhost:3002/_mf/mf-manifest.json'

export default defineNuxtConfig({
  modules: ['@module-federation/nuxt', '@pinia/nuxt'],

  pages: true,

  components: [
    { path: '~/shared/components', pathPrefix: false },
  ],

  devtools: { componentInspector: false },

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'preconnect', href: new URL(UI_REMOTE).origin, crossorigin: '' },
        { rel: 'preconnect', href: new URL(CATALOG_REMOTE).origin, crossorigin: '' },
        { rel: 'dns-prefetch', href: 'https://randomuser.me' },
      ],
    },
  },
  css: ['@atlas/design-system/styles'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:3001',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
      remoteManifests: [UI_REMOTE, CATALOG_REMOTE],
    },
  },
  srcDir: 'src',

  routeRules: {
    '/': { headers: { 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' } },
    '/profissionais/**': { headers: { 'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600' } },
  },

  devServer: { port: 3000 },
  compatibilityDate: '2026-09-20',

  nitro: {
    compressPublicAssets: { brotli: true, gzip: true },
  },

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
    remoteComponents: {
      ui: [
        'Avatar',
        'Badge',
        'BottomNav',
        'Button',
        'Chip',
        'EmptyState',
        'Logo',
        'PriceTag',
        'ProfessionalCard',
        'ProfessionalGrid',
        'Rating',
        'SearchField',
        'SkeletonCard',
        'Tabs',
      ],
      catalog: ['CatalogView', 'ProfessionalProfile'],
    },
    config: {
      name: 'shell',
      hostInitInjectLocation: 'entry',
      remotes: {
        ui: {
          type: 'module',
          name: 'ui',
          entry: UI_REMOTE,
          entryGlobalName: 'ui',
          shareScope: 'default',
        },
        catalog: {
          type: 'module',
          name: 'catalog',
          entry: CATALOG_REMOTE,
          entryGlobalName: 'catalog',
          shareScope: 'default',
        },
      },
      shared: {
        'vue': { singleton: true, requiredVersion: '^3.5.0' },
        'vue-router': { singleton: true, requiredVersion: '^5.1.0' },
        'pinia': { singleton: true, requiredVersion: '^4.0.0' },
      },
    },
  },
})
