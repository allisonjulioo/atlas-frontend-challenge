import { describe, expect, it, vi } from 'vitest'
import { router } from '@/tests/nuxt-env'
import { makeSummary } from '@/tests/factories'
import { useCatalogNavigation } from '@/modules/catalog/hooks/useCatalogNavigation'

describe('useCatalogNavigation', () => {
  it('builds the profile href', () => {
    const navigation = useCatalogNavigation()

    expect(navigation.basePath).toBe('/profissionais')
    expect(navigation.hrefFor('ana-souza')).toBe('/profissionais/ana-souza')
  })

  it('navigates through the router instead of reloading the page', () => {
    const event = { preventDefault: vi.fn() } as unknown as MouseEvent

    useCatalogNavigation().openProfile(makeSummary(), event)

    expect(event.preventDefault).toHaveBeenCalledOnce()
    expect(router.push).toHaveBeenCalledExactlyOnceWith({
      name: 'professional-profile',
      params: { slug: 'ana-souza' },
    })
  })
})
