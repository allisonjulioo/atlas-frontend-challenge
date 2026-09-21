import { describe, expect, it } from 'vitest'
import { makeProfessional } from '@/tests/factories'
import { buildProfessionalBadges } from '@/modules/catalog/utils/build-professional-badges'

describe('buildProfessionalBadges', () => {
  it('returns an empty list without a professional', () => {
    expect(buildProfessionalBadges(null)).toEqual([])
  })

  it('puts the verified badge first and highlights immediate availability', () => {
    expect(buildProfessionalBadges(makeProfessional())).toEqual([
      { key: 'verified', tone: 'brand', label: 'Perfil verificado' },
      { key: 'availability', tone: 'accent', label: 'Disponível agora' },
      { key: 'response', tone: 'neutral', label: 'Responde em ~30 min' },
    ])
  })

  it('uses a neutral tone and no badge for a scheduled unverified profile', () => {
    const badges = buildProfessionalBadges(makeProfessional({ verified: false, availability: 'agendada' }))

    expect(badges).toEqual([
      { key: 'availability', tone: 'neutral', label: 'Sob agendamento' },
      { key: 'response', tone: 'neutral', label: 'Responde em ~30 min' },
    ])
  })
})
