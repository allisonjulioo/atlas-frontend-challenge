export interface TabOption {
  value: string
  label: string
  count?: number
}

export interface BottomNavItem {
  href: string
  label: string
  icon: string
  active?: boolean
  badge?: string
}

export interface SelectOption {
  value: string
  label: string
}
