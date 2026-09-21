import { describe, expect, it, vi } from 'vitest'
import { scrollToTop } from './scroll-to-top'

describe('scrollToTop', () => {
  it('scrolls the window up when window exists', () => {
    const spy = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)

    scrollToTop()

    expect(spy).toHaveBeenCalledExactlyOnceWith({ top: 0, behavior: 'auto' })
  })

  it('does nothing on the server', () => {
    const spy = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)

    vi.stubGlobal('window', undefined)

    scrollToTop()

    expect(spy).not.toHaveBeenCalled()
  })
})
