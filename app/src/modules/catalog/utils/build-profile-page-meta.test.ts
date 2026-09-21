import { describe, expect, it } from 'vitest'
import { makeProfessional } from '@/tests/factories'
import { buildProfilePageMeta } from '@/modules/catalog/utils/build-profile-page-meta'

describe('buildProfilePageMeta', () => {
  it('flags notFound without a professional', () => {
    expect(buildProfilePageMeta(null)).toEqual({
      title: 'Profissional não encontrado',
      description: '',
      image: null,
      canonicalPath: null,
      structuredData: null,
      notFound: true,
    })
  })

  it('builds title, canonical and structured data of the profile', () => {
    const meta = buildProfilePageMeta(makeProfessional())

    expect(meta.title).toBe('Ana Souza, Eletricista')
    expect(meta.canonicalPath).toBe('/profissionais/ana-souza')
    expect(meta.image).toBe('https://cdn.test/ana.jpg')
    expect(meta.notFound).toBe(false)
    expect(meta.structuredData).toMatchObject({ '@type': 'ProfessionalService', 'url': '/profissionais/ana-souza' })
  })
})
