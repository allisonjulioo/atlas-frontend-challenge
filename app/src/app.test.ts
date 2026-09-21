import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/app.vue'

describe('app', () => {
  it('mounts the shell with the active page inside', () => {
    const wrapper = mount(App, { global: { stubs: { NuxtPage: true } } })

    expect(wrapper.find('.harness__bar code').text()).toBe('catalog')
    expect(wrapper.find('.harness__main nuxt-page-stub').exists()).toBe(true)
  })
})
