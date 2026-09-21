import { describe, expect, it } from 'vitest'
import { formatDistance, formatMonthYear } from '@atlas/contracts'
import { makeProfessional } from '@/tests/factories'
import { buildProfessionalFacts } from '@/modules/catalog/utils/build-professional-facts'

describe('buildProfessionalFacts', () => {
  it('returns an empty list without a professional', () => {
    expect(buildProfessionalFacts(null)).toEqual([])
  })

  it('sums up area, experience, jobs and join date', () => {
    expect(buildProfessionalFacts(makeProfessional())).toEqual([
      { key: 'area', label: 'Atende em', value: `São Paulo, ${formatDistance(3.4)}` },
      { key: 'experience', label: 'Experiência', value: '8 anos' },
      { key: 'jobs', label: 'Serviços concluídos', value: '210' },
      { key: 'since', label: 'Na Atlas desde', value: formatMonthYear('2019-03-01') },
    ])
  })
})
