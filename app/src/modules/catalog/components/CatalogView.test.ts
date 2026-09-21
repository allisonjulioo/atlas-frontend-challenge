import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { AtlasEmptyState } from '@atlas/design-system'
import { makeCatalogResponse, makeSummary } from '@/tests/factories'
import { getCatalogService } from '@/modules/catalog/services/catalogService'
import { useCatalogDrawer } from '@/modules/catalog/hooks/useCatalogDrawer'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'
import CatalogView from '@/modules/catalog/components/CatalogView.vue'

vi.mock('@/modules/catalog/services/catalogService')

const getCatalog = vi.mocked(getCatalogService)

const stubViewport = (matches: boolean) => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })))
}

const mountView = async (props: Record<string, unknown> = {}) => {
  const wrapper = mount(CatalogView, { props, attachTo: document.body })

  await flushPromises()

  return wrapper
}

describe('CatalogView', () => {
  beforeEach(() => {
    stubViewport(false)
    getCatalog.mockResolvedValue(makeCatalogResponse())
  })

  it('loads the catalog on mount and falls back to the default title', async () => {
    const wrapper = await mountView()

    expect(wrapper.find('.catalog-view__title').text()).toBe('Encontre profissionais')
    expect(getCatalog).toHaveBeenCalledOnce()
  })

  it('takes the title from the container', async () => {
    const wrapper = await mountView({ title: 'Profissionais em São Paulo' })

    expect(wrapper.find('.catalog-view__title').text()).toBe('Profissionais em São Paulo')
  })

  it('offers a retry when the search fails', async () => {
    getCatalog.mockRejectedValue(new Error('offline'))

    const wrapper = await mountView()

    expect(wrapper.find('.catalog-view__error').text()).toContain('Não foi possível carregar o catálogo agora.')

    await wrapper.find('.catalog-view__error button').trigger('click')

    expect(getCatalog).toHaveBeenCalledTimes(2)
  })

  it('shows the empty state when nobody matches', async () => {
    getCatalog.mockResolvedValue(makeCatalogResponse({ items: [], total: 0 }))

    const wrapper = await mountView()

    expect(wrapper.findComponent(AtlasEmptyState).props('title')).toBe('Nenhum profissional encontrado')
  })

  it('shows the grid with the load more button and hides it while searching', async () => {
    getCatalog.mockResolvedValue(makeCatalogResponse({
      items: [makeSummary()],
      total: 3,
    }))

    const wrapper = await mountView()

    expect(wrapper.find('.load-more button').text()).toBe('Carregar mais (2 restantes)')

    useCatalogList().pending = true

    await nextTick()

    expect(wrapper.find('.load-more').exists()).toBe(false)
  })

  it('collapses the filters column on the desktop layout', async () => {
    stubViewport(true)

    const wrapper = await mountView()

    useCatalogDrawer().toggle()

    await nextTick()

    expect(wrapper.classes()).toContain('catalog-view--collapsed')
    expect(wrapper.find('.catalog-view__sidebar--collapsed').exists()).toBe(true)
  })

  it('closes the drawer on backdrop click and on cancel', async () => {
    const wrapper = await mountView()

    const drawer = useCatalogDrawer()

    drawer.toggle()

    await nextTick()

    expect(drawer.isOpen).toBe(true)

    await wrapper.find('dialog').trigger('click')

    expect(drawer.isOpen).toBe(false)

    drawer.toggle()

    await wrapper.find('dialog').trigger('cancel')

    expect(drawer.isOpen).toBe(false)
  })

  it('clears the catalog state when it leaves the screen', async () => {
    const wrapper = await mountView()

    wrapper.unmount()

    expect(useCatalogList().items).toEqual([])
  })
})
