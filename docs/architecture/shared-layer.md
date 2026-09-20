# Camada compartilhada

## `contracts/`, contrato entre projetos

Pacote TypeScript sem build, consumido direto do fonte pelos três projetos Nuxt.

| Arquivo           | Conteúdo                                                            |
| ----------------- | ------------------------------------------------------------------- |
| `professional.ts` | `Professional`, `ProfessionalSummary`, categorias, disponibilidades |
| `catalog.ts`      | `CatalogQuery`, `CatalogResponse`, facetas, chaves de ordenação     |
| `query.ts`        | Codec URL ↔ `CatalogQuery`, chave de cache, contagem de filtros     |
| `format.ts`       | Formatadores de preço, nota, distância e data                       |
| `seo.ts`          | Título, descrição e JSON-LD das páginas                             |
| `pageMeta.ts`     | Store Pinia `pageMeta`, ponte de SEO entre remote e host            |

`ProfessionalSummary` e `Professional` são separados de propósito. A listagem devolve só o resumo:
para 500 registros, a bio, a galeria e as avaliações são a maior parte do payload e do custo de
hidratação.

Os formatadores instanciam cada `Intl.NumberFormat` uma vez no módulo. Criar um por card custa
caro em lista longa.

### `usePageMeta`

O remote conhece o dado; o host conhece o `<head>`. `usePageMeta` é a única store definida no
pacote compartilhado: o remote escreve título, descrição, imagem e JSON-LD ao carregar, o container
lê e alimenta `useSeoMeta`.

Funciona porque `pinia` é singleton compartilhado pelo Module Federation: os dois bundles têm a
definição da store, mas o id `pageMeta` é o mesmo, então é a mesma instância em runtime.

## `src/shared/`, global por projeto

```
src/shared/
├── components/   componentes usados fora de qualquer módulo
├── hooks/        stores Pinia e composables globais
├── models/       tipos e constantes globais
└── utils/        funções puras globais
```

`shared/` fica ao lado de `modules/`. O que é de um módulo só mora no módulo.

## `src/modules/<mod>/utils/`, helpers do módulo

Helpers puros, sem reatividade: `chips.ts` monta os chips de filtro ativo, `constants.ts` guarda
debounce, contagem de esqueleto e opções de filtro.

Helper que apareceria dentro de um arquivo de hook vai para cá. Hook é ponto de composição:
misturar helper puro com orquestração reativa infla o arquivo e esconde violação de tamanho.

Nenhum número mágico em componente. `SEARCH_DEBOUNCE_MS`, `PRIORITY_CARD_COUNT` e
`LOAD_MORE_ROOT_MARGIN` moram em `modules/catalog/utils/constants.ts`.
