import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ExposedProfessionalProfile from '@/components/exposed/ProfessionalProfile.vue'
import ProfessionalProfile from '@/modules/catalog/components/ProfessionalProfile.vue'

describe('exposed ProfessionalProfile', () => {
  it('hands the module profile to the container', () => {
    const wrapper = mount(ExposedProfessionalProfile, { shallow: true })

    expect(wrapper.findComponent(ProfessionalProfile).exists()).toBe(true)
  })
})
