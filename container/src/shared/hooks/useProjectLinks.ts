import { REPO_URL } from '@/shared/constants'
import { BRAND_ICON } from '@/shared/constants/icons'

export interface ProjectLink {
  label: string
  href: string
  icon?: string
}

export function useProjectLinks() {
  const config = useRuntimeConfig()

  const links = computed<ProjectLink[]>(() => [
    { label: 'API', href: `${config.public.apiBase}/professionals` },
    { label: 'Design system', href: config.public.storybookUrl },
    { label: 'Docs', href: config.public.docsUrl },
    { label: 'GitHub', href: REPO_URL, icon: BRAND_ICON.github },
  ])

  return { links }
}
