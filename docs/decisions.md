# Decisões técnicas

Registro curto das decisões com trade-off. Uma seção por decisão: contexto, escolha, custo.

---

## 1. Grafo de Module Federation plano

**Contexto.** A intenção era `container → catalog → ui`: o design system como remote consumido em
runtime pelo host e pelo remote de catálogo.

**Problema.** `@module-federation/nuxt@0.1.0` não suporta um remote que também seja host SSR de
outro remote. Em dev o loader aninhado cai na estratégia `vm` e falha
(`vm.SourceTextModule is not a constructor`); com `--experimental-vm-modules` ele passa a tentar
executar o `remoteEntry` de dev não empacotado. Em build, a checagem de portabilidade do próprio
plugin rejeita a saída porque o `ssr-entry-loader` carrega um caminho absoluto da máquina de build.

**Escolha.** O container é o único host em runtime, com dois remotes. O `app` importa os
componentes do design system em build, pelo workspace.

**Custo.** Bytes duplicados entre `catalog` e `ui` no cliente. Em troca, SSR completo em todos os
níveis, que é o que sustenta LCP e SEO. Como a fronteira já é prop/evento, voltar ao grafo
aninhado quando a ferramenta suportar é mudança local.

---

## 2. URL como fonte da verdade dos filtros

**Escolha.** Busca, categoria, faixa de preço, nota, distância e ordenação vivem na query string.
Não há cópia em store.

**Por quê.** Link compartilhável, sobrevive a reload, o SSR renderiza já filtrado e o buscador vê o
mesmo que o usuário. O mesmo codec (`@atlas/contracts`) roda na API e no host, então filtro e
resultado nunca divergem entre servidor e cliente.

**Custo.** Uma navegação por mudança de filtro. Mitigado com `replace` para digitação.

---

## 3. `page` fora da URL

**Escolha.** O scroll infinito acumula páginas em store, não na URL.

**Por quê.** Um link compartilhado deve abrir no começo do resultado, não na página sete do scroll
de outra pessoa. E manter `page` na URL obrigaria o SSR a buscar N páginas para reconstruir a tela.

**Custo.** Recarregar a página volta para a primeira. Voltar do perfil, não: o acumulado está no
store da sessão.

---

## 4. Tailwind com `@apply` dentro de BEM

**Escolha.** Classe BEM no SCSS, utilitário Tailwind via `@apply`, cor sempre por token.

**Por quê.** Mantém o padrão de código do time e mantém o HTML legível. Cor por variável CSS
permite tema claro e escuro sem recompilar e sem duplicar classe `dark:` em todo componente.

**Custo.** Uma indireção a mais entre o template e o utilitário. O preset compartilhado
(`@atlas/design-system/tailwind-preset`) é a única definição de tema.

---

## 5. API em PHP com Slim

**Escolha.** Slim 4, duas dependências, sem ORM.

**Por quê.** A API é leitura sobre um JSON em memória: filtro, ordenação, paginação e facetas. Não
há migração, fila, autenticação nem relacionamento. Frameworks como Laravel traria container de serviço, Eloquent e artisan para um caso que não os usa.

**Custo.** Roteamento, middleware e DI são explícitos. Para este escopo isso é legibilidade, não
peso.

---

## 6. Dataset determinístico versionado

**Escolha.** `bin/seed.php` com semente fixa gera `data/professionals.json`, que é versionado.

**Por quê.** O mesmo comando produz sempre o mesmo arquivo: o diff de uma mudança no gerador é
legível, o ambiente de todo mundo é idêntico e teste de snapshot não quebra por acaso.

**Custo.** Um JSON de alguns MB no repositório. Em troca, `git clone` e `composer serve` já sobem
com dado real.

---

## 7. O remote é dono do estado, não das props

**Contexto.** A primeira versão passava tudo por prop: `query`, `items`, `facets`, `total`,
`pending`, `favorites`, `profileBasePath`, mais seis eventos de volta.

**Escolha.** `pinia` é singleton compartilhado pelo Module Federation. Então o remote define as
próprias stores e os componentes expostos as consomem direto, sem prop e sem evento. O host monta
`<RemoteCatalogCatalogView />` e nada mais.

**Por quê.** Com store global, prop e evento eram só uma camada de repasse: o mesmo dado saía da
store, virava prop, voltava como evento e caía na store de novo. Também obrigava o container a
duplicar toda a camada de dados do catálogo.

**Custo.** O host não enxerga o estado do catálogo. Para o SEO, o remote publica título, descrição
e JSON-LD na store `pageMeta` de `@atlas/contracts`, e o container lê de lá.

**Regra que continua valendo.** Componente exposto não usa composable do Nuxt: o runtime do Nuxt
não é compartilhado, só `vue`, `vue-router` e `pinia`.

---

## 8. Favoritos em `localStorage`

**Escolha.** Store Pinia hidratada de `localStorage` por um plugin client-side.

**Por quê.** Não há sessão de usuário no escopo do desafio. Persistir localmente entrega o valor da
feature sem inventar autenticação.

**Custo.** Não sincroniza entre dispositivos. Trocar por API é substituir o `init`/`persist` da
store.

---

## 9. Sem amarrar o gerenciador de pacotes

**Contexto.** O monorepo começou com pnpm fixado em `packageManager` e Turborepo orquestrando as
tarefas.

**Problema.** O Turborepo exige `devEngines.packageManager` declarado **e** casando com o lockfile
presente. Isso obriga quem clona a usar exatamente o gerenciador declarado.

**Escolha.** Sem Turborepo. `workspaces` no `package.json` (entendido por npm, yarn e pnpm) e
scripts de raiz que chamam os binários locais com `npx`. `concurrently` sobe os três projetos em
paralelo.

**Custo.** Perde-se o cache de build e o grafo de tarefas do Turborepo. Para quatro projetos e uma
dependência de build entre eles, o `&&` resolve.

---

## 10. Rotas modulares em vez do scan de `pages/`

**Escolha.** Cada módulo declara suas rotas em `modules/<mod>/router/routes.ts`, agregadas por
`pages:extend`.

**Por quê.** O scan por pasta obrigaria `pages/` a espelhar a URL, partindo a feature entre duas
árvores. Com o hook, a rota mora ao lado da página e ganha `name` obrigatório, o que permite a
regra de navegar sempre por nome.

**Custo.** Perde-se o roteamento por convenção. Ganha-se rota nomeada e feature coesa.
