import { collectRemoteStylesheets, type RemoteManifest } from '@/shared/utils/collect-remote-stylesheets'

export const fetchRemoteStylesheets = async (manifestUrl: string) => {
  try {
    const manifest = await $fetch<RemoteManifest>(manifestUrl)

    return collectRemoteStylesheets(manifest, manifestUrl)
  }
  catch {
    return []
  }
}
