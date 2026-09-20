import type { NuxtPage } from '@nuxt/schema'
import { catalogRoutes } from '../modules/catalog/router/routes'

export const appRoutes: NuxtPage[] = [
  ...catalogRoutes,
]
