import { describe, expect, it } from 'vitest'
import { makeCatalogResponse, makeSummary } from '@/tests/factories'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'
import { useCatalogSummary } from '@/modules/catalog/hooks/useCatalogSummary'

describe('useCatalogSummary', () => {
  it('announces the search while it is pending', () => {
    const list = useCatalogList()

    list.pending = true

    const summary = useCatalogSummary()

    expect(summary.totalLabel).toBe('Buscando profissionais…')
    expect(summary.isEmpty).toBe(false)
  })

  it('uses the singular with a single result', () => {
    useCatalogList().response = makeCatalogResponse()

    expect(useCatalogSummary().totalLabel).toBe('1 profissional encontrado')
  })

  it('formats the total and the drawer label in pt-BR', () => {
    useCatalogList().response = makeCatalogResponse({ total: 1200 })

    const summary = useCatalogSummary()

    expect(summary.totalLabel).toBe(`${(1200).toLocaleString('pt-BR')} profissionais encontrados`)
    expect(summary.drawerActionLabel).toBe(`Ver ${(1200).toLocaleString('pt-BR')} resultados`)
  })

  it('counts what is left to load', () => {
    useCatalogList().response = makeCatalogResponse({ items: [makeSummary()], total: 3 })

    const summary = useCatalogSummary()

    expect(summary.hasMore).toBe(true)
    expect(summary.remaining).toBe(2)
  })

  it('never goes negative and has nothing left when everything arrived', () => {
    useCatalogList().response = makeCatalogResponse({ items: [makeSummary(), makeSummary()], total: 1 })

    const summary = useCatalogSummary()

    expect(summary.hasMore).toBe(false)
    expect(summary.remaining).toBe(0)
  })

  it('flags empty when the search ends with no result', () => {
    useCatalogList().response = makeCatalogResponse({ items: [], total: 0 })

    expect(useCatalogSummary().isEmpty).toBe(true)
  })
})
