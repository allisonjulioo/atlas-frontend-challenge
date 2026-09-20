import type { Preview } from '@storybook/vue3-vite'
import '../src/assets/styles/main.scss'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      options: {
        canvas: { name: 'Canvas', value: 'rgb(244 248 250)' },
        surface: { name: 'Surface', value: '#ffffff' },
        ink: { name: 'Ink', value: 'rgb(41 50 65)' },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      codePanel: true,
    },
  },
  initialGlobals: {
    backgrounds: { value: 'canvas' },
  },
}

export default preview
