# Performance e Core Web Vitals

## LCP

O LCP da home é a foto do primeiro card.

- Os quatro primeiros cards recebem `loading="eager"` e `fetchpriority="high"`; o resto entra em
  `lazy`. `PRIORITY_CARD_COUNT` está em `modules/catalog/utils/constants.ts`.
- A primeira página da listagem é renderizada no servidor e viaja no payload do Pinia. A hidratação
  não refaz a requisição.
- O container abre `preconnect` para a origem dos dois remotes e `dns-prefetch` para o CDN de
  imagem. O remote é outra origem: abrir a conexão TLS junto com o HTML tira um round-trip do
  caminho crítico do primeiro componente federado.

## CLS

- Toda imagem tem `width` e `height` explícitos. O card usa `aspect-ratio: 3/4` na área de mídia.
- `SkeletonCard` tem exatamente a mesma caixa do `ProfessionalCard`. Esqueleto de altura diferente
  produz o CLS que ele deveria evitar.
- O `Avatar` cai para iniciais quando a imagem falha, mantendo a mesma caixa.

## INP

- A busca tem debounce de 300 ms: uma requisição por palavra, não por tecla.
- O filtro escreve na URL com `replace` quando a mudança é de alta frequência e `push` no resto.
- O drawer de filtro no mobile usa `<dialog>` nativo: foco preso, `Esc` e backdrop sem JavaScript
  próprio.
- Os cards usam `content-visibility: auto` com `contain-intrinsic-size`. Em lista longa é a
  otimização de maior retorno: o navegador pula a renderização do que está fora da viewport e o
  scroll não salta.

## Rede

- `/professionals` devolve apenas `ProfessionalSummary`, não o perfil completo.
- `perPage` é limitado a 48 no contrato, nos dois lados.
- A listagem tem `stale-while-revalidate` de 300s na borda; o perfil, 3600s.
- O container comprime o output estático com Brotli e gzip.

## Carregamento

- Scroll infinito com `IntersectionObserver` disparando 400px antes do fim, e botão real por baixo:
  sem ele, quem navega por teclado ou tem JavaScript bloqueado fica preso na primeira página.
- `page` fica fora da URL. Um link compartilhado abre no começo do resultado e o SSR não precisa
  buscar N páginas para reconstruir a tela.
- Voltar do perfil para a listagem devolve a lista acumulada do store, sem nova requisição.

## SEO

- `<title>` e `description` acompanham o filtro: uma busca por "eletricista" não compete com a home
  pelo mesmo termo.
- Listagem filtrada é `noindex,follow` com canônica na home, para não fragmentar a indexação em
  infinitas variações da mesma lista.
- O perfil tem JSON-LD `ProfessionalService` com nota, contagem de avaliações, preço e área
  atendida.
- O card é um `<a href>` real: rastreável e funcional sem JavaScript.

## Acessibilidade

- Skip link como primeiro elemento focável.
- Contador de resultado em `aria-live="polite"`.
- Alvo de toque mínimo de 44px.
- Foco visível com `ring` em link e botão. Em campo de formulário o anel foi removido a pedido do
  design; o estado de foco fica na sombra do próprio campo.
- `prefers-reduced-motion` desliga transição e animação.
- Favorito é `<button aria-pressed>` com rótulo que nomeia o profissional.

## O que não foi feito

- Não há virtualização de lista. Com 24 itens por página e `content-visibility`, o ganho não paga a
  complexidade e o custo de acessibilidade.
- Não há `@nuxt/image`. As fotos vêm de CDN externa já dimensionada; um proxy de imagem
  acrescentaria um salto de rede sem ganho claro.
- Não há medição real de Web Vitals em produção. O gancho existe: instrumentar `onLCP`/`onINP` com
  `web-vitals` no plugin do container é a evolução natural.
