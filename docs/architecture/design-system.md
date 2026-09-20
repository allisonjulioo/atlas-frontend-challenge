# Design system

## Distribuição

O mesmo código sai por dois caminhos:

| Caminho                                | Consumidor  | Quando resolve |
| -------------------------------------- | ----------- | -------------- |
| Remote `ui` (`/_mf/remoteEntry.js`)    | `container` | Runtime        |
| Pacote `@atlas/design-system`          | `app`       | Build          |
| `@atlas/design-system/tailwind-preset` | todos       | Build          |
| `@atlas/design-system/styles`          | todos       | Build          |

O motivo de o `app` não consumir por federação está em [module-federation.md](module-federation.md).

Tokens e preset nunca passam por federação: as variáveis precisam existir no primeiro byte de CSS
da página, e buscá-las em runtime garantiria flash de conteúdo sem estilo.

## Componentes expostos

| Componente         | Uso                                          |
| ------------------ | -------------------------------------------- |
| `Logo`             | Marca, em `currentColor`                     |
| `SearchField`      | Busca em pílula com botão circular           |
| `Tabs`             | Abas de categoria com indicador              |
| `Chip`             | Filtro ativo, removível                      |
| `ProfessionalCard` | Card com foto dominante, selos e preço       |
| `SkeletonCard`     | Placeholder com a mesma caixa do card        |
| `Avatar`           | Foto com fallback de iniciais                |
| `Rating`           | Nota compacta ou cinco estrelas              |
| `Badge`            | Selo de status                               |
| `PriceTag`         | Valor com unidade                            |
| `Button`           | `primary`, `accent`, `secondary`, `ghost`    |
| `EmptyState`       | Resultado vazio                              |
| `BottomNav`        | Navegação inferior, visível abaixo de 1024px |

Tudo em `design-system/src/components/exposed/` é registrado automaticamente como componente local
e publicado no manifesto. Componente fora dessa pasta é privado do design system.

## Regras dos componentes expostos

- Usa apenas `vue`. Nenhum composable do Nuxt: o runtime do Nuxt não é compartilhado pelo MF.
- Recebe dado por prop e devolve intenção por evento. Nenhuma chamada de API, nenhum store.
- Nenhuma dependência de rota. Um link é `href` + evento `select`, nunca `RouterLink`.
- Imagem sempre com `width`, `height` e `loading` explícitos.
- Alvo de toque mínimo de 44px em qualquer elemento interativo.

## Showcase

`cd design-system && npx nuxt dev` sobe o showcase em `localhost:3003`, com um exemplo de cada
componente e dado fixo. É onde o componente é validado antes de ser consumido.
