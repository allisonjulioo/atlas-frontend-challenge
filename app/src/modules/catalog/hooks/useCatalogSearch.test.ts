import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { router, setRouteQuery } from '@/tests/nuxt-env'
import { useCatalogSearch } from '@/modules/catalog/hooks/useCatalogSearch'

describe('useCatalogSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('starts with the term from the route', () => {
    setRouteQuery({ q: 'ana' })

    const search = useCatalogSearch()

    expect(search.term).toBe('ana')
    expect(search.maxLength).toBe(80)
  })

  it('pushes what was typed only after the pause', async () => {
    const search = useCatalogSearch()

    search.term = 'ana'

    await nextTick()

    expect(router.replace).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)

    expect(router.replace).toHaveBeenCalledExactlyOnceWith({ query: { q: 'ana' } })
  })

  it('ignores typing that goes back to the route term', async () => {
    setRouteQuery({ q: 'ana' })

    const search = useCatalogSearch()

    search.term = 'bia'

    await nextTick()

    search.term = 'ana'

    await nextTick()

    vi.advanceTimersByTime(300)

    expect(router.replace).toHaveBeenCalledExactlyOnceWith({ query: { q: 'bia' } })
  })

  it('submitting cancels the pause and goes straight', async () => {
    const search = useCatalogSearch()

    search.term = 'ana'

    await nextTick()

    search.submit()

    expect(router.push).toHaveBeenCalledExactlyOnceWith({ query: { q: 'ana' } })

    vi.advanceTimersByTime(300)

    expect(router.replace).not.toHaveBeenCalled()
  })

  it('reset goes back to the route term and drops the pending push', async () => {
    setRouteQuery({ q: 'ana' })

    const search = useCatalogSearch()

    search.term = 'bia'

    await nextTick()

    search.reset()

    expect(search.term).toBe('ana')

    vi.advanceTimersByTime(300)

    expect(router.replace).not.toHaveBeenCalled()
  })

  it('follows a search changed elsewhere', async () => {
    const search = useCatalogSearch()

    setRouteQuery({ q: 'nova' })

    await nextTick()

    expect(search.term).toBe('nova')
  })
})
