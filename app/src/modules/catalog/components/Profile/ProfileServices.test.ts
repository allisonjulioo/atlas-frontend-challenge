import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { formatPrice } from '@atlas/contracts'
import { makeProfessional } from '@/tests/factories'
import { useProfessional } from '@/modules/catalog/hooks/useProfessional'
import ProfileServices from '@/modules/catalog/components/Profile/ProfileServices.vue'

describe('ProfileServices', () => {
  it('shows the price with its unit and falls back to a quote', () => {
    useProfessional().professional = makeProfessional()

    const items = mount(ProfileServices).findAll('.profile-services__item')

    expect(items).toHaveLength(2)
    expect(items[0]!.find('.profile-services__price').text()).toBe(`${formatPrice(90)}/serviço`)
    expect(items[1]!.find('.profile-services__quote').text()).toBe('Sob orçamento')
  })

  it('renders nothing without a profile', () => {
    expect(mount(ProfileServices).findAll('.profile-services__item')).toHaveLength(0)
  })
})
