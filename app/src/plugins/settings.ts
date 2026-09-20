import { useRuntimeSettings } from '@atlas/contracts'

export default defineNuxtPlugin(() => {
  const { apiBase } = useRuntimeConfig().public

  useRuntimeSettings().set({ apiBase })
})
