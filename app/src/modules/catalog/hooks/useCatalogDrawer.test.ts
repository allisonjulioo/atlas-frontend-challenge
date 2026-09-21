import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCatalogDrawer } from '@/modules/catalog/hooks/useCatalogDrawer'

const makeDialog = () => ({ showModal: vi.fn(), close: vi.fn() })

const makeMedia = (matches: boolean) => ({
  matches,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
})

describe('useCatalogDrawer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('opens the dialog on mobile', () => {
    const dialog = makeDialog()
    const drawer = useCatalogDrawer()

    drawer.setDialog(dialog as unknown as Element)
    drawer.toggle()

    expect(dialog.showModal).toHaveBeenCalledOnce()
    expect(drawer.isOpen).toBe(true)
  })

  it('accepts the root element of a component', () => {
    const dialog = makeDialog()
    const drawer = useCatalogDrawer()

    drawer.setDialog({ $el: dialog } as never)
    drawer.toggle()

    expect(dialog.showModal).toHaveBeenCalledOnce()
  })

  it('survives without a mounted dialog', () => {
    const drawer = useCatalogDrawer()

    drawer.setDialog(null)
    drawer.toggle()

    expect(drawer.isOpen).toBe(true)
  })

  it('closes after the animation when it is open', () => {
    const dialog = makeDialog()
    const drawer = useCatalogDrawer()

    drawer.setDialog(dialog as unknown as Element)
    drawer.toggle()
    drawer.close()

    expect(drawer.isOpen).toBe(false)
    expect(dialog.close).not.toHaveBeenCalled()

    vi.advanceTimersByTime(260)

    expect(dialog.close).toHaveBeenCalledOnce()
  })

  it('closes right away when it was already closed', () => {
    const dialog = makeDialog()
    const drawer = useCatalogDrawer()

    drawer.setDialog(dialog as unknown as Element)
    drawer.close()

    expect(dialog.close).toHaveBeenCalledOnce()
  })

  it('on desktop the button collapses the filters column', () => {
    const media = makeMedia(true)

    vi.stubGlobal('matchMedia', vi.fn(() => media))

    const drawer = useCatalogDrawer()

    drawer.init()

    expect(matchMedia).toHaveBeenCalledExactlyOnceWith('(min-width: 1024px)')
    expect(drawer.isDesktop).toBe(true)
    expect(drawer.isSidebarOpen).toBe(true)

    drawer.toggle()

    expect(drawer.isSidebarOpen).toBe(false)
  })

  it('closes the drawer when it turns into desktop', () => {
    const media = makeMedia(false)
    const dialog = makeDialog()

    vi.stubGlobal('matchMedia', vi.fn(() => media))

    const drawer = useCatalogDrawer()

    drawer.init()
    drawer.setDialog(dialog as unknown as Element)
    drawer.toggle()

    const onChange = media.addEventListener.mock.calls[0]![1] as (event: { matches: boolean }) => void

    onChange({ matches: true })

    expect(drawer.isDesktop).toBe(true)
    expect(drawer.isOpen).toBe(false)
  })

  it('does not touch the viewport on the server', () => {
    vi.stubGlobal('matchMedia', vi.fn())
    vi.stubGlobal('window', undefined)

    const drawer = useCatalogDrawer()

    drawer.init()

    expect(matchMedia).not.toHaveBeenCalled()
    expect(drawer.isDesktop).toBe(false)
  })

  it('reset unsubscribes the media query and forgets the dialog', () => {
    const media = makeMedia(false)

    vi.stubGlobal('matchMedia', vi.fn(() => media))

    const drawer = useCatalogDrawer()

    drawer.init()
    drawer.setDialog(makeDialog() as unknown as Element)
    drawer.toggle()
    drawer.reset()

    expect(media.removeEventListener).toHaveBeenCalledOnce()
    expect(drawer.isOpen).toBe(false)
  })
})
