import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ofetch } from 'ofetch'
import { parseCatalogQuery, useRuntimeSettings } from '@atlas/contracts'
import {
  getCatalogService,
  getProfessionalService,
  getRelatedProfessionalsService,
} from '@/modules/catalog/services/catalogService'

vi.mock('ofetch', () => ({ ofetch: vi.fn() }))

describe('catalogService', () => {
  beforeEach(() => {
    vi.mocked(ofetch).mockResolvedValue(null)
    useRuntimeSettings().set({ apiBase: 'http://api.test' })
  })

  it('serializes the query and forces page and size on the listing', async () => {
    await getCatalogService(parseCatalogQuery({ q: 'ana', categories: 'casa', page: '2' }))

    expect(ofetch).toHaveBeenCalledExactlyOnceWith('/professionals', {
      baseURL: 'http://api.test',
      query: { q: 'ana', categories: 'casa', page: 2, perPage: 24 },
    })
  })

  it('fetches the profile by slug', async () => {
    await getProfessionalService('ana-souza')

    expect(ofetch).toHaveBeenCalledExactlyOnceWith('/professionals/ana-souza', { baseURL: 'http://api.test' })
  })

  it('fetches the related professionals', async () => {
    await getRelatedProfessionalsService('ana-souza')

    expect(ofetch).toHaveBeenCalledExactlyOnceWith('/professionals/related/ana-souza', { baseURL: 'http://api.test' })
  })
})
