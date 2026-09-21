import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { formatMonthYear } from '@atlas/contracts'
import { makeProfessional } from '@/tests/factories'
import { useProfessional } from '@/modules/catalog/hooks/useProfessional'
import ProfileReviews from '@/modules/catalog/components/Profile/ProfileReviews.vue'

describe('ProfileReviews', () => {
  it('lists the newest review first', () => {
    useProfessional().professional = makeProfessional()

    const items = mount(ProfileReviews).findAll('.profile-reviews__item')

    expect(items.map(item => item.find('.profile-reviews__author').text())).toEqual(['Bia', 'Carlos'])
    expect(items[0]!.find('.profile-reviews__comment').text()).toBe('Pontual.')
    expect(items[0]!.find('time').attributes('datetime')).toBe('2025-06-02')
    expect(items[0]!.find('time').text()).toBe(formatMonthYear('2025-06-02'))
  })

  it('renders nothing without a profile', () => {
    expect(mount(ProfileReviews).findAll('.profile-reviews__item')).toHaveLength(0)
  })
})
