import { describe, expect, it } from 'vitest'
import { router, setRouteQuery } from '@/tests/nuxt-env'
import { useCatalogChips } from '@/modules/catalog/hooks/useCatalogChips'

describe('useCatalogChips', () => {
  it('has no chips on a clean route', () => {
    const chips = useCatalogChips()

    expect(chips.chips).toEqual([])
    expect(chips.hasChips).toBe(false)
    expect(chips.hasActiveFilters).toBe(false)
  })

  it('mirrors the filters from the route', () => {
    setRouteQuery({ categories: 'casa', verifiedOnly: '1' })

    const chips = useCatalogChips()

    expect(chips.chips.map(chip => chip.key)).toEqual(['category:casa', 'verified'])
    expect(chips.hasChips).toBe(true)
    expect(chips.hasActiveFilters).toBe(true)
  })

  it('applies the patch of the removed chip', () => {
    setRouteQuery({ categories: 'casa', verifiedOnly: '1' })

    const chips = useCatalogChips()

    chips.remove(chips.chips[0]!)

    expect(router.push).toHaveBeenCalledExactlyOnceWith({ query: { verifiedOnly: '1' } })
  })

  it('exposes the clear all action', () => {
    setRouteQuery({ categories: 'casa' })

    useCatalogChips().clearAll()

    expect(router.push).toHaveBeenCalledExactlyOnceWith({ query: {} })
  })
})
