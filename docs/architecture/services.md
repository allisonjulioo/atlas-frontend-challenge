# Camada de serviços

Toda chamada HTTP fica em `modules/<mod>/services/`. Componente e store nunca chamam `$fetch`
direto.

```ts
export const getCatalogService = (query: CatalogQuery) => {
  const { apiBase } = useRuntimeConfig().public

  return $fetch<CatalogResponse>('/professionals', {
    baseURL: apiBase,
    query: { ...serializeCatalogQuery(query), page: query.page, perPage: query.perPage },
  })
}
```

Convenção de nome: `getXxxService`, `postXxxService`, `putXxxService`, `deleteXxxService`.

O serviço devolve a promise crua. Quem trata erro e estado de carregamento é a store, assim o
mesmo serviço serve a store, o teste e um script.

Os serviços do catálogo moram no remote `app`. O container não tem camada de serviço: ele não
busca dado do catálogo.

`baseURL` vem de `runtimeConfig.public.apiBase`. No servidor a chamada sai do processo Nitro; no
cliente sai do navegador. Por isso a API precisa liberar CORS para a origem do container
(`ATLAS_ALLOWED_ORIGINS`).

A query da URL e a query da API usam o **mesmo** codec (`@atlas/contracts`): um filtro inválido cai
no mesmo valor padrão dos dois lados, e o resultado do servidor nunca diverge do cliente.
