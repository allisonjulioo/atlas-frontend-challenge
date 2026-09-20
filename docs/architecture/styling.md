# Estilização

## Abordagem

1. **Tailwind CSS** para layout, espaçamento, tipografia e cor
2. **SCSS com BEM** para a estrutura do componente
3. **Tokens em variáveis CSS** para permitir tema claro e escuro sem recompilar

Na prática: classe BEM no SCSS, utilitário Tailwind via `@apply`.

```scss
.atlas-card {
  @apply relative flex flex-col overflow-hidden rounded-card border border-line bg-surface;

  &__name {
    @apply text-base font-semibold text-white;
  }

  &--featured {
    @apply border-accent-500;
  }
}
```

Nunca cor fixa (`#hex`, `rgba`) no componente. Só classe do preset. E nunca `text-transform:
uppercase`: o texto é escrito como deve ser lido.

## Paleta

Cinco cores, e só elas. Nenhum tom fora desta lista, nenhuma escala gerada.

| Token       | Hex       | Papel                                            |
| ----------- | --------- | ------------------------------------------------ |
| Dusk Blue   | `#3d5a80` | `brand`, ação primária, links, foco              |
| Powder Blue | `#98c1d9` | `brand-soft` e `line`, apoio e divisórias        |
| Light Cyan  | `#e0fbfc` | `surface-soft`, superfície de apoio, chip, campo |
| Burnt Peach | `#ee6c4d` | `accent`, CTA, estrela, selo de destaque         |
| Jet Black   | `#293241` | `ink` e `content`, texto                         |

Branco é a superfície dos cards. O canvas da página é um cinza claro
(`--atlas-canvas`), única exceção neutra, para o card branco ter contraste sem borda.

Para texto secundário há duas tintas de Jet Black, `graphite` e `lead`, que só sobem a
luminosidade da mesma cor, sem introduzir matiz nova.

## Forma

| Token             | Valor | Onde                                    |
| ----------------- | ----- | --------------------------------------- |
| `rounded-card`    | 8px   | Card, painel, diálogo                   |
| `rounded-control` | 4px   | Botão, campo, select                    |
| `rounded-full`    | ,     | Chip, badge, busca, avatar de navegação |

Sem borda em card, chip, badge, botão e campo. A separação vem de fundo e sombra. Borda só
como divisória (`border-b` no cabeçalho, `border-t` no rodapé, linha entre itens de lista).

## Preset compartilhado

`design-system/tailwind.preset.ts` é a única definição de tema. Cada projeto o carrega:

```ts
export default {
  presets: [atlasPreset],
  content: ['./src/**/*.{vue,ts}', '../design-system/src/**/*.{vue,ts}'],
} satisfies Config
```

O preset mapeia cada cor para `rgb(var(--atlas-...) / <alpha-value>)`. Duas consequências úteis:
`bg-surface/90` e `bg-accent/10` continuam funcionando, e reposicionar a marca é trocar variável
CSS, não reconstruir CSS.

`../design-system/**` entra no `content` porque o `app` empacota componentes do design system em
build, sem isso as classes deles seriam removidas pelo purge.

## Tokens

`design-system/src/assets/styles/tokens.css` define as cinco cores da paleta como canais RGB e,
em seguida, os papéis semânticos que apontam para elas. Um componente nunca referencia
`--atlas-dusk-blue`: usa `bg-brand`.

Só existe tema claro. Não há `data-theme`, `prefers-color-scheme` nem variante `dark:`.

## Escopo

Estilo de componente mora dentro do próprio `.vue`, em `<style lang="scss" scoped>`. Não existe
arquivo SCSS global por feature. O único arquivo global é
`design-system/src/assets/styles/main.scss`, que carrega os tokens, as diretivas do Tailwind e a
camada `base`.

Os três projetos Nuxt carregam esse arquivo via `css: ['@atlas/design-system/styles']`. Cada um
roda o próprio PostCSS sobre ele, então cada bundle recebe só os utilitários que usa.
