import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url))

const keepImportMetaUrl = {
  name: 'atlas:keep-import-meta-url',
  enforce: 'pre' as const,

  transform: (code: string, id: string) => {
    if (!id.endsWith('router/routes.ts')) {
      return null
    }

    return { code: code.replaceAll('import.meta.url', 'String(import.meta.url)'), map: null }
  },
}

export default defineConfig({
  plugins: [vue(), keepImportMetaUrl],

  resolve: {
    alias: [
      { find: /^@\//, replacement: `${fromRoot('./src')}/` },
      { find: /^@atlas\/design-system$/, replacement: fromRoot('./__mocks__/@atlas/design-system.ts') },
      { find: /^motion-v$/, replacement: fromRoot('./__mocks__/motion-v.ts') },
    ],
  },

  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.test.ts'],
    restoreMocks: true,

    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/**/*.test.ts', 'src/tests/**', 'src/**/__mocks__/**'],
      reporter: ['text', 'html'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
})
