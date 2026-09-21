import { describe, expect, it } from 'vitest'
import { makeProfessional, makeSummary } from '@/tests/factories'
import { useFavorites } from '@/modules/catalog/hooks/useFavorites'
import { useProfessional } from '@/modules/catalog/hooks/useProfessional'
import { useProfessionalDetails } from '@/modules/catalog/hooks/useProfessionalDetails'

describe('useProfessionalDetails', () => {
  it('keeps everything empty until the profile arrives', () => {
    const details = useProfessionalDetails()

    expect(details.categoryLabel).toBe('')
    expect(details.services).toEqual([])
    expect(details.gallery).toEqual([])
    expect(details.reviews).toEqual([])
    expect(details.badges).toEqual([])
    expect(details.facts).toEqual([])
    expect(details.hasRelated).toBe(false)
    expect(details.isFavorite).toBe(false)
    expect(details.favoriteLabel).toBe('Salvar')

    details.toggleFavorite()

    expect(useFavorites().ids).toEqual([])
  })

  it('translates the profile for the screen', () => {
    const professional = useProfessional()

    professional.professional = makeProfessional()
    professional.related = [makeSummary({ id: 'pro-2', slug: 'bia-lima' })]

    const details = useProfessionalDetails()

    expect(details.categoryLabel).toBe('Casa e reformas')
    expect(details.services).toHaveLength(2)
    expect(details.gallery).toHaveLength(2)
    expect(details.reviews.map(review => review.id)).toEqual(['rev-2', 'rev-1'])
    expect(details.badges.map(badge => badge.key)).toEqual(['verified', 'availability', 'response'])
    expect(details.facts.map(fact => fact.key)).toEqual(['area', 'experience', 'jobs', 'since'])
    expect(details.hasRelated).toBe(true)
  })

  it('saves and removes from the favorites', () => {
    useProfessional().professional = makeProfessional()

    const details = useProfessionalDetails()

    details.toggleFavorite()

    expect(details.isFavorite).toBe(true)
    expect(details.favoriteLabel).toBe('Salvo nos favoritos')

    details.toggleFavorite()

    expect(details.isFavorite).toBe(false)
  })
})
