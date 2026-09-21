import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FAVORITES_STORAGE_KEY } from '@/shared/constants'
import { useFavorites } from '@/modules/catalog/hooks/useFavorites'

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads what is stored', async () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(['pro-1']))

    const favorites = useFavorites()

    await favorites.init()

    expect(favorites.ids).toEqual(['pro-1'])
    expect(favorites.has('pro-1')).toBe(true)
  })

  it('starts empty when nothing is stored', async () => {
    const favorites = useFavorites()

    await favorites.init()

    expect(favorites.ids).toEqual([])
  })

  it('ignores corrupted content', async () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, '{')

    const favorites = useFavorites()

    await favorites.init()

    expect(favorites.ids).toEqual([])
  })

  it('adds and removes keeping the list stored', async () => {
    const favorites = useFavorites()

    favorites.toggle('pro-1')

    expect(favorites.ids).toEqual(['pro-1'])

    await vi.waitFor(() => {
      expect(localStorage.getItem(FAVORITES_STORAGE_KEY)).toBe('["pro-1"]')
    })

    favorites.toggle('pro-1')

    expect(favorites.ids).toEqual([])

    await vi.waitFor(() => {
      expect(localStorage.getItem(FAVORITES_STORAGE_KEY)).toBe('[]')
    })
  })

  it('keeps working when storage refuses the write', async () => {
    const setItem = vi.fn(() => {
      throw new Error('quota')
    })

    vi.stubGlobal('localStorage', { getItem: () => null, setItem })

    const favorites = useFavorites()

    favorites.toggle('pro-1')

    await vi.waitFor(() => {
      expect(setItem).toHaveBeenCalled()
    })

    expect(favorites.ids).toEqual(['pro-1'])
  })
})
