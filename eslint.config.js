import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: false,
      commaDangle: 'always-multiline',
    },
  },
})
  .append({
    ignores: [
      '**/.nuxt/**',
      '**/.output/**',
      '**/dist/**',
      '**/node_modules/**',
      'api/**',
    ],
  })
  .append({
    files: ['**/*.{ts,vue}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        { selector: 'ForStatement', message: 'Use map, filter, reduce ou forEach.' },
        { selector: 'ForInStatement', message: 'Use Object.keys/entries com map ou forEach.' },
        { selector: 'ForOfStatement', message: 'Use map, filter, reduce ou forEach.' },
      ],
      'no-warning-comments': ['error', { terms: ['todo', 'fixme', 'hack'], location: 'anywhere' }],
      'max-depth': ['error', 4],
      'max-nested-callbacks': ['error', 4],
      'max-params': ['warn', 5],
      'max-lines-per-function': ['warn', { max: 100, skipBlankLines: true, skipComments: true }],
      'complexity': ['warn', 15],
      'curly': ['error', 'all'],
    },
  })
  .append({
    files: ['**/*.vue'],
    rules: {
      'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/define-macros-order': ['error', { order: ['defineProps', 'defineEmits'] }],
      'vue/multi-word-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': ['error', { singleline: 4, multiline: 1 }],
    },
  })
