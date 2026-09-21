import { describe, expect, it } from 'vitest'
import { catalogRoutes } from '@/modules/catalog/router/routes'
import { appRoutes } from '@/router/routes'

describe('appRoutes', () => {
  it('publishes the catalog routes', () => {
    expect(appRoutes).toEqual(catalogRoutes)
  })
})
