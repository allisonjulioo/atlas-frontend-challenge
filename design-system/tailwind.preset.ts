import type { Config } from 'tailwindcss'

const channel = (name: string) => `rgb(var(--atlas-${name}) / <alpha-value>)`

export const atlasPreset = {
  content: [],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: channel('brand'),
          soft: channel('brand-soft'),
        },
        accent: channel('accent'),
        ink: channel('ink'),
        canvas: channel('canvas'),
        surface: {
          DEFAULT: channel('surface'),
          soft: channel('surface-soft'),
        },
        line: channel('line'),
        content: {
          'DEFAULT': channel('content'),
          'muted': channel('content-muted'),
          'subtle': channel('content-subtle'),
          'on-brand': channel('content-on-brand'),
          'on-accent': channel('content-on-accent'),
        },
        rating: channel('accent'),
        focus: channel('brand'),
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        card: '8px',
        control: '4px',
      },
      boxShadow: {
        'card': 'var(--atlas-shadow-sm)',
        'card-hover': 'var(--atlas-shadow-md)',
        'overlay': 'var(--atlas-shadow-lg)',
      },
      maxWidth: {
        shell: '1280px',
      },
      spacing: {
        control: '44px',
      },
      transitionTimingFunction: {
        atlas: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        fast: '120ms',
        base: '200ms',
      },
    },
  },
} satisfies Config

export default atlasPreset
