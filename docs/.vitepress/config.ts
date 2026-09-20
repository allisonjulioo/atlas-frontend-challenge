import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Atlas',
  description: 'Documentação do catálogo de profissionais autônomos',
  lang: 'pt-BR',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/allisonjulioo/atlas-frontend-challenge' },
    ],
    nav: [
      { text: 'Container', link: 'http://localhost:3000', target: '_blank' },
      { text: 'API', link: 'http://localhost:3001/professionals', target: '_blank' },
      { text: 'Design system', link: 'http://localhost:6006', target: '_blank' },
    ],
    sidebar: [
      {
        text: 'Arquitetura',
        items: [
          { text: 'Visão geral', link: '/architecture/' },
          { text: 'Estrutura do projeto', link: '/architecture/project-structure' },
          { text: 'Code style', link: '/architecture/code-style' },
          { text: 'Module Federation', link: '/architecture/module-federation' },
          { text: 'Camada compartilhada', link: '/architecture/shared-layer' },
          { text: 'Gerenciamento de estado', link: '/architecture/state-management' },
          { text: 'Camada de serviços', link: '/architecture/services' },
          { text: 'Rotas', link: '/architecture/routing' },
          { text: 'Estilização', link: '/architecture/styling' },
          { text: 'Design system', link: '/architecture/design-system' },
          { text: 'API', link: '/architecture/api' },
          { text: 'Performance', link: '/architecture/performance' },
        ],
      },
      {
        text: 'Referência',
        items: [
          { text: 'Decisões técnicas', link: '/decisions' },
          { text: 'Desafio', link: '/challenge' },
        ],
      },
    ],
    outline: [2, 3],
    docFooter: { prev: 'Anterior', next: 'Próximo' },
    darkModeSwitchLabel: 'Tema',
    returnToTopLabel: 'Voltar ao topo',
    sidebarMenuLabel: 'Menu',
  },
})
