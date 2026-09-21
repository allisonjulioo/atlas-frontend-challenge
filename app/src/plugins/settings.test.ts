import { describe, expect, it } from 'vitest'
import { useRuntimeSettings } from '@atlas/contracts'
import { runtimeConfig } from '@/tests/nuxt-env'
import settingsPlugin from '@/plugins/settings'

describe('settings plugin', () => {
  it('takes the runtime apiBase to the shared contract', () => {
    runtimeConfig.public.apiBase = 'http://api.test'

    ;(settingsPlugin as unknown as () => void)()

    expect(useRuntimeSettings().settings.apiBase).toBe('http://api.test')
  })
})
