import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { AtlasEmptyState } from '@atlas/design-system'
import { setRouteParams } from '@/tests/nuxt-env'
import { makeProfessional, makeSummary } from '@/tests/factories'
import {
  getProfessionalService,
  getRelatedProfessionalsService,
} from '@/modules/catalog/services/catalogService'
import { useProfessional } from '@/modules/catalog/hooks/useProfessional'
import ProfessionalProfile from '@/modules/catalog/components/ProfessionalProfile.vue'

vi.mock('@/modules/catalog/services/catalogService')

const getProfessional = vi.mocked(getProfessionalService)
const getRelated = vi.mocked(getRelatedProfessionalsService)

const mountProfile = async () => {
  const wrapper = mount(ProfessionalProfile)

  await flushPromises()

  return wrapper
}

describe('ProfessionalProfile', () => {
  beforeEach(() => {
    getProfessional.mockResolvedValue(makeProfessional())
    getRelated.mockResolvedValue([makeSummary({ id: 'pro-2', slug: 'bia-lima' })])
    setRouteParams({ slug: 'ana-souza' })
  })

  it('loads the profile on mount and shows who the professional is', async () => {
    const wrapper = await mountProfile()

    expect(wrapper.find('.professional-profile__name').text()).toBe('Ana Souza')
    expect(wrapper.find('.professional-profile__category').text()).toBe('Casa e reformas')
    expect(wrapper.find('.professional-profile__profession').text()).toBe('Eletricista')
    expect(wrapper.findAll('.professional-profile__badges li')).toHaveLength(3)
    expect(wrapper.findAll('.professional-profile__facts > div')).toHaveLength(4)
    expect(wrapper.findAll('.professional-profile__section-title').map(title => title.text())).toEqual([
      'Sobre',
      'Serviços e valores',
      'Trabalhos recentes',
      'Avaliações 42',
      'Profissionais parecidos',
    ])
  })

  it('leaves out the sections the profile does not fill', async () => {
    getProfessional.mockResolvedValue(makeProfessional({ gallery: [], reviews: [] }))
    getRelated.mockResolvedValue([])

    const wrapper = await mountProfile()

    expect(wrapper.findAll('.professional-profile__section-title').map(title => title.text())).toEqual([
      'Sobre',
      'Serviços e valores',
    ])
  })

  it('offers a retry when the profile fails to load', async () => {
    getProfessional.mockRejectedValue(new Error('offline'))

    const wrapper = await mountProfile()

    expect(wrapper.find('.professional-profile__error').text()).toContain('Não foi possível carregar este perfil agora.')

    await wrapper.find('.professional-profile__error button').trigger('click')

    expect(getProfessional).toHaveBeenCalledTimes(2)
  })

  it('explains a profile that is not in the catalog', async () => {
    getProfessional.mockRejectedValue({ statusCode: 404 })

    const wrapper = await mountProfile()

    expect(wrapper.findComponent(AtlasEmptyState).props('title')).toBe('Profissional não encontrado')
  })

  it('saves the profile to the favorites', async () => {
    const wrapper = await mountProfile()

    const favorite = wrapper.findAll('.professional-profile__actions button')[1]!

    expect(favorite.text()).toBe('Salvar')

    await favorite.trigger('click')

    expect(favorite.text()).toBe('Salvo nos favoritos')
  })

  it('clears the profile state when it leaves the screen', async () => {
    const wrapper = await mountProfile()

    wrapper.unmount()

    expect(useProfessional().professional).toBeNull()
  })
})
