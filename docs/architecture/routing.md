# Rotas

As rotas são declaradas por módulo, não pelo scan de `pages/` do Nuxt.

```
src/modules/catalog/router/routes.ts   rotas do módulo
src/router/routes.ts                   agregador
nuxt.config.ts                         hook pages:extend
```

```ts
export const catalogRoutes: NuxtPage[] = [
  {
    name: 'catalog-list',
    path: '/',
    file: fileURLToPath(new URL('../pages/CatalogListPage.vue', import.meta.url)),
  },
  {
    name: 'professional-profile',
    path: '/profissionais/:slug()',
    file: fileURLToPath(new URL('../pages/ProfessionalProfilePage.vue', import.meta.url)),
  },
]
```

```ts
hooks: {
  'pages:extend': (pages) => {
    pages.splice(0, pages.length, ...appRoutes)
  },
}
```

Motivo: o scan por pasta obrigaria `pages/` a espelhar a URL, e a feature ficaria partida entre
`pages/` e `modules/`. Com o hook, a rota mora ao lado da página que ela aponta e ganha `name`
obrigatório.

Navegação sempre por `name`:

```ts
router.push({ name: ROUTE_NAME.professionalProfile, params: { slug } })
```

Nunca `router.push('/profissionais/' + slug)`. O path pode mudar; o nome não.

## Navegação a partir do card

O card do design system é um `<a href>` real. Ele funciona sem JavaScript e responde a
"abrir em nova aba". Só o clique simples com botão esquerdo, sem modificador, é convertido em
navegação SPA: o card emite `select`, e o container chama `event.preventDefault()` e navega.
