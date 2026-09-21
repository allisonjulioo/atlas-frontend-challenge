import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { usePageMeta } from '@atlas/contracts'
import { setRouteParams } from '@/tests/nuxt-env'
import { makeProfessional, makeSummary } from '@/tests/factories'
import {
  getProfessionalService,
  getRelatedProfessionalsService,
} from '@/modules/catalog/services/catalogService'
import { useProfessional } from '@/modules/catalog/hooks/useProfessional'

vi.mock('@/modules/catalog/services/catalogService')

const getProfessional = vi.mocked(getProfessionalService)
const getRelated = vi.mocked(getRelatedProfessionalsService)

describe('useProfessional', () => {
  beforeEach(() => {
    getProfessional.mockResolvedValue(makeProfessional())
    getRelated.mockResolvedValue([makeSummary({ id: 'pro-2', slug: 'bia-lima' })])
    setRouteParams({ slug: 'ana-souza' })
  })

  it('loads profile, related professionals and meta', async () => {
    const professional = useProfessional()

    await professional.init()

    expect(getProfessional).toHaveBeenCalledExactlyOnceWith('ana-souza')
    expect(professional.professional?.name).toBe('Ana Souza')
    expect(professional.related.map(item => item.slug)).toEqual(['bia-lima'])
    expect(professional.pending).toBe(false)
    expect(usePageMeta().meta.title).toBe('Ana Souza, Eletricista')
  })

  it('shows the profile even without related professionals', async () => {
    getRelated.mockRejectedValue(new Error('offline'))

    const professional = useProfessional()

    await professional.load()

    expect(professional.professional?.slug).toBe('ana-souza')
    expect(professional.related).toEqual([])
  })

  it('flags a missing profile without an error message', async () => {
    getProfessional.mockRejectedValue({ statusCode: 404 })

    const professional = useProfessional()

    await professional.load()

    expect(professional.notFound).toBe(true)
    expect(professional.errorMessage).toBeNull()
    expect(usePageMeta().meta.notFound).toBe(true)
  })

  it('reports a failed profile request', async () => {
    getProfessional.mockRejectedValue(new Error('offline'))

    const professional = useProfessional()

    await professional.load()

    expect(professional.notFound).toBe(false)
    expect(professional.errorMessage).toBe('Não foi possível carregar este perfil agora.')
  })

  it('fetches nothing without a slug on the route', async () => {
    setRouteParams({})

    const professional = useProfessional()

    await professional.load()

    expect(getProfessional).not.toHaveBeenCalled()
    expect(professional.professional).toBeNull()
  })

  it('does not fetch the same profile again', async () => {
    const professional = useProfessional()

    professional.professional = makeProfessional()

    await professional.init()

    expect(getProfessional).not.toHaveBeenCalled()
    expect(usePageMeta().meta.title).toBe('Ana Souza, Eletricista')
  })

  it('reloads when the route slug changes and ignores a route without slug', async () => {
    const professional = useProfessional()

    await professional.init()

    setRouteParams({ slug: 'bia-lima' })

    await nextTick()

    await vi.waitFor(() => {
      expect(getProfessional).toHaveBeenLastCalledWith('bia-lima')
    })

    setRouteParams({})

    await nextTick()

    expect(getProfessional).toHaveBeenCalledTimes(2)
  })

  it('reset clears the profile', async () => {
    const professional = useProfessional()

    await professional.init()

    professional.reset()

    expect(professional.professional).toBeNull()
    expect(professional.related).toEqual([])
    expect(professional.notFound).toBe(false)
    expect(professional.errorMessage).toBeNull()
  })
})
