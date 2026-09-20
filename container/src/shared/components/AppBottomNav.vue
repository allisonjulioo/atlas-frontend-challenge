<template>
  <RemoteUiBottomNav :items="items" @navigate="onNavigate" />
</template>

<script setup lang="ts">
import type { BottomNavItem } from '@atlas/design-system'
import { ROUTE_NAME } from '@/shared/constants'
import { NAV_ICON } from '@/shared/constants/icons'

const route = useRoute()
const router = useRouter()

const items = computed<BottomNavItem[]>(() => [
  {
    href: '/',
    label: 'Catálogo',
    icon: NAV_ICON.catalog,
    active: route.name === ROUTE_NAME.catalogList && !route.query.sort && !route.query.verifiedOnly,
  },
  {
    href: '/?sort=avaliacao',
    label: 'Melhores',
    icon: NAV_ICON.rating,
    active: route.query.sort === 'avaliacao',
  },
  {
    href: '/?verifiedOnly=1',
    label: 'Verificados',
    icon: NAV_ICON.verified,
    active: route.query.verifiedOnly === '1',
  },
  {
    href: '/?sort=distancia',
    label: 'Perto',
    icon: NAV_ICON.distance,
    active: route.query.sort === 'distancia',
  },
])

const onNavigate = (item: BottomNavItem, event: MouseEvent) => {
  event.preventDefault()

  router.push(item.href)
}
</script>
