# Gerenciamento de estado

## Onde cada coisa mora

Todo o estado do catálogo vive no remote `catalog`. O container só tem o tema.

| Estado                                | Onde                                                   | Por quê                                                            |
| ------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------ |
| Filtros, busca e ordenação            | Query string da URL, lida por `useCatalogFilters`      | Compartilhável, sobrevive a reload e é o que o SSR renderiza       |
| Resultado da listagem                 | `useCatalogList` (app)                                 | Serializa no payload do SSR; o cliente não refaz a primeira página |
| Páginas acumuladas do scroll infinito | `useCatalogList` (app)                                 | Voltar do perfil devolve a lista inteira sem nova requisição       |
| Perfil e relacionados                 | `useProfessional` (app)                                | Mesma razão                                                        |
| Favoritos                             | `useFavorites` (app) + `localStorage`                  | Não há sessão de usuário no escopo                                 |
| Título, descrição e JSON-LD           | `usePageMeta` (`@atlas/contracts`)                     | O remote conhece o dado, o container conhece o `<head>`            |
| Tema                                  | `useTheme` (container) + `localStorage` + `data-theme` | Script inline aplica antes do primeiro paint                       |

## Stores

Ficam em `hooks/useXxx.ts`, no estilo setup, sem sufixo `Store`:

```ts
export const useCatalog = defineStore('catalog', () => {
  const response = ref<CatalogResponse | null>(null)

  const items = computed(() => response.value?.items ?? [])

  const init = async () => {
    /* ... */
  }

  const reset = () => {
    /* ... */
  }

  return { response, items, init, reset }
})
```

Consumo sempre com split:

```ts
const { items, pending } = storeToRefs(useCatalogList())

const { init, loadMore } = useCatalogList()
```

Nunca `const store = useCatalogList()` seguido de `store.items` no template.

Navegação também mora na store. `useCatalogNavigation` expõe `openProfile(professional, event)` e
`hrefFor(slug)`; o componente só chama. Assim o componente continua sendo view pura e não importa
`useRouter`.

Elemento do DOM entra na store por ação, nunca por parâmetro de hook: `setDialog(el)` na gaveta,
`setSentinel(el)` no scroll infinito.

## Ciclo de vida

Hook não importa `onMounted`. Ele expõe `init()` e `reset()`; quem pluga é o componente.

No caso do catálogo, quem pluga é o componente exposto, é ele que o host monta, sem passar pela
página do remote:

```ts
const { init, reset } = useCatalogList()

onServerPrefetch(init)

onMounted(init)

onBeforeUnmount(reset)
```

O par com `onServerPrefetch` é o que mantém a listagem no HTML do servidor: `onMounted` não roda
no servidor. `init()` é idempotente, se a store já tem o dado da chave atual, ela não refaz a
requisição, então a hidratação não dispara uma segunda busca.

## A URL como fonte da verdade

`useCatalogFilters` deriva `query` de `route.query` com `parseCatalogQuery`, e `apply()` escreve de
volta com `serializeCatalogQuery`. Não existe cópia do filtro em store.

`mode: 'replace'` para mudança de alta frequência (digitação na busca) e `mode: 'push'` para o
resto: o botão voltar sai da busca em vez de desfazer letra por letra.

`page` fica **fora** da URL. Um link compartilhado abre no começo do resultado, e o SSR não precisa
buscar N páginas para reconstruir a tela.
