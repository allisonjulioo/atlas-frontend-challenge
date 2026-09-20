import { defineStore } from 'pinia'
import type { ComponentPublicInstance } from 'vue'

export const useCatalogDrawer = defineStore('catalogDrawer', () => {
  const dialog = ref<HTMLDialogElement | null>(null)
  const isOpen = ref(false)

  const setDialog = (element: Element | ComponentPublicInstance | null) => {
    dialog.value = element as HTMLDialogElement | null
  }

  const open = () => {
    dialog.value?.showModal()
    isOpen.value = true
  }

  const close = () => {
    dialog.value?.close()
    isOpen.value = false
  }

  const reset = () => {
    dialog.value = null
    isOpen.value = false
  }

  return { isOpen, setDialog, open, close, reset }
})
