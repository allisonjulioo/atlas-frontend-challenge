import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ProfessionalProfilePage from '@/modules/catalog/pages/ProfessionalProfilePage.vue'
import ExposedProfessionalProfile from '@/components/exposed/ProfessionalProfile.vue'

describe('ProfessionalProfilePage', () => {
  it('renders the exposed profile', () => {
    const wrapper = mount(ProfessionalProfilePage, { shallow: true })

    expect(wrapper.findComponent(ExposedProfessionalProfile).exists()).toBe(true)
  })
})
