import type { CatalogQuery } from '@atlas/contracts'

export interface FilterChip {
  key: string
  label: string
  patch: Partial<CatalogQuery>
}
