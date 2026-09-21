import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { formatPrice } from '@atlas/contracts'
import { AtlasSlider } from '@atlas/design-system'
import { router, setRouteQuery } from '@/tests/nuxt-env'
import { makeCatalogResponse } from '@/tests/factories'
import { getCatalogService } from '@/modules/catalog/services/catalogService'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'
import CatalogFilters from '@/modules/catalog/components/CatalogFilters.vue'

vi.mock('@/modules/catalog/services/catalogService')

const getCatalog = vi.mocked(getCatalogService)

const withFacets = () => {
  useCatalogList().response = makeCatalogResponse()

  return mount(CatalogFilters)
}

describe('CatalogFilters', () => {
  beforeEach(() => {
    getCatalog.mockResolvedValue(makeCatalogResponse())
  })

  it('waits for the facets to show buckets and catalog range', () => {
    const wrapper = mount(CatalogFilters)

    expect(wrapper.findAll('.catalog-filters__option')).toHaveLength(0)
    expect(wrapper.find('.catalog-filters__hint').exists()).toBe(false)
    expect(wrapper.find('.catalog-filters__clear').exists()).toBe(false)
  })

  it('lists the buckets and marks the empty ones', () => {
    const wrapper = withFacets()

    const options = wrapper.findAll('.catalog-filters__option')

    expect(options).toHaveLength(4)
    expect(options[0]!.text()).toContain('Casa e reformas')
    expect(options[1]!.classes()).toContain('catalog-filters__option--empty')
    expect(options[2]!.text()).toContain('Disponível agora')
    expect(wrapper.find('.catalog-filters__hint').text()).toBe(
      `Catálogo entre ${formatPrice(50)} e ${formatPrice(400)}`,
    )
  })

  it('toggles category and availability from the checkboxes', async () => {
    const inputs = withFacets().findAll('.catalog-filters__option input')

    await inputs[0]!.trigger('change')

    expect(router.push).toHaveBeenLastCalledWith({ query: { categories: 'casa' } })

    await inputs[2]!.trigger('change')

    expect(router.push).toHaveBeenLastCalledWith({ query: { categories: 'casa', availability: 'imediata' } })
  })

  it('masks and commits the price range', async () => {
    const wrapper = withFacets()

    const inputs = wrapper.findAll('.catalog-filters__range-field input')

    expect(inputs[0]!.attributes('maxlength')).toBe('3')
    expect(inputs[0]!.attributes('placeholder')).toBe('50')
    expect(inputs[1]!.attributes('placeholder')).toBe('400')

    await inputs[0]!.setValue('R$ 1.234')

    expect((inputs[0]!.element as HTMLInputElement).value).toBe('123')

    await inputs[0]!.trigger('change')

    expect(router.push).toHaveBeenLastCalledWith({ query: { minPrice: '123' } })

    await inputs[1]!.setValue('999')
    await inputs[1]!.trigger('change')

    expect(router.push).toHaveBeenLastCalledWith({ query: { minPrice: '123', maxPrice: '400' } })
  })

  it('applies the distance from the slider', async () => {
    const slider = withFacets().findComponent(AtlasSlider)

    expect(slider.props()).toMatchObject({ value: 0, min: 0, max: 20, step: 1, hint: 'Qualquer distância' })

    await slider.vm.$emit('change', '15')

    expect(router.push).toHaveBeenLastCalledWith({ query: { maxDistanceKm: '15' } })
  })

  it('turns on the verified only filter', async () => {
    await withFacets().find('.catalog-filters__switch input').setValue(true)

    expect(router.push).toHaveBeenLastCalledWith({ query: { verifiedOnly: '1' } })
  })

  it('shows and clears the active filter count', async () => {
    setRouteQuery({ categories: 'casa', verifiedOnly: '1' })

    const wrapper = withFacets()

    const clear = wrapper.find('.catalog-filters__clear')

    expect(clear.text()).toBe('Limpar (2)')

    await clear.trigger('click')

    expect(router.push).toHaveBeenLastCalledWith({ query: {} })
  })
})
