# Code style

## Estrutura de módulos

Todo módulo em `src/modules/<mod>/` tem exatamente estas subpastas:

```
src/modules/<mod>/
├── components/   componentes Vue do módulo
├── pages/        páginas do módulo
├── hooks/        stores Pinia e composables (useXxx.ts)
├── services/     camada de API (getXxxService, postXxxService)
├── router/       rotas do módulo
└── utils/        helpers puros e constantes do módulo
```

| Regra                            | Descrição                                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Sem `stores/`**                | Stores Pinia vivem em `hooks/useXxx.ts`                                                                                        |
| **Sem `composables/`**           | Composables vivem em `hooks/useXxx.ts`                                                                                         |
| **Sem `types/`**                 | Tipos e constantes globais em `src/shared/models/`, helpers de módulo em `modules/<mod>/utils/`                                |
| **Sem sufixo `Store`**           | O export é sempre `useXxx`, mesmo em `defineStore`                                                                             |
| **Split obrigatório**            | `const { refs } = storeToRefs(useXxx())` e `const { actions } = useXxx()`. Nunca `const store = useXxx()` seguido de `store.x` |
| **Um hook por arquivo**          | Nenhuma função no escopo do módulo além do próprio hook. Constantes estáticas são permitidas                                   |
| **Hook de módulo sem parâmetro** | Todo estado vem do store                                                                                                       |
| **Sem lifecycle em hook**        | O hook expõe `init()` e `reset()`; a página pluga o ciclo                                                                      |

## Regras de código

| Regra                                                 | Descrição                                                                                          |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Sem comentários**                                   | Nenhum comentário no código. Decisão técnica mora em `docs/`                                       |
| **Ordem dos blocos**                                  | `<template>` → `<script setup lang="ts">` → `<style lang="scss" scoped>`                           |
| **Script setup**                                      | Sempre `<script setup lang="ts">`                                                                  |
| **Sem tipar retorno**                                 | O TypeScript infere                                                                                |
| **Sem `if` inline**                                   | Sempre bloco `{ }` com quebra de linha                                                             |
| **Linha vazia após `if`**                             | E após cada declaração `const`/`let`                                                               |
| **Sem `for`**                                         | `map`, `filter`, `reduce`, `forEach`                                                               |
| **Sem aninhamento**                                   | Early return em vez de `if` dentro de `if`. Máximo de 4 níveis                                     |
| **Responsabilidade única**                            | Um método faz uma coisa. Extrair em funções menores                                                |
| **Sem lógica em componente**                          | Componente é view. Lógica vai para hook ou `utils/`                                                |
| **Sem `try/catch` em componente**                     | Erro é tratado na store                                                                            |
| **Sem `reactive({})` em hook**                        | Devolver objeto plano de refs e ações                                                              |
| **BEM no SCSS**                                       | `block__element--modifier` com `@apply` do Tailwind                                                |
| **Sem cor hardcoded**                                 | Só classes do preset ou variáveis CSS do tema                                                      |
| **`router.push` por `name`**                          | Nunca por string de path                                                                           |
| **Sem props/emits entre componentes do mesmo módulo** | Acessar a store direto. Props/emits são para componentes genéricos e para a fronteira de federação |

## Exemplo

```typescript
export const useCatalog = defineStore('catalog', () => {
  const response = ref<CatalogResponse | null>(null)

  const items = computed(() => response.value?.items ?? [])

  const load = async () => {
    response.value = await getCatalogService(query.value)
  }

  const init = async () => {
    if (response.value) {
      return
    }

    await load()
  }

  return { response, items, init, load }
})
```

```vue
<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useCatalog } from '@/modules/catalog/hooks/useCatalog'

  const { items, pending } = storeToRefs(useCatalog())

  const { init } = useCatalog()

  await init()
</script>
```

## Exceções deste projeto

| Ponto                      | Regra geral    | Aqui                                                | Motivo                                                                                   |
| -------------------------- | -------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Quem pluga o ciclo de vida | A página       | O componente exposto, quando é ele que o host monta | O host renderiza `<RemoteCatalogCatalogView />` direto, sem passar pela página do remote |
| `onMounted(init)`          | Só `onMounted` | `onServerPrefetch(init)` junto                      | `onMounted` não roda no servidor; sem o par, a listagem não vem no HTML                  |
| i18n                       | `vue-i18n`     | Textos em pt-BR direto no componente                | Uma língua só no escopo do desafio                                                       |

## Antes de finalizar

```bash
npm run format && npm run lint && npm run typecheck
```
