import { defineStore } from 'pinia'
import { FAVORITES_STORAGE_KEY } from '@/shared/constants'

export const useFavorites = defineStore('favorites', () => {
  const ids = ref<string[]>([])

  const has = (id: string) => ids.value.includes(id)

  const persist = () => Promise.resolve()
    .then(() => localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids.value)))
    .catch(() => undefined)

  const init = () => Promise.resolve()
    .then(() => localStorage.getItem(FAVORITES_STORAGE_KEY))
    .then(raw => (raw ? (JSON.parse(raw) as string[]) : []))
    .catch(() => [])
    .then((stored) => {
      ids.value = stored
    })

  const toggle = (id: string) => {
    ids.value = has(id) ? ids.value.filter(item => item !== id) : [...ids.value, id]

    persist()
  }

  return { ids, has, init, toggle }
})
