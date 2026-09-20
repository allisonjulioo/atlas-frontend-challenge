# Arquitetura, Atlas

Catálogo de profissionais autônomos dividido em quatro entregáveis independentes, ligados por
Module Federation e por um contrato TypeScript compartilhado.

| Projeto         | Papel                                | Porta | Stack                   |
| --------------- | ------------------------------------ | ----- | ----------------------- |
| `container`     | Host Module Federation (`shell`)     | 3000  | Nuxt 4, Vue 3, Pinia    |
| `api`           | API de leitura do catálogo           | 3001  | PHP 8.3+, Slim 4        |
| `app`           | Remote Module Federation (`catalog`) | 3002  | Nuxt 4, Vue 3, Pinia    |
| `design-system` | Remote Module Federation (`ui`)      | 3003  | Nuxt 4, Vue 3, Tailwind |
| `contracts`     | Contrato TS compartilhado            | ,     | TypeScript + Pinia      |

## Leia nesta ordem

1. [project-structure.md](project-structure.md), stack e estrutura de pastas
2. [code-style.md](code-style.md), padrões de código
3. [module-federation.md](module-federation.md), o grafo de remotes e seus limites
4. [state-management.md](state-management.md), stores Pinia
5. [services.md](services.md), camada de API
6. [routing.md](routing.md), rotas modulares
7. [styling.md](styling.md), Tailwind, SCSS e tokens
8. [design-system.md](design-system.md), componentes e distribuição
9. [api.md](api.md), contrato HTTP e dataset
10. [performance.md](performance.md), Core Web Vitals

As decisões com trade-off registrado estão em [../decisions.md](../decisions.md).

## Fluxo de uma requisição

```
navegador → container (SSR)
              ├── busca dados na api (PHP)
              ├── carrega catalog/CatalogView  ← remote app
              └── carrega ui/Logo, ui/Button   ← remote design-system
```

O container é dono do shell: rota, layout, `<head>` e tratamento de erro. O remote `catalog` é
dono da feature inteira, busca, estado e interação, em stores Pinia próprias. A ponte entre os
dois é a store `pageMeta` de `@atlas/contracts`: o remote publica o que a página significa, o
container transforma isso em `<title>`, `description` e JSON-LD.
