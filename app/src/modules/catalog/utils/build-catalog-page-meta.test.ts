import { describe, expect, it } from 'vitest'
import { parseCatalogQuery } from '@atlas/contracts'
import { buildCatalogPageMeta } from '@/modules/catalog/utils/build-catalog-page-meta'

describe('buildCatalogPageMeta', () => {
  it('builds the listing meta from the search and the total', () => {
    const meta = buildCatalogPageMeta(parseCatalogQuery({ q: 'ana' }), 12)

    expect(meta).toEqual({
      title: 'ana: profissionais disponíveis',
      description: '12 profissionais para "ana" com avaliação, valor por hora e disponibilidade. Compare e contrate direto.',
      image: null,
      canonicalPath: '/',
      structuredData: null,
      notFound: false,
    })
  })
})
