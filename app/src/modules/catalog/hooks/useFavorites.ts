import { defineStore } from 'pinia'
import { FAVORITES_STORAGE_KEY } from '@/shared/constants'

export const useFavorites = defineStore('favorites', () => {
  const ids = ref<string[]>([])

  const has = (id: string) => ids.value.includes(id)

  const persist = () => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids.value))
    }
    catch {
      ids.value = [...ids.value]
    }
  }

  const init = () => {
    try {
      const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)

      ids.value = raw ? (JSON.parse(raw) as string[]) : []
    }
    catch {
      ids.value = []
    }
  }

  const toggle = (id: string) => {
    ids.value = has(id) ? ids.value.filter(item => item !== id) : [...ids.value, id]

    persist()
  }

  return { ids, has, init, toggle }
})
