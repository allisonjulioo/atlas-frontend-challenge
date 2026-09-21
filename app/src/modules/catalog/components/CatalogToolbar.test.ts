import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { AtlasDropdown } from '@atlas/design-system'
import { router, setRouteQuery } from '@/tests/nuxt-env'
import { makeCatalogResponse } from '@/tests/factories'
import { getCatalogService } from '@/modules/catalog/services/catalogService'
import { useCatalogDrawer } from '@/modules/catalog/hooks/useCatalogDrawer'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'
import CatalogToolbar from '@/modules/catalog/components/CatalogToolbar.vue'

vi.mock('@/modules/catalog/services/catalogService')

const getCatalog = vi.mocked(getCatalogService)

describe('CatalogToolbar', () => {
  beforeEach(() => {
    getCatalog.mockResolvedValue(makeCatalogResponse())
  })

  it('hides the counter without active filters', () => {
    const wrapper = mount(CatalogToolbar)

    expect(wrapper.find('.catalog-toolbar__count').exists()).toBe(false)
    expect(wrapper.find('.catalog-toolbar__total').text()).toBe('0 profissionais encontrados')
  })

  it('shows how many filters are on and the total found', () => {
    setRouteQuery({ categories: 'casa', verifiedOnly: '1' })
    useCatalogList().response = makeCatalogResponse()

    const wrapper = mount(CatalogToolbar)

    expect(wrapper.find('.catalog-toolbar__count').text()).toBe('2')
    expect(wrapper.find('.catalog-toolbar__total').text()).toBe('1 profissional encontrado')
  })

  it('the filters button opens the drawer', async () => {
    const wrapper = mount(CatalogToolbar)

    await wrapper.find('.catalog-toolbar__filters').trigger('click')

    expect(useCatalogDrawer().isOpen).toBe(true)
  })

  it('applies distance and sorting from the dropdowns', async () => {
    const dropdowns = mount(CatalogToolbar).findAllComponents(AtlasDropdown)

    await dropdowns[0]!.vm.$emit('update:modelValue', '10')

    expect(router.push).toHaveBeenLastCalledWith({ query: { maxDistanceKm: '10' } })

    await dropdowns[1]!.vm.$emit('update:modelValue', 'avaliacao')

    expect(router.push).toHaveBeenLastCalledWith({ query: { maxDistanceKm: '10', sort: 'avaliacao' } })
  })
})
