import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { makeCatalogResponse, makeSummary } from '@/tests/factories'
import { getCatalogService } from '@/modules/catalog/services/catalogService'
import { useCatalogAutoLoad } from '@/modules/catalog/hooks/useCatalogAutoLoad'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'
import LoadMore from '@/modules/catalog/components/LoadMore.vue'

vi.mock('@/modules/catalog/services/catalogService')

const autoLoad = vi.hoisted(() => ({ setSentinel: vi.fn(), reset: vi.fn() }))

vi.mock('@/modules/catalog/hooks/useCatalogAutoLoad', async () => {
  const { defineStore } = await import('pinia')
  const { ref } = await import('vue')

  return {
    useCatalogAutoLoad: defineStore('catalogAutoLoad', () => ({
      buttonLabel: ref('Carregar mais (1 restantes)'),
      hasMore: ref(true),
      showEndMessage: ref(false),
      setSentinel: autoLoad.setSentinel,
      reset: autoLoad.reset,
    })),
  }
})

const getCatalog = vi.mocked(getCatalogService)

const autoLoadState = () => useCatalogAutoLoad() as unknown as { hasMore: boolean, showEndMessage: boolean }

describe('LoadMore', () => {
  beforeEach(() => {
    getCatalog.mockResolvedValue(makeCatalogResponse({
      items: [makeSummary({ id: 'pro-2', slug: 'bia-lima' })],
      total: 2,
    }))
  })

  it('offers the next page and hands the sentinel to the observer', async () => {
    useCatalogList().response = makeCatalogResponse({ total: 2 })

    const wrapper = mount(LoadMore)

    expect(autoLoad.setSentinel.mock.calls[0]![0]).toBe(wrapper.find('.load-more__sentinel').element)
    expect(wrapper.find('button').text()).toBe('Carregar mais (1 restantes)')

    await wrapper.find('button').trigger('click')

    expect(getCatalog).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ page: 2 }))
  })

  it('locks the button while the next page is on the way', () => {
    const list = useCatalogList()

    list.response = makeCatalogResponse({ total: 2 })
    list.loadingMore = true

    const wrapper = mount(LoadMore)

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('closes the list when everything has been loaded', () => {
    const auto = autoLoadState()

    auto.hasMore = false
    auto.showEndMessage = true

    const wrapper = mount(LoadMore)

    expect(wrapper.find('.load-more').exists()).toBe(false)
    expect(wrapper.find('.load-more__end').text()).toBe('Isso é tudo.')
  })

  it('stays out of the way while the first search runs', () => {
    const auto = autoLoadState()

    auto.hasMore = false
    auto.showEndMessage = false

    const wrapper = mount(LoadMore)

    expect(wrapper.find('.load-more').exists()).toBe(false)
    expect(wrapper.find('.load-more__end').exists()).toBe(false)
  })

  it('drops the observer when it leaves the screen', () => {
    mount(LoadMore).unmount()

    expect(autoLoad.reset).toHaveBeenCalledOnce()
  })
})
