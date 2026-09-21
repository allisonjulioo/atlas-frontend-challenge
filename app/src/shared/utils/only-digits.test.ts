import { describe, expect, it } from 'vitest'
import { onlyDigits } from './only-digits'

describe('onlyDigits', () => {
  it('removes everything that is not a digit', () => {
    expect(onlyDigits('R$ 1.250,00')).toBe('125000')
  })

  it('drops leading zeros and keeps a lone zero', () => {
    expect(onlyDigits('0075')).toBe('75')
    expect(onlyDigits('0')).toBe('0')
  })

  it('returns empty when there is no digit', () => {
    expect(onlyDigits('abc')).toBe('')
  })
})
