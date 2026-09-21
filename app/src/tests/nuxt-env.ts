import { reactive } from 'vue'
import { vi } from 'vitest'

export interface RouterTarget {
  name?: string
  params?: Record<string, string>
  query?: Record<string, string>
}

export const route = reactive({
  query: {} as Record<string, string | string[]>,
  params: {} as Record<string, string>,
})

export const runtimeConfig = { public: { apiBase: 'http://localhost:3001' } }

const navigate = (target: RouterTarget) => {
  if (target.query) {
    route.query = target.query
  }

  if (target.params) {
    route.params = { ...route.params, ...target.params }
  }

  return Promise.resolve()
}

export const router = {
  push: vi.fn(navigate),
  replace: vi.fn(navigate),
}

export const setRouteQuery = (query: Record<string, string | string[]>) => {
  route.query = query
}

export const setRouteParams = (params: Record<string, string>) => {
  route.params = params
}

export const resetNuxtEnv = () => {
  route.query = {}
  route.params = {}
  runtimeConfig.public.apiBase = 'http://localhost:3001'
  router.push.mockClear()
  router.replace.mockClear()
}
