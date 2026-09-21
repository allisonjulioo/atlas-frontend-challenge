import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CatalogListPage from '@/modules/catalog/pages/CatalogListPage.vue'
import ExposedCatalogView from '@/components/exposed/CatalogView.vue'

describe('CatalogListPage', () => {
  it('renders the exposed catalog', () => {
    const wrapper = mount(CatalogListPage, { shallow: true })

    expect(wrapper.findComponent(ExposedCatalogView).exists()).toBe(true)
  })
})
