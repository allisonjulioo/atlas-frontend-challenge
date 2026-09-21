import { URL as NodeURL } from 'node:url'
import { afterEach, beforeEach, vi } from 'vitest'
import { computed, ref, watch } from 'vue'
import { enableAutoUnmount } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import type { EffectScope } from 'vue'
import { resetNuxtEnv, route, router, runtimeConfig } from './nuxt-env'

Object.defineProperty(globalThis, 'URL', { value: NodeURL, writable: true, configurable: true })

Object.assign(globalThis, {
  ref,
  computed,
  watch,
  useRoute: () => route,
  useRouter: () => router,
  useRuntimeConfig: () => runtimeConfig,
  defineNuxtPlugin: <T>(plugin: T) => plugin,
})

enableAutoUnmount(afterEach)

let pinia: Pinia

beforeEach(() => {
  pinia = createPinia()

  setActivePinia(pinia)
  resetNuxtEnv()
})

afterEach(() => {
  ;(pinia as unknown as { _e: EffectScope })._e.stop()

  vi.useRealTimers()
  vi.unstubAllGlobals()
})
