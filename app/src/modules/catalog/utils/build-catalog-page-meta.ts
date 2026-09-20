import { buildCatalogDescription, buildCatalogTitle, type CatalogQuery, type PageMeta } from '@atlas/contracts'

export const buildCatalogPageMeta = (query: CatalogQuery, total: number): PageMeta => ({
  title: buildCatalogTitle(query),
  description: buildCatalogDescription(query, total),
  image: null,
  canonicalPath: '/',
  structuredData: null,
  notFound: false,
})
