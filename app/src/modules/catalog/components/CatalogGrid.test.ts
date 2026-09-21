import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { AtlasProfessionalGrid } from '@atlas/design-system'
import { router } from '@/tests/nuxt-env'
import { makeCatalogResponse, makeSummary } from '@/tests/factories'
import { getCatalogService } from '@/modules/catalog/services/catalogService'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'
import { useFavorites } from '@/modules/catalog/hooks/useFavorites'
import CatalogGrid from '@/modules/catalog/components/CatalogGrid.vue'

vi.mock('@/modules/catalog/services/catalogService')

const getCatalog = vi.mocked(getCatalogService)

describe('CatalogGrid', () => {
  beforeEach(() => {
    getCatalog.mockResolvedValue(makeCatalogResponse())
  })

  it('passes the list, the favorites and the rendering limits', () => {
    const list = useCatalogList()

    list.response = makeCatalogResponse()
    list.pending = true

    const grid = mount(CatalogGrid).findComponent(AtlasProfessionalGrid)

    expect(grid.props('items')).toHaveLength(1)
    expect(grid.props('favorites')).toEqual([])
    expect(grid.props('basePath')).toBe('/profissionais')
    expect(grid.props('pending')).toBe(true)
    expect(grid.props('priorityCount')).toBe(4)
    expect(grid.props('skeletonCount')).toBe(12)
  })

  it('opens the selected profile', async () => {
    const grid = mount(CatalogGrid).findComponent(AtlasProfessionalGrid)

    await grid.vm.$emit('select', makeSummary(), { preventDefault: vi.fn() })

    expect(router.push).toHaveBeenCalledExactlyOnceWith({
      name: 'professional-profile',
      params: { slug: 'ana-souza' },
    })
  })

  it('favorites from the card', async () => {
    const grid = mount(CatalogGrid).findComponent(AtlasProfessionalGrid)

    await grid.vm.$emit('toggle-favorite', makeSummary())

    expect(useFavorites().ids).toEqual(['pro-1'])
  })
})
