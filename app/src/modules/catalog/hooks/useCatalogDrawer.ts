import { defineStore } from 'pinia'
import type { ComponentPublicInstance } from 'vue'
import { DESKTOP_MEDIA_QUERY, DRAWER_ANIMATION_MS } from '@/modules/catalog/constants'

export const useCatalogDrawer = defineStore('catalogDrawer', () => {
  const dialog = ref<HTMLDialogElement | null>(null)
  const media = ref<MediaQueryList | null>(null)
  const isOpen = ref(false)
  const isDesktop = ref(false)
  const isSidebarOpen = ref(true)

  const setDialog = (element: Element | ComponentPublicInstance | null) => {
    const node = (element as ComponentPublicInstance | null)?.$el ?? element

    dialog.value = (node ?? null) as HTMLDialogElement | null
  }

  const close = () => {
    if (!isOpen.value) {
      dialog.value?.close()

      return
    }

    isOpen.value = false

    setTimeout(() => dialog.value?.close(), DRAWER_ANIMATION_MS)
  }

  const toggle = () => {
    if (isDesktop.value) {
      isSidebarOpen.value = !isSidebarOpen.value

      return
    }

    dialog.value?.showModal()
    isOpen.value = true
  }

  const syncViewport = (matches: boolean) => {
    isDesktop.value = matches

    if (matches) {
      close()
    }
  }

  const onViewportChange = (event: MediaQueryListEvent) => {
    syncViewport(event.matches)
  }

  const init = () => {
    if (typeof window === 'undefined') {
      return
    }

    media.value = window.matchMedia(DESKTOP_MEDIA_QUERY)
    media.value.addEventListener('change', onViewportChange)

    syncViewport(media.value.matches)
  }

  const reset = () => {
    media.value?.removeEventListener('change', onViewportChange)
    media.value = null
    dialog.value = null
    isOpen.value = false
  }

  return { isOpen, isDesktop, isSidebarOpen, setDialog, init, toggle, close, reset }
})
