export const BREAKPOINTS = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

export const DURATION = {
  fast: 120,
  base: 200,
} as const

export const mediaQuery = (breakpoint: Breakpoint) => `(min-width: ${BREAKPOINTS[breakpoint]}px)`
