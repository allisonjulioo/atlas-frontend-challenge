# API

PHP 8.3 ou superior com Slim 4, servida por Apache (`.htaccess`) ou nginx + PHP-FPM.

## Estrutura

```
api/
├── public/index.php        front controller e rotas
├── public/router.php       fallback do servidor embutido do PHP
├── src/
│   ├── Catalog/            CatalogQuery, CatalogRepository, CatalogSearch, Normalizer
│   ├── Domain/             Category, Availability, SortKey (enums)
│   ├── Http/Action/        uma action por endpoint
│   ├── Http/Middleware/    CORS, Cache-Control, erro em JSON
│   ├── Seed/               gerador determinístico do dataset
│   └── Support/            Json, Slug, DeterministicRandom
├── bin/seed.php            regenera data/professionals.json
├── data/professionals.json 520 profissionais, versionado
└── Dockerfile              php:8.4-apache
```

## Endpoints

| Método | Rota                            | Resposta                                       |
| ------ | ------------------------------- | ---------------------------------------------- |
| GET    | `/health`                       | Status, contagem do dataset e versão do PHP    |
| GET    | `/professionals`                | `CatalogResponse`, itens, paginação e facetas  |
| GET    | `/professionals/{slug}`         | `Professional` completo                        |
| GET    | `/professionals/related/{slug}` | Até 6 `ProfessionalSummary` da mesma categoria |

### Parâmetros de `/professionals`

| Parâmetro               | Tipo                                                              | Padrão       |
| ----------------------- | ----------------------------------------------------------------- | ------------ |
| `q`                     | string, até 80 caracteres                                         | `''`         |
| `categories`            | lista separada por vírgula                                        | todas        |
| `availability`          | lista separada por vírgula                                        | todas        |
| `minPrice` / `maxPrice` | número                                                            | sem limite   |
| `minRating`             | 0 a 5                                                             | sem limite   |
| `maxDistanceKm`         | 0 a 200                                                           | sem limite   |
| `verifiedOnly`          | `1` ou `true`                                                     | `false`      |
| `sort`                  | `relevancia`, `preco-asc`, `preco-desc`, `avaliacao`, `distancia` | `relevancia` |
| `page`                  | inteiro ≥ 1                                                       | `1`          |
| `perPage`               | 1 a 48                                                            | `24`         |

Parâmetro inválido cai no padrão. A API nunca devolve 400 por filtro malformado: a listagem tem
que renderizar.

O mesmo contrato de parsing existe em TypeScript (`contracts/src/query.ts`) e em PHP
(`CatalogQuery::fromQueryParams`). Mudou um, muda o outro.

## Decisões da busca

**Relevância.** Sem termo de busca, relevância é qualidade percebida: nota ponderada pelo volume de
avaliações (`rating × reviews / (reviews + 20)`), mais um empurrão para verificado e um desconto
por distância. Um 5,0 com 3 avaliações não passa na frente de um 4,8 com 300. Com termo, o match no
começo da profissão ou do nome domina o score.

**Empate.** Toda ordenação desempata por `id`. Sem isso, dois profissionais com o mesmo preço podem
aparecer duas vezes ou sumir entre páginas.

**Facetas com exclusão do próprio eixo.** A contagem de cada categoria ignora o filtro de categoria
mas respeita os demais. É o que evita o beco sem saída: marcar "Beleza" e ver todas as outras
opções zeradas, sem saber o que sobraria ao trocar de filtro.

**Normalização.** Nome, profissão e cidade são normalizados uma vez no carregamento, não a cada
requisição. Para 520 registros e múltiplos filtros, normalizar acento é o gargalo real, não a
filtragem.

## Dataset

520 profissionais gerados com semente fixa (`SeedData::SEED`). O mesmo comando produz sempre o
mesmo arquivo, então ele pode ser versionado e o diff de uma mudança no gerador é legível.

```bash
composer --working-dir=api seed
```

Fotos: retrato de `randomuser.me` para o avatar e `picsum.photos` com semente para a capa e a
galeria. Ambos servidos por CDN com cache longo. O `Avatar` do design system tem fallback local de
iniciais para o caso de a CDN falhar.

## Cache e CORS

`CacheControlMiddleware` aplica a política por rota:

| Rota                | Política                                           |
| ------------------- | -------------------------------------------------- |
| `/professionals`    | `public, max-age=30, stale-while-revalidate=300`   |
| `/professionals/**` | `public, max-age=300, stale-while-revalidate=3600` |
| `/health`           | `no-store`                                         |

`CorsMiddleware` usa allowlist explícita (`ATLAS_ALLOWED_ORIGINS`), não `*`: o container, os dois
remotes e a origem de produção ficam declarados em um lugar só.

## Rodando

```bash
cd api
composer install
composer seed
composer serve
```

`composer serve` usa o servidor embutido do PHP com `public/router.php`. Duas razões para cada
peça:

O **router** existe porque o servidor embutido devolve 404 para qualquer caminho que não seja um
arquivo real. Ele entrega o arquivo quando existe e cai no front controller quando não existe, que
é o que o `.htaccess` do Apache e o `try_files` do nginx fazem em produção.

`PHP_CLI_SERVER_WORKERS=4` existe porque o servidor embutido atende uma requisição por vez. O SSR
do container busca perfil e relacionados em paralelo; com um worker só, a segunda espera a
primeira terminar.

Ou `docker compose up api`, que sobe `php:8.4-apache` com `mod_rewrite` na porta 3001.
