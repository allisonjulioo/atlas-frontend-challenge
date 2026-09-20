import {
  serializeCatalogQuery,
  useRuntimeSettings,
  type CatalogQuery,
  type CatalogResponse,
  type Professional,
  type ProfessionalSummary,
} from '@atlas/contracts'
import { ofetch } from 'ofetch'
import { storeToRefs } from 'pinia'

const baseURL = () => storeToRefs(useRuntimeSettings()).settings.value.apiBase

export const getCatalogService = (query: CatalogQuery) => ofetch<CatalogResponse>('/professionals', {
  baseURL: baseURL(),
  query: {
    ...serializeCatalogQuery(query),
    page: query.page,
    perPage: query.perPage,
  },
})

export const getProfessionalService = (slug: string) => ofetch<Professional>(`/professionals/${slug}`, {
  baseURL: baseURL(),
})

export const getRelatedProfessionalsService = (slug: string) => ofetch<ProfessionalSummary[]>(
  `/professionals/related/${slug}`,
  { baseURL: baseURL() },
)
