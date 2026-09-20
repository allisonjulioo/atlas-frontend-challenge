import { describe, expect, it } from 'vitest'
import { catalogCacheKey, countActiveFilters, parseCatalogQuery, serializeCatalogQuery } from './query'

describe('parseCatalogQuery', () => {
  it('cai no estado padrão sem query string', () => {
    expect(parseCatalogQuery()).toMatchObject({ q: '', sort: 'relevancia', page: 1, categories: [] })
  })

  it('descarta valores fora do contrato em vez de lançar', () => {
    const query = parseCatalogQuery({ categories: 'casa,inexistente', sort: 'hype', page: '-3' })

    expect(query.categories).toEqual(['casa'])
    expect(query.sort).toBe('relevancia')
    expect(query.page).toBe(1)
  })

  it('normaliza faixa de preço invertida', () => {
    const query = parseCatalogQuery({ minPrice: '300', maxPrice: '80' })

    expect([query.minPrice, query.maxPrice]).toEqual([80, 300])
  })

  it('limita perPage ao teto do contrato', () => {
    expect(parseCatalogQuery({ perPage: '5000' }).perPage).toBe(48)
  })
})

describe('serializeCatalogQuery', () => {
  it('omite o que é igual ao padrão', () => {
    expect(serializeCatalogQuery(parseCatalogQuery())).toEqual({})
  })

  it('faz ida e volta sem perder informação', () => {
    const original = parseCatalogQuery({ q: 'pintor', categories: 'casa', minRating: '4', page: '3' })

    expect(parseCatalogQuery(serializeCatalogQuery(original))).toEqual(original)
  })
})

describe('catalogCacheKey', () => {
  it('ignora a ordem dos filtros', () => {
    const first = parseCatalogQuery({ categories: 'casa,beleza' })
    const second = parseCatalogQuery({ categories: 'beleza,casa' })

    expect(catalogCacheKey(first)).toBe(catalogCacheKey(second))
  })
})

describe('countActiveFilters', () => {
  it('não conta busca, ordenação e paginação', () => {
    expect(countActiveFilters(parseCatalogQuery({ q: 'x', sort: 'avaliacao', page: '4' }))).toBe(0)
  })

  it('conta faixa de preço como um filtro só', () => {
    expect(countActiveFilters(parseCatalogQuery({ minPrice: '50', maxPrice: '200' }))).toBe(1)
  })
})
