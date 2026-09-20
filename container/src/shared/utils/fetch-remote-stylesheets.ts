import { collectRemoteStylesheets, type RemoteManifest } from '@/shared/utils/collect-remote-stylesheets'

export const fetchRemoteStylesheets = (manifestUrl: string) => $fetch<RemoteManifest>(manifestUrl)
  .then(manifest => collectRemoteStylesheets(manifest, manifestUrl))
  .catch(() => [])
