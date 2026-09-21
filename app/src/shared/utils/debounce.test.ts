import { beforeEach, describe, expect, it, vi } from 'vitest'
import { debounce } from './debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('calls the callback only after the interval', () => {
    const spy = vi.fn()
    const run = debounce(spy, 300)

    run('a')
    run('b')

    expect(spy).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)

    expect(spy).toHaveBeenCalledExactlyOnceWith('b')
  })

  it('cancel drops the pending call', () => {
    const spy = vi.fn()
    const run = debounce(spy, 300)

    run('a')
    run.cancel()

    vi.advanceTimersByTime(300)

    expect(spy).not.toHaveBeenCalled()
  })

  it('flush fires right away and clears the timer', () => {
    const spy = vi.fn()
    const run = debounce(spy, 300)

    run('a')
    run.flush('b')

    expect(spy).toHaveBeenCalledExactlyOnceWith('b')

    vi.advanceTimersByTime(300)

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
