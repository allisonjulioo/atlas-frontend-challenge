import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { makeCatalogResponse, makeSummary } from '@/tests/factories'
import { getCatalogService } from '@/modules/catalog/services/catalogService'
import { useCatalogAutoLoad } from '@/modules/catalog/hooks/useCatalogAutoLoad'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'

vi.mock('@/modules/catalog/services/catalogService')

const getCatalog = vi.mocked(getCatalogService)

const observers: FakeObserver[] = []

class FakeObserver {
  readonly observed: Element[] = []
  disconnected = false

  constructor(readonly callback: IntersectionObserverCallback, readonly options: IntersectionObserverInit) {
    observers.push(this)
  }

  observe(element: Element) {
    this.observed.push(element)
  }

  disconnect() {
    this.disconnected = true
  }
}

const cross = (isIntersecting: boolean) => {
  const observer = observers.at(-1)!

  observer.callback([{ isIntersecting } as IntersectionObserverEntry], observer as unknown as IntersectionObserver)
}

const listWithMore = () => {
  const list = useCatalogList()

  list.response = makeCatalogResponse({ total: 2 })

  return list
}

describe('useCatalogAutoLoad', () => {
  beforeEach(() => {
    observers.splice(0, observers.length)
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    getCatalog.mockResolvedValue(makeCatalogResponse({
      items: [makeSummary({ id: 'pro-2', slug: 'bia-lima' })],
      total: 2,
    }))
  })

  it('counts what is left on the button', () => {
    listWithMore()

    expect(useCatalogAutoLoad().buttonLabel).toBe('Carregar mais (1 restantes)')
  })

  it('says it is loading', () => {
    listWithMore().loadingMore = true

    expect(useCatalogAutoLoad().buttonLabel).toBe('Carregando…')
  })

  it('closes the list when nothing is left', () => {
    useCatalogList().response = makeCatalogResponse()

    const auto = useCatalogAutoLoad()

    expect(auto.hasMore).toBe(false)
    expect(auto.showEndMessage).toBe(true)
  })

  it('observes the sentinel and fetches the next page when it is crossed', async () => {
    listWithMore()

    const auto = useCatalogAutoLoad()
    const sentinel = document.createElement('div')

    auto.setSentinel(sentinel)

    await nextTick()

    expect(observers).toHaveLength(1)
    expect(observers[0]!.observed).toEqual([sentinel])
    expect(observers[0]!.options).toEqual({ rootMargin: '400px 0px' })

    cross(true)

    await vi.waitFor(() => {
      expect(getCatalog).toHaveBeenCalledWith(expect.objectContaining({ page: 2 }))
    })
  })

  it('ignores the sentinel out of view and an empty entry', async () => {
    listWithMore()

    const auto = useCatalogAutoLoad()

    auto.setSentinel(document.createElement('div'))

    await nextTick()

    cross(false)

    const observer = observers.at(-1)!

    observer.callback([], observer as unknown as IntersectionObserver)

    expect(getCatalog).not.toHaveBeenCalled()
  })

  it('does not observe without a sentinel nor when the list is over', async () => {
    const list = listWithMore()

    const auto = useCatalogAutoLoad()

    auto.setSentinel(document.createElement('div'))

    await nextTick()

    auto.setSentinel(null)

    await nextTick()

    expect(observers).toHaveLength(1)
    expect(observers[0]!.disconnected).toBe(true)

    list.response = makeCatalogResponse()

    auto.setSentinel(document.createElement('div'))

    await nextTick()

    expect(observers).toHaveLength(1)
  })

  it('does not observe where there is no IntersectionObserver', async () => {
    listWithMore()

    vi.stubGlobal('IntersectionObserver', undefined)

    useCatalogAutoLoad().setSentinel(document.createElement('div'))

    await nextTick()

    expect(observers).toHaveLength(0)
  })

  it('reset disconnects the observer', async () => {
    listWithMore()

    const auto = useCatalogAutoLoad()

    auto.setSentinel(document.createElement('div'))

    await nextTick()

    auto.reset()

    expect(observers[0]!.disconnected).toBe(true)
  })
})
