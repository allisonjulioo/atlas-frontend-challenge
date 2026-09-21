import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ExposedCatalogView from '@/components/exposed/CatalogView.vue'
import CatalogView from '@/modules/catalog/components/CatalogView.vue'

describe('exposed CatalogView', () => {
  it('hands the module catalog to the container', () => {
    const wrapper = mount(ExposedCatalogView, { shallow: true })

    expect(wrapper.findComponent(CatalogView).exists()).toBe(true)
  })
})
