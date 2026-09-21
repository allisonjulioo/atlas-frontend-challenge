import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { usePageMeta } from '@atlas/contracts'
import { setRouteQuery } from '@/tests/nuxt-env'
import { makeCatalogResponse, makeFacets, makeSummary } from '@/tests/factories'
import { getCatalogService } from '@/modules/catalog/services/catalogService'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'

vi.mock('@/modules/catalog/services/catalogService')

const getCatalog = vi.mocked(getCatalogService)

describe('useCatalogList', () => {
  beforeEach(() => {
    getCatalog.mockResolvedValue(makeCatalogResponse())
  })

  it('loads the first page and publishes the listing meta', async () => {
    const list = useCatalogList()

    await list.init()

    expect(getCatalog).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ page: 1 }))
    expect(list.items).toHaveLength(1)
    expect(list.total).toBe(1)
    expect(list.facets).toEqual(makeFacets())
    expect(list.pending).toBe(false)
    expect(usePageMeta().meta.title).toBe('Encontre profissionais autônomos perto de você')
  })

  it('does not fetch again when the answer came from the server', async () => {
    const list = useCatalogList()

    list.response = makeCatalogResponse()

    await list.init()

    expect(getCatalog).not.toHaveBeenCalled()
    expect(usePageMeta().meta.description).toContain('1 profissionais autônomos')
  })

  it('reports a failed search', async () => {
    getCatalog.mockRejectedValue(new Error('offline'))

    const list = useCatalogList()

    await list.load()

    expect(list.errorMessage).toBe('Não foi possível carregar o catálogo agora.')
    expect(list.pending).toBe(false)
  })

  it('appends the next page', async () => {
    getCatalog.mockResolvedValue(makeCatalogResponse({ total: 2 }))

    const list = useCatalogList()

    await list.init()

    getCatalog.mockResolvedValue(makeCatalogResponse({
      items: [makeSummary({ id: 'pro-2', slug: 'bia-lima' })],
      total: 2,
    }))

    await list.loadMore()

    expect(getCatalog).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }))
    expect(list.items.map(item => item.slug)).toEqual(['ana-souza', 'bia-lima'])
    expect(list.loadedPage).toBe(2)
    expect(list.loadingMore).toBe(false)
  })

  it('stops fetching when the catalog is over', async () => {
    const list = useCatalogList()

    await list.init()
    await list.loadMore()

    expect(getCatalog).toHaveBeenCalledOnce()
  })

  it('does not fire two next page requests at once', async () => {
    getCatalog.mockResolvedValue(makeCatalogResponse({ total: 2 }))

    const list = useCatalogList()

    await list.init()

    list.loadingMore = true

    await list.loadMore()

    expect(getCatalog).toHaveBeenCalledOnce()
  })

  it('reports a failed next page', async () => {
    getCatalog.mockResolvedValue(makeCatalogResponse({ total: 2 }))

    const list = useCatalogList()

    await list.init()

    getCatalog.mockRejectedValue(new Error('offline'))

    await list.loadMore()

    expect(list.errorMessage).toBe('Não foi possível carregar mais resultados.')
    expect(list.loadingMore).toBe(false)
  })

  it('searches again when the filters change', async () => {
    const list = useCatalogList()

    await list.init()

    setRouteQuery({ q: 'ana' })

    await nextTick()

    await vi.waitFor(() => {
      expect(getCatalog).toHaveBeenCalledTimes(2)
    })

    expect(getCatalog).toHaveBeenLastCalledWith(expect.objectContaining({ q: 'ana', page: 1 }))
  })

  it('reset brings the initial state back', async () => {
    getCatalog.mockResolvedValue(makeCatalogResponse({ total: 2 }))

    const list = useCatalogList()

    await list.init()
    await list.loadMore()

    list.reset()

    expect(list.items).toEqual([])
    expect(list.total).toBe(0)
    expect(list.facets).toBeNull()
    expect(list.loadedPage).toBe(1)
    expect(list.errorMessage).toBeNull()
  })
})
