import { describe, expect, it } from 'vitest'
import { isNotFoundError } from './is-not-found-error'

describe('isNotFoundError', () => {
  it('ignores values that are not objects', () => {
    expect(isNotFoundError('404')).toBe(false)
    expect(isNotFoundError(null)).toBe(false)
  })

  it('recognizes 404 in statusCode, status and response', () => {
    expect(isNotFoundError({ statusCode: 404 })).toBe(true)
    expect(isNotFoundError({ status: 404 })).toBe(true)
    expect(isNotFoundError({ response: { status: 404 } })).toBe(true)
  })

  it('refuses other errors', () => {
    expect(isNotFoundError({ statusCode: 500, response: { status: 500 } })).toBe(false)
    expect(isNotFoundError({})).toBe(false)
  })
})
