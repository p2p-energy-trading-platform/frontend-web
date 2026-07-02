import { describe, expect, it } from 'vitest'

import { cn } from './utils'

function getOptionalClass(enabled: boolean) {
  return enabled ? 'hidden' : undefined
}

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('flex', 'items-center', 'gap-2')).toBe('flex items-center gap-2')
  })

  it('removes falsy class names', () => {
    expect(cn('flex', getOptionalClass(false), undefined, null)).toBe('flex')
  })

  it('merges conflicting Tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})
