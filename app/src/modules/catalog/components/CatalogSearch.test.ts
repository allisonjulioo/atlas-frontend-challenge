import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { AtlasSearchField } from '@atlas/design-system'
import { router, setRouteQuery } from '@/tests/nuxt-env'
import { useCatalogSearch } from '@/modules/catalog/hooks/useCatalogSearch'
import CatalogSearch from '@/modules/catalog/components/CatalogSearch.vue'

describe('CatalogSearch', () => {
  it('shows the route term in the field', () => {
    setRouteQuery({ q: 'ana' })

    const field = mount(CatalogSearch).findComponent(AtlasSearchField)

    expect(field.props('modelValue')).toBe('ana')
  })

  it('takes what was typed to the search state', async () => {
    const field = mount(CatalogSearch).findComponent(AtlasSearchField)

    await field.vm.$emit('update:modelValue', 'bia')

    expect(useCatalogSearch().term).toBe('bia')
  })

  it('submitting the field searches right away', async () => {
    setRouteQuery({ q: 'ana' })

    const field = mount(CatalogSearch).findComponent(AtlasSearchField)

    await field.vm.$emit('submit')

    expect(router.push).toHaveBeenCalledExactlyOnceWith({ query: { q: 'ana' } })
  })
})
