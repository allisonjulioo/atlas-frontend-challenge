import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { makeProfessional } from '@/tests/factories'
import { useProfessional } from '@/modules/catalog/hooks/useProfessional'
import ProfileGallery from '@/modules/catalog/components/Profile/ProfileGallery.vue'

describe('ProfileGallery', () => {
  it('loads the first image eagerly and defers the rest', () => {
    useProfessional().professional = makeProfessional()

    const images = mount(ProfileGallery).findAll('img')

    expect(images).toHaveLength(2)
    expect(images[0]!.attributes()).toMatchObject({
      src: 'https://cdn.test/1.jpg',
      alt: 'Quadro novo',
      width: '800',
      height: '600',
      loading: 'eager',
    })
    expect(images[1]!.attributes('loading')).toBe('lazy')
  })

  it('renders nothing without a profile', () => {
    expect(mount(ProfileGallery).findAll('img')).toHaveLength(0)
  })
})
