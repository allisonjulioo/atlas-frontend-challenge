import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface PageMeta {
  title: string
  description: string
  image: string | null
  canonicalPath: string | null
  structuredData: Record<string, unknown> | null
  notFound: boolean
}

const EMPTY: PageMeta = {
  title: '',
  description: '',
  image: null,
  canonicalPath: null,
  structuredData: null,
  notFound: false,
}

export const usePageMeta = defineStore('pageMeta', () => {
  const meta = ref<PageMeta>({ ...EMPTY })

  const set = (value: Partial<PageMeta>) => {
    meta.value = { ...meta.value, ...value }
  }

  const reset = () => {
    meta.value = { ...EMPTY }
  }

  return { meta, set, reset }
})
