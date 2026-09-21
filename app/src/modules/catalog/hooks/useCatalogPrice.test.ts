import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { router, setRouteQuery } from '@/tests/nuxt-env'
import { makeCatalogResponse } from '@/tests/factories'
import { getCatalogService } from '@/modules/catalog/services/catalogService'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'
import { useCatalogPrice } from '@/modules/catalog/hooks/useCatalogPrice'

const inputEvent = (value: string) => {
  const input = document.createElement('input')

  input.value = value

  return { event: { target: input } as unknown as Event, input }
}

vi.mock('@/modules/catalog/services/catalogService')

const getCatalog = vi.mocked(getCatalogService)

describe('useCatalogPrice', () => {
  beforeEach(() => {
    getCatalog.mockResolvedValue(makeCatalogResponse())
  })

  it('starts with the fields from the route', () => {
    setRouteQuery({ minPrice: '100', maxPrice: '300' })

    const price = useCatalogPrice()

    expect([price.min, price.max]).toEqual(['100', '300'])
  })

  it('starts empty when the route has no range', () => {
    const price = useCatalogPrice()

    expect([price.min, price.max]).toEqual(['', ''])
  })

  it('keeps digits only and cuts at the range ceiling', () => {
    useCatalogList().response = makeCatalogResponse()

    const price = useCatalogPrice()

    expect(price.maxLength).toBe(3)

    const min = inputEvent('R$ 1.234,56')

    price.maskMin(min.event)

    expect(min.input.value).toBe('123')
    expect(price.min).toBe('123')

    const max = inputEvent('98a7')

    price.maskMax(max.event)

    expect(price.max).toBe('987')
  })

  it('clamps the typed value inside the range on commit', () => {
    useCatalogList().response = makeCatalogResponse()

    const price = useCatalogPrice()

    price.maskMin(inputEvent('10').event)
    price.commitMin()

    expect(price.min).toBe('50')
    expect(router.push).toHaveBeenLastCalledWith({ query: { minPrice: '50' } })

    price.maskMax(inputEvent('999').event)
    price.commitMax()

    expect(price.max).toBe('400')
    expect(router.push).toHaveBeenLastCalledWith({ query: { minPrice: '50', maxPrice: '400' } })
  })

  it('commits an empty field as no limit', () => {
    const price = useCatalogPrice()

    price.commitMin()

    expect(price.min).toBe('')
    expect(router.push).toHaveBeenLastCalledWith({ query: {} })

    price.commitMax()

    expect(price.max).toBe('')
  })

  it('follows the range when the route changes elsewhere', async () => {
    const price = useCatalogPrice()

    setRouteQuery({ minPrice: '120', maxPrice: '480' })

    await nextTick()

    expect([price.min, price.max]).toEqual(['120', '480'])
  })
})
