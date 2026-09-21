import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SORT_KEYS, SORT_LABEL } from '@atlas/contracts'
import { setRouteQuery } from '@/tests/nuxt-env'
import { makeCatalogResponse, makeFacets } from '@/tests/factories'
import { useCatalogFacets } from '@/modules/catalog/hooks/useCatalogFacets'
import { getCatalogService } from '@/modules/catalog/services/catalogService'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'

vi.mock('@/modules/catalog/services/catalogService')

const getCatalog = vi.mocked(getCatalogService)

describe('useCatalogFacets', () => {
  beforeEach(() => {
    getCatalog.mockResolvedValue(makeCatalogResponse())
  })

  it('falls back to the default range until the catalog answers', () => {
    const facets = useCatalogFacets()

    expect(facets.hasFacets).toBe(false)
    expect(facets.categoryBuckets).toEqual([])
    expect(facets.availabilityBuckets).toEqual([])
    expect(facets.priceRange).toEqual({ min: 0, max: 1000 })
  })

  it('uses the buckets from the answer', () => {
    useCatalogList().response = makeCatalogResponse()

    const facets = useCatalogFacets()

    expect(facets.hasFacets).toBe(true)
    expect(facets.categoryBuckets).toEqual(makeFacets().categories)
    expect(facets.availabilityBuckets).toEqual(makeFacets().availability)
    expect(facets.priceRange).toEqual({ min: 50, max: 400 })
  })

  it('treats a missing distance as no limit', () => {
    const facets = useCatalogFacets()

    expect(facets.distanceValue).toBe(0)
    expect(facets.distanceKey).toBe('')
    expect(facets.distanceLabel).toBe('Qualquer distância')
    expect(facets.distanceMax).toBe(20)
    expect(facets.distanceStep).toBe(1)
    expect(facets.distanceOptions.map(option => option.value)).toEqual(['5', '10', '15', '20'])
  })

  it('fits the route distance among the fixed options', () => {
    setRouteQuery({ maxDistanceKm: '7' })

    const facets = useCatalogFacets()

    expect(facets.distanceValue).toBe(7)
    expect(facets.distanceKey).toBe('7')
    expect(facets.distanceLabel).toBe('Até 7 km')
    expect(facets.distanceOptions).toEqual([
      { value: '5', label: 'Até 5 km' },
      { value: '7', label: 'Até 7 km' },
      { value: '10', label: 'Até 10 km' },
      { value: '15', label: 'Até 15 km' },
      { value: '20', label: 'Até 20 km' },
    ])
  })

  it('lists the sorting from the contract', () => {
    const facets = useCatalogFacets()

    expect(facets.sortKey).toBe('relevancia')
    expect(facets.sortOptions).toEqual(SORT_KEYS.map(key => ({ value: key, label: SORT_LABEL[key] })))
  })

  it('knows what is checked and what is out of reach', () => {
    setRouteQuery({ categories: 'casa', availability: 'imediata' })

    const facets = useCatalogFacets()

    expect(facets.isCategoryChecked('casa')).toBe(true)
    expect(facets.isCategoryChecked('beleza')).toBe(false)
    expect(facets.isAvailabilityChecked('imediata')).toBe(true)
    expect(facets.isAvailabilityChecked('agendada')).toBe(false)
    expect(facets.isBucketDisabled(0, false)).toBe(true)
    expect(facets.isBucketDisabled(0, true)).toBe(false)
    expect(facets.isBucketDisabled(3, false)).toBe(false)
  })
})
