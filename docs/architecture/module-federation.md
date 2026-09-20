# Module Federation

## O grafo

```
container (shell)  ──host──▶  catalog   (app)
                   ──host──▶  ui        (design-system)

app (catalog)      ──build-time──▶  @atlas/design-system
```

O container é o único host em runtime. Ele carrega dois remotes e renderiza os dois no servidor.

O `app` **não** consome `ui` por Module Federation: importa os componentes do design system em
tempo de build, pelo workspace. O motivo está abaixo.

## Por que o grafo é plano

A intenção original era `container → catalog → ui`, com o `app` também consumindo o design system
em runtime. Isso não funciona com `@module-federation/nuxt@0.1.0`: um remote que também é host SSR
de outro remote quebra nos dois modos.

**Em desenvolvimento**, o loader aninhado cai na estratégia `vm` do MF Vite:

```
Failed to load Node.js entry for remote "...__ui", vm.SourceTextModule is not a constructor
```

Rodando o Nitro com `--experimental-vm-modules` o erro muda, mas não some: o `vm` tenta executar o
`remoteEntry` de dev, que o Vite serve como módulo não empacotado (`Unexpected token ':'`).

**Em build de produção**, a checagem de portabilidade do próprio módulo rejeita a saída:

```
Nuxt SSR output _nuxt/ssr-entry-loader-*.js contains non-portable import "file:///...temp.js"
```

O `ssr-entry-loader` que o MF injeta quando um remote consome outro remote carrega um caminho
absoluto da máquina de build, e o plugin bloqueia a publicação.

As saídas possíveis eram: aceitar cards em branco no HTML do servidor (perde LCP e SEO, que são o
ponto do desafio), ou achatar o grafo. Achatamos.

## Consequência prática

O código do design system tem uma fonte só e duas distribuições:

- **Remote `ui`**, `remoteEntry.js` + `remoteEntry.ssr.js`, consumido pelo container em runtime.
  Deploy do DS independente do deploy do host.
- **Pacote `@atlas/design-system`**, importado em build pelo `app`, que empacota sua própria cópia
  dos componentes que usa.

O custo é bytes duplicados entre `catalog` e `ui` no cliente. O ganho é SSR completo em todos os
níveis. Quando o `@module-federation/nuxt` suportar remote aninhado com SSR, trocar o import de
build por `RemoteUi*` no `app` é uma mudança local, porque a fronteira já é prop/evento.

## Contrato entre host e remote

O remote é dono da feature inteira. `CatalogView` e `ProfessionalProfile` não recebem props: eles
consomem as stores Pinia do próprio módulo, que buscam na API, escrevem na URL e navegam pelo
`vue-router` compartilhado.

A ponte com o host é a store `pageMeta` de `@atlas/contracts`:

```
remote  ──▶ usePageMeta().set({ title, description, image, structuredData })
container ──▶ useSeoMeta(() => meta.title) e useHead(json-ld)
```

Os dois bundles carregam a definição da store, mas o id `pageMeta` é o mesmo e `pinia` é singleton
compartilhado, em runtime é a mesma instância.

Regras da fronteira:

- `vue`, `vue-router` e `pinia` são singletons. O runtime do Nuxt **não** é compartilhado.
- Componente exposto nunca usa composable do Nuxt (`useAsyncData`, `useState`, `useHead`,
  `useRuntimeConfig`). Usa `useRoute`/`useRouter` do `vue-router`, que é compartilhado.
- Configuração de ambiente chega pela store `runtimeSettings` de `@atlas/contracts`: cada aplicação
  escreve o `apiBase` do próprio `runtimeConfig` em um plugin, e o remote lê de lá. Chamar
  `useRuntimeConfig()` de dentro do remote devolve vazio e o `$fetch` acaba caindo no roteador do
  host.
- O componente exposto pluga o próprio ciclo de vida (`onServerPrefetch` + `onMounted` chamando o
  `init` da store), porque é ele que o host monta.
- O host não busca dado do catálogo. Ele monta o shell e o `<head>`.

## Dependências compartilhadas

```ts
shared: {
  vue: { singleton: true, requiredVersion: '^3.5.0' },
  'vue-router': { singleton: true, requiredVersion: '^5.1.0' },
  pinia: { singleton: true, requiredVersion: '^4.0.0' },
}
```

Divergência de major entre host e remote nessas três gera aviso no setup e quebra em runtime: o
servidor usa a cópia do host sem negociação de versão.

## CSS dos remotes

O manifesto de cada remote lista os arquivos CSS de cada expose. O container lê esses manifestos no
servidor (`plugins/remote-styles.server.ts`) e injeta um `<link rel="stylesheet">` para cada um, na
origem do remote.

Sem isso o CSS do remote só chegaria junto com o chunk JavaScript, depois da hidratação: o primeiro
paint viria sem estilo e o CLS estouraria.

Em desenvolvimento o manifesto vem com a lista de CSS vazia, porque o Vite injeta estilo de SFC por
JavaScript. O flash existe só no `nuxt dev` e desaparece no build.

## Contrato de deploy

Cada remote publica, na mesma origem pública:

- `/_mf/remoteEntry.js`, entrada do navegador
- `/_mf/remoteEntry.ssr.js`, entrada do servidor
- `/_mf/mf-manifest.json`, manifesto
- `/_nuxt/**`, chunks referenciados pelas duas entradas

O container precisa alcançar essa origem **do navegador e do servidor**. Suba o remote antes do
host que o referencia, e mantenha os assets da versão anterior no ar enquanto houver sessão aberta.

O SSR de remote escreve o grafo baixado em `node_modules/.ssr-cache` abaixo do diretório de
trabalho do processo: precisa de filesystem gravável. Em preset serverless ou read-only, use
`moduleFederation.ssr: false` e aceite render só no cliente.
