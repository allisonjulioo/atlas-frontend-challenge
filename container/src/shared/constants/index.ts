export const PROFILE_BASE_PATH = '/profissionais'

export const REPO_URL = 'https://github.com/allisonjulioo/atlas-frontend-challenge'

export const ROUTE_NAME = {
  catalogList: 'catalog-list',
  professionalProfile: 'professional-profile',
} as const

export const APP_LOADER_FADE_MS = 240

export const APP_LOADER_STYLE = `
.app-loader{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;
justify-content:center;gap:16px;background:rgb(244 248 250);opacity:1;transition:opacity ${APP_LOADER_FADE_MS}ms cubic-bezier(0.22,1,0.36,1)}
.app-loader--faded{opacity:0}
.app-loader__spinner{width:36px;height:36px;border-radius:9999px;border:3px solid rgb(203 222 232);
border-top-color:rgb(45 62 80);animation:app-loader-spin 700ms linear infinite}
.app-loader__text{font:600 13px/1 ui-sans-serif,system-ui,sans-serif;color:rgb(107 128 145)}
@keyframes app-loader-spin{to{transform:rotate(360deg)}}
`
