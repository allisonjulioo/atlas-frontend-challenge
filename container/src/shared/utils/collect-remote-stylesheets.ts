interface ManifestExpose {
  assets?: { css?: { sync?: string[], async?: string[] } }
}

export interface RemoteManifest {
  exposes?: ManifestExpose[]
}

export const collectRemoteStylesheets = (manifest: RemoteManifest, manifestUrl: string) => {
  const base = new URL(manifestUrl)
  const hrefs = new Set<string>()

  manifest.exposes?.forEach((expose) => {
    const files = [...(expose.assets?.css?.sync ?? []), ...(expose.assets?.css?.async ?? [])]

    files.forEach((file) => {
      hrefs.add(new URL(file, base).href)
    })
  })

  return [...hrefs]
}
