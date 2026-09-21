import { describe, expect, it } from 'vitest'
import { router, setRouteQuery } from '@/tests/nuxt-env'
import { useCatalogFilters } from '@/modules/catalog/hooks/useCatalogFilters'

describe('useCatalogFilters', () => {
  it('derives query, cache key and count from the route', () => {
    setRouteQuery({ q: 'ana', categories: 'casa', minPrice: '100', page: '3' })

    const filters = useCatalogFilters()

    expect(filters.query).toMatchObject({ q: 'ana', categories: ['casa'], minPrice: 100, page: 3 })
    expect(filters.filtersKey).toBe('catalog:categories=casa&minPrice=100&q=ana')
    expect(filters.activeCount).toBe(2)
    expect(filters.hasActiveFilters).toBe(true)
  })

  it('counts the search alone as an active filter', () => {
    setRouteQuery({ q: 'ana' })

    const filters = useCatalogFilters()

    expect(filters.activeCount).toBe(0)
    expect(filters.hasActiveFilters).toBe(true)
  })

  it('sees no active filter on a clean route', () => {
    expect(useCatalogFilters().hasActiveFilters).toBe(false)
  })

  it('applies the patch and goes back to the first page', async () => {
    setRouteQuery({ page: '4' })

    await useCatalogFilters().apply({ q: 'bia' })

    expect(router.push).toHaveBeenCalledExactlyOnceWith({ query: { q: 'bia' } })
  })

  it('swaps the history entry in replace mode', async () => {
    await useCatalogFilters().apply({ q: 'bia' }, 'replace')

    expect(router.replace).toHaveBeenCalledExactlyOnceWith({ query: { q: 'bia' } })
    expect(router.push).not.toHaveBeenCalled()
  })

  it('toggles category and availability both ways', () => {
    const filters = useCatalogFilters()

    filters.toggleCategory('casa')

    expect(router.push).toHaveBeenCalledWith({ query: { categories: 'casa' } })

    filters.toggleCategory('casa')

    expect(router.push).toHaveBeenLastCalledWith({ query: {} })

    filters.toggleAvailability('imediata')

    expect(router.push).toHaveBeenLastCalledWith({ query: { availability: 'imediata' } })
  })

  it('stores the sorting', () => {
    useCatalogFilters().setSort('preco-asc')

    expect(router.push).toHaveBeenCalledExactlyOnceWith({ query: { sort: 'preco-asc' } })
  })

  it('treats empty and zero distance as no limit', () => {
    const filters = useCatalogFilters()

    filters.setDistance('10')

    expect(router.push).toHaveBeenLastCalledWith({ query: { maxDistanceKm: '10' } })

    filters.setDistance('')

    expect(router.push).toHaveBeenLastCalledWith({ query: {} })

    filters.setDistance(0)

    expect(router.push).toHaveBeenLastCalledWith({ query: {} })
  })

  it('treats an empty price as no limit', () => {
    const filters = useCatalogFilters()

    filters.setMinPrice('100')

    expect(router.push).toHaveBeenLastCalledWith({ query: { minPrice: '100' } })

    filters.setMinPrice('')

    expect(router.push).toHaveBeenLastCalledWith({ query: {} })

    filters.setMaxPrice('300')

    expect(router.push).toHaveBeenLastCalledWith({ query: { maxPrice: '300' } })

    filters.setMaxPrice('')

    expect(router.push).toHaveBeenLastCalledWith({ query: {} })
  })

  it('turns on the verified only filter', () => {
    useCatalogFilters().setVerifiedOnly(true)

    expect(router.push).toHaveBeenCalledExactlyOnceWith({ query: { verifiedOnly: '1' } })
  })

  it('trims the searched term', () => {
    useCatalogFilters().setSearchTerm('  ana  ', 'replace')

    expect(router.replace).toHaveBeenCalledExactlyOnceWith({ query: { q: 'ana' } })
  })

  it('clears every filter and keeps the sorting', () => {
    setRouteQuery({ q: 'ana', categories: 'casa', verifiedOnly: '1', sort: 'avaliacao' })

    useCatalogFilters().clearAll()

    expect(router.push).toHaveBeenCalledExactlyOnceWith({ query: { sort: 'avaliacao' } })
  })
})
