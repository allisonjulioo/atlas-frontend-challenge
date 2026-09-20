# Estrutura do projeto

## Stack

| Categoria  | Tecnologia                     | Versão  |
| ---------- | ------------------------------ | ------- |
| Framework  | Nuxt (Vue 3)                   | 4.5     |
| Build      | Vite (Rolldown)                | 8.x     |
| Linguagem  | TypeScript                     | 5.9     |
| Federation | @module-federation/nuxt        | 0.1     |
| Estado     | Pinia                          | 4.x     |
| CSS        | Tailwind CSS + SCSS            | 3.4     |
| Monorepo   | workspaces (npm, yarn ou pnpm) | ,       |
| API        | PHP + Slim                     | 8.3 / 4 |

## Raiz

```
atlas-frontend-challenge/
├── container/       host Module Federation, SSR e SEO
├── app/             remote catalog
├── design-system/   remote ui
├── api/             API PHP (Slim)
├── contracts/       tipos, codec de query e formatadores
├── docs/            documentação de arquitetura
└── docker/          imagem Node compartilhada pelos três projetos Nuxt
```

## Projetos Nuxt

`srcDir` é `src/` nos três, e não o `app/` padrão do Nuxt 4, para manter um único layout de
pastas no monorepo.

```
<projeto>/src/
├── assets/styles/    estilos globais (apenas no design-system)
├── components/       componentes expostos por Module Federation
├── layouts/          layouts Nuxt
├── modules/          arquitetura principal, uma pasta por feature
├── plugins/          plugins Nuxt
├── router/           agregador das rotas dos módulos
└── shared/           global do projeto
    ├── components/
    ├── constants/
    ├── hooks/
    ├── models/
    └── utils/
```

## Módulos

```
modules/<mod>/
├── components/   componentes do módulo
├── constants/    constantes do módulo
├── hooks/        stores Pinia e composables (useXxx.ts)
├── models/       tipos do módulo
├── pages/        páginas do módulo
├── router/       rotas do módulo
├── services/     chamadas de API
└── utils/        funções puras, uma por arquivo
```

Não existem as pastas `stores/`, `composables/` ou `types/`. Stores e composables ficam em
`hooks/`; o que é global fica em `src/shared/`, com a mesma divisão.

Cada arquivo em `utils/` tem uma função só e o nome dela: `build-filter-chips.ts`,
`format-price-range-label.ts`, `build-profile-page-meta.ts`.

## Variáveis de ambiente

```env
NUXT_PUBLIC_API_BASE=http://localhost:3001
NUXT_PUBLIC_SITE_URL=http://localhost:3000
ATLAS_UI_REMOTE=http://localhost:3003/_mf/mf-manifest.json
ATLAS_CATALOG_REMOTE=http://localhost:3002/_mf/mf-manifest.json
ATLAS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002,http://localhost:3003
```

As duas primeiras são lidas em runtime (`runtimeConfig.public`). As `ATLAS_*` de remote são lidas
em build: mudar de ambiente exige novo build do container.

## Scripts

Os scripts de raiz chamam os binários locais com `npx`, sem amarrar gerenciador. `npm install`,
`yarn install` ou `pnpm install` funcionam igual.
