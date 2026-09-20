# Atlas, catálogo de profissionais

Catálogo de profissionais autônomos com busca, filtros, ordenação, carregamento sob demanda e
página de perfil. Construído como quatro entregáveis independentes ligados por Module Federation.

```
navegador ──▶ container (host, SSR)
                ├── api            profissionais, filtros e facetas
                ├── app            remote catalog: listagem e perfil
                └── design-system  remote ui: componentes e tokens
```

| Projeto         | Papel                                | Porta | Stack                   |
| --------------- | ------------------------------------ | ----- | ----------------------- |
| `container`     | Host Module Federation (`shell`)     | 3000  | Nuxt 4, Vue 3, Pinia    |
| `api`           | API de leitura do catálogo           | 3001  | PHP 8.3+, Slim 4        |
| `app`           | Remote Module Federation (`catalog`) | 3002  | Nuxt 4, Vue 3, Pinia    |
| `design-system` | Remote Module Federation (`ui`)      | 3003  | Nuxt 4, Vue 3, Tailwind |
| `contracts`     | Contrato TypeScript compartilhado    | ,     | TypeScript + Pinia      |

---

## Como executar o projeto

### Pré-requisitos

- Node `^22.18`, `^24.11` ou `>=26`
- npm, yarn ou pnpm, o repositório não fixa gerenciador
- PHP 8.3 ou superior com `ext-mbstring` e `ext-json`, mais Composer 2

### 1. Dependências

```bash
npm install
```

No Ubuntu 26.04 o PHP do repositório é o 8.5:

```bash
sudo apt install php-cli php-mbstring composer
composer install --working-dir=api
```

### 2. Dataset

O `api/data/professionals.json` já vem versionado com 520 profissionais. Para regenerar:

```bash
npm run seed
```

A semente é fixa: o mesmo comando produz sempre o mesmo arquivo.

### 3. Subir tudo

```bash
npm run dev
```

Sobe os quatro serviços em paralelo: API, container, app e design system. Se ainda não tiver PHP
instalado, `npm run dev:web` sobe só os três projetos Nuxt.

A API roda no servidor embutido do PHP com `PHP_CLI_SERVER_WORKERS=4`. Sem os workers ele atende
uma requisição por vez, e o SSR do container, que busca perfil e relacionados em paralelo, ficaria
esperando na fila.

| Endereço              | O que é                             |
| --------------------- | ----------------------------------- |
| http://localhost:3000 | Aplicação, é por aqui que se navega |
| http://localhost:3001 | API                                 |
| http://localhost:3002 | Remote `catalog` em modo standalone |
| http://localhost:3003 | Remote `ui`, publica o manifesto MF |
| http://localhost:6006 | Storybook do design system          |

O container precisa que os dois remotes estejam no ar: ele busca o `mf-manifest.json` de cada um
durante o setup e carrega os componentes deles no servidor e no navegador.

### Docker

```bash
docker compose up --build
```

Sobe os quatro serviços nas mesmas portas. A API roda em `php:8.4-apache` com `mod_rewrite`; os
projetos Nuxt rodam do `.output` em Node 24.

---

## Scripts

| Comando             | O que faz                                             |
| ------------------- | ----------------------------------------------------- |
| `npm run dev`       | Sobe container, app e design-system em paralelo       |
| `npm run dev:api`   | Sobe a API PHP no servidor embutido                   |
| `npm run build`     | Build de produção dos três projetos, na ordem correta |
| `npm run preview`   | Serve o build de produção                             |
| `npm run seed`      | Regenera o dataset                                    |
| `npm test`          | Testes unitários                                      |
| `npm run lint`      | ESLint                                                |
| `npm run format`    | Prettier                                              |
| `npm run typecheck` | `vue-tsc` nos três projetos                           |

Para um projeto só: `cd app && npx nuxt dev`.

Os scripts de raiz chamam os binários locais com `npx` e o monorepo usa `workspaces` do
`package.json`, então `npm`, `yarn` e `pnpm` funcionam igual, nenhum é exigido.

Em produção, suba os remotes antes do container que os referencia, e mantenha os assets da versão
anterior no ar enquanto houver sessão aberta.

---

## Organização

```
atlas-frontend-challenge/
├── container/       host: rotas, SSR, SEO e shell
├── app/             remote catalog: listagem, filtros e perfil
├── design-system/   remote ui: componentes, tokens e preset Tailwind
├── api/             API PHP (Slim)
├── contracts/       tipos, codec de query e formatadores
├── docs/            documentação de arquitetura e decisões
└── docker/          imagem Node compartilhada
```

Cada projeto Nuxt usa arquitetura modular:

```
src/
├── components/   componentes expostos por Module Federation
├── layouts/
├── modules/<mod>/{components,pages,hooks,services,router,utils}
├── plugins/
├── router/       agregador das rotas dos módulos
└── shared/{components,hooks,models,utils}
```

Não existem pastas `stores/`, `composables/` ou `types/`: stores e composables ficam em
`hooks/useXxx.ts`, o que é global vai para `shared/`.

---

## Decisões técnicas

O registro completo, com contexto e custo de cada uma, está em [docs/decisions.md](docs/decisions.md).
Em resumo:

**O grafo de federação é plano.** A intenção era `container → catalog → ui`. O
`@module-federation/nuxt@0.1.0` não suporta um remote que também seja host SSR de outro remote, falha em dev (`vm.SourceTextModule is not a constructor`) e é bloqueado no build pela checagem de
portabilidade do próprio plugin. Como a alternativa era servir cards em branco no HTML do servidor,
o container virou o único host em runtime e o `app` importa o design system em build. A fronteira
já é prop/evento, então voltar ao grafo aninhado é mudança local.

**A URL é a fonte da verdade dos filtros.** Busca, categoria, preço, nota, distância e ordenação
vivem na query string, sem cópia em store. O mesmo codec (`@atlas/contracts`) roda na API e no
host, então filtro e resultado nunca divergem entre servidor e cliente, e qualquer busca é
compartilhável e renderizada no SSR.

**`page` fica fora da URL.** O scroll infinito acumula em store. Um link compartilhado abre no
começo do resultado, e o SSR não precisa buscar N páginas para reconstruir a tela. Voltar do perfil
devolve a lista acumulada sem nova requisição.

**O remote é dono do estado, não das props.** `pinia` é singleton compartilhado, então o remote
define as próprias stores e os componentes expostos as consomem direto, sem prop e sem evento. O
container monta `<RemoteCatalogCatalogView />` e nada mais. Para o SEO, o remote publica título,
descrição e JSON-LD na store `pageMeta` de `@atlas/contracts`, e o container lê de lá. O runtime do
Nuxt não é compartilhado: componente exposto usa `vue` e `vue-router`, nunca `useAsyncData`.

**A API é Slim, não Laravel.** É leitura sobre um JSON em memória: filtro, ordenação, paginação e
facetas. Sem migração, fila ou ORM, um framework completo seria peso sem uso.

**Facetas excluem o próprio eixo.** A contagem de cada categoria ignora o filtro de categoria mas
respeita os demais, é o que evita marcar "Beleza" e ver todo o resto zerado, sem saber o que
sobraria ao trocar de filtro.

---

## Performance e Web Vitals

Detalhe em [docs/architecture/performance.md](docs/architecture/performance.md).

**LCP**, a foto do primeiro card é o LCP da home. Os quatro primeiros cards carregam com
`fetchpriority="high"`; o resto é `lazy`. A primeira página vem renderizada do servidor e viaja no
payload, sem refetch na hidratação. O container abre `preconnect` para a origem dos remotes e
`dns-prefetch` para o CDN de imagem.

**CLS**, toda imagem tem `width`/`height`, a mídia do card tem `aspect-ratio` fixo e o skeleton
tem exatamente a mesma caixa do card.

**INP**, busca com debounce de 300 ms, filtro de alta frequência escrito com `replace`, drawer
mobile em `<dialog>` nativo, e cards com `content-visibility: auto` + `contain-intrinsic-size`.

**Rede**, a listagem devolve só o resumo do card, nunca o perfil completo; `perPage` limitado a 48
no contrato; `stale-while-revalidate` na borda; Brotli e gzip no container.

**SEO**, `<title>` e `description` acompanham o filtro, listagem filtrada é `noindex,follow` com
canônica na home, e o perfil tem JSON-LD `ProfessionalService` com nota, preço e área atendida.

**Acessibilidade**, skip link, contador de resultado em `aria-live`, alvo de toque de 44px, foco
visível em link e botão, `prefers-reduced-motion` respeitado, e o card é um `<a href>` real que
funciona sem JavaScript.

---

## Testes

```bash
npm test
```

A cobertura está no codec de query (`contracts/src/query.test.ts`): ida e volta entre URL e estado,
descarte de valor fora do contrato, normalização de faixa invertida e estabilidade da chave de
cache. É o ponto de maior risco da aplicação, é o que mantém API e front concordando sobre o que
um filtro significa.

---

## Uso de IA

Claude (Claude Code) foi usado como par ao longo de toda a construção: estrutura do monorepo,
scaffolding dos projetos, componentes, API em PHP e documentação.

Onde ele mudou o resultado de forma relevante: a investigação do limite de SSR aninhado do Module
Federation foi feita executando dev e build e lendo o erro real do plugin, não por suposição, foi
isso que levou à decisão de achatar o grafo em vez de aceitar HTML vazio.

Toda decisão de arquitetura, recorte de escopo e trade-off registrado em `docs/decisions.md` foi
revisada e decidida por mim. O código foi lido e ajustado antes de entrar.

---

## Melhorias futuras

- Medir Web Vitals em produção (`web-vitals` + endpoint de coleta) em vez de só otimizar por
  heurística.
- Voltar ao grafo `container → catalog → ui` quando o `@module-federation/nuxt` suportar remote
  aninhado com SSR.
- Testes de componente para a listagem e o perfil, e teste de contrato entre o codec TypeScript e o
  `CatalogQuery` do PHP.
- Persistir favoritos na API quando existir sessão de usuário.
- Cache de resposta na API (hoje o cache é só de borda, por header).
- Mapa na busca por distância, que hoje é um `select` de raio.
