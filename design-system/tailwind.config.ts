import type { Config } from 'tailwindcss'
import { atlasPreset } from '@atlas/design-system/tailwind-preset'

export default {
  presets: [atlasPreset],
  content: [
    './src/**/*.{vue,ts}',
    './nuxt.config.ts',
  ],
} satisfies Config
