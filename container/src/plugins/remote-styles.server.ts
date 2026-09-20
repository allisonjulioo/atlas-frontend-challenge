import { fetchRemoteStylesheets } from '@/shared/utils/fetch-remote-stylesheets'

export default defineNuxtPlugin(async () => {
  const { remoteManifests, siteUrl } = useRuntimeConfig().public

  const stylesheets = await Promise.all(remoteManifests.map(manifest => fetchRemoteStylesheets(new URL(manifest, siteUrl).href)))

  const link = [...new Set(stylesheets.flat())].map(href => ({
    rel: 'stylesheet' as const,
    href,
    crossorigin: 'anonymous' as const,
  }))

  useHead({ link })
})
