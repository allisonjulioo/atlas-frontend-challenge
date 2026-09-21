import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { router, setRouteQuery } from '@/tests/nuxt-env'
import CatalogChips from '@/modules/catalog/components/CatalogChips.vue'

describe('CatalogChips', () => {
  it('renders nothing without an applied filter', () => {
    expect(mount(CatalogChips).find('.catalog-chips').exists()).toBe(false)
  })

  it('lists one chip per filter plus clear all', () => {
    setRouteQuery({ categories: 'casa', verifiedOnly: '1' })

    const chips = mount(CatalogChips).findAll('button')

    expect(chips.map(chip => chip.text())).toEqual(['Casa e reformas', 'Verificados', 'Limpar tudo'])
  })

  it('removes the filter of the clicked chip', async () => {
    setRouteQuery({ categories: 'casa,beleza' })

    await mount(CatalogChips).findAll('button')[0]!.trigger('click')

    expect(router.push).toHaveBeenCalledExactlyOnceWith({ query: { categories: 'beleza' } })
  })

  it('clears everything from the last chip', async () => {
    setRouteQuery({ categories: 'casa' })

    const buttons = mount(CatalogChips).findAll('button')

    await buttons[buttons.length - 1]!.trigger('click')

    expect(router.push).toHaveBeenCalledExactlyOnceWith({ query: {} })
  })
})
