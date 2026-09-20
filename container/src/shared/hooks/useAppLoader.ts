import { defineStore } from 'pinia'
import { APP_LOADER_FADE_MS } from '@/shared/constants'

export const useAppLoader = defineStore('appLoader', () => {
  const isVisible = ref(true)
  const isFaded = ref(false)

  const hide = () => {
    if (isFaded.value) {
      return
    }

    isFaded.value = true

    setTimeout(() => {
      isVisible.value = false
    }, APP_LOADER_FADE_MS)
  }

  return { isVisible, isFaded, hide }
})
