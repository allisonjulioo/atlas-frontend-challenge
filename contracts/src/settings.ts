import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface RuntimeSettings {
  apiBase: string
  siteUrl: string
}

const EMPTY: RuntimeSettings = {
  apiBase: '',
  siteUrl: '',
}

export const useRuntimeSettings = defineStore('runtimeSettings', () => {
  const settings = ref<RuntimeSettings>({ ...EMPTY })

  const set = (value: Partial<RuntimeSettings>) => {
    settings.value = { ...settings.value, ...value }
  }

  return { settings, set }
})
