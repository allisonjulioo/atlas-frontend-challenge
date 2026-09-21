import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { AtlasProfessionalGrid } from '@atlas/design-system'
import { router } from '@/tests/nuxt-env'
import { makeProfessional, makeSummary } from '@/tests/factories'
import {
  getProfessionalService,
  getRelatedProfessionalsService,
} from '@/modules/catalog/services/catalogService'
import { useFavorites } from '@/modules/catalog/hooks/useFavorites'
import { useProfessional } from '@/modules/catalog/hooks/useProfessional'
import ProfileRelated from '@/modules/catalog/components/Profile/ProfileRelated.vue'

vi.mock('@/modules/catalog/services/catalogService')

describe('ProfileRelated', () => {
  beforeEach(() => {
    vi.mocked(getProfessionalService).mockResolvedValue(makeProfessional())
    vi.mocked(getRelatedProfessionalsService).mockResolvedValue([])
  })

  it('hands the related professionals to the grid', () => {
    useProfessional().related = [makeSummary({ id: 'pro-2', slug: 'bia-lima' })]

    const grid = mount(ProfileRelated).findComponent(AtlasProfessionalGrid)

    expect(grid.props('items')).toHaveLength(1)
    expect(grid.props('basePath')).toBe('/profissionais')
    expect(grid.props('favorites')).toEqual([])
  })

  it('opens and favorites a related professional', async () => {
    const grid = mount(ProfileRelated).findComponent(AtlasProfessionalGrid)

    await grid.vm.$emit('select', makeSummary({ slug: 'bia-lima' }), { preventDefault: vi.fn() })

    expect(router.push).toHaveBeenCalledExactlyOnceWith({
      name: 'professional-profile',
      params: { slug: 'bia-lima' },
    })

    await grid.vm.$emit('toggle-favorite', makeSummary({ id: 'pro-2' }))

    expect(useFavorites().ids).toEqual(['pro-2'])
  })
})
