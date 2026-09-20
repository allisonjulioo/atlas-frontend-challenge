import { useRuntimeSettings } from '@atlas/contracts'

export default defineNuxtPlugin(() => {
  const { apiBase, siteUrl } = useRuntimeConfig().public

  useRuntimeSettings().set({ apiBase, siteUrl })
})
