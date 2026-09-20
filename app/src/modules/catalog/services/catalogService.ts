import {
  serializeCatalogQuery,
  useRuntimeSettings,
  type CatalogQuery,
  type CatalogResponse,
  type Professional,
  type ProfessionalSummary,
} from '@atlas/contracts'
import { storeToRefs } from 'pinia'

const baseURL = () => storeToRefs(useRuntimeSettings()).settings.value.apiBase

export const getCatalogService = (query: CatalogQuery) => $fetch<CatalogResponse>('/professionals', {
  baseURL: baseURL(),
  query: {
    ...serializeCatalogQuery(query),
    page: query.page,
    perPage: query.perPage,
  },
})

export const getProfessionalService = (slug: string) => $fetch<Professional>(`/professionals/${slug}`, {
  baseURL: baseURL(),
})

export const getRelatedProfessionalsService = (slug: string) => $fetch<ProfessionalSummary[]>(
  `/professionals/related/${slug}`,
  { baseURL: baseURL() },
)
