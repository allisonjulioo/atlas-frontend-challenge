import { describe, expect, it } from 'vitest'
import { catalogRoutes } from '@/modules/catalog/router/routes'

describe('catalogRoutes', () => {
  it('maps listing and profile to their page files', () => {
    expect(catalogRoutes.map(route => [route.name, route.path])).toEqual([
      ['catalog-list', '/'],
      ['professional-profile', '/profissionais/:slug()'],
    ])

    expect(catalogRoutes[0]!.file).toMatch(/pages\/CatalogListPage\.vue$/)
    expect(catalogRoutes[1]!.file).toMatch(/pages\/ProfessionalProfilePage\.vue$/)
  })
})
