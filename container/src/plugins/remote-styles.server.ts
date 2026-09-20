import { fetchRemoteStylesheets } from '@/shared/utils/fetch-remote-stylesheets'

export default defineNuxtPlugin(async () => {
  const { remoteManifests } = useRuntimeConfig().public

  const stylesheets = await Promise.all(remoteManifests.map(fetchRemoteStylesheets))

  const link = [...new Set(stylesheets.flat())].map(href => ({
    rel: 'stylesheet' as const,
    href,
    crossorigin: 'anonymous' as const,
  }))

  useHead({ link })
})
