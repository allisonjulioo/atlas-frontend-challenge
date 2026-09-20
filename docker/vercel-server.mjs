const publicOrigin = process.env.ATLAS_PUBLIC_ORIGIN
const localOrigin = `http://127.0.0.1:${process.env.ATLAS_LISTEN_PORT}`
const nativeFetch = globalThis.fetch

globalThis.fetch = (input, init) => {
  const address = input instanceof Request ? input.url : String(input)
  let url

  try {
    url = new URL(address)
  } catch {
    return nativeFetch(input, init)
  }

  if (url.origin !== publicOrigin || !/^\/(api|remotes)\//.test(url.pathname)) {
    return nativeFetch(input, init)
  }

  const localUrl = new URL(`${url.pathname}${url.search}`, localOrigin)

  if (input instanceof Request) {
    return nativeFetch(new Request(localUrl, input), init)
  }

  return nativeFetch(localUrl, init)
}

await import('/srv/atlas/container/.output/server/index.mjs')
