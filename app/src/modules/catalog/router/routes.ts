import { fileURLToPath } from 'node:url'
import type { NuxtPage } from '@nuxt/schema'

export const catalogRoutes: NuxtPage[] = [
  {
    name: 'catalog-list',
    path: '/',
    file: fileURLToPath(new URL('../pages/CatalogListPage.vue', import.meta.url)),
  },
  {
    name: 'professional-profile',
    path: '/profissionais/:slug()',
    file: fileURLToPath(new URL('../pages/ProfessionalProfilePage.vue', import.meta.url)),
  },
]
