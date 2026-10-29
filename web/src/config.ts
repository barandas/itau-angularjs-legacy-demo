/** Equivalente ao `APP_CONFIG` de app/app.module.js. */
export const APP_CONFIG = {
  apiBase: import.meta.env.VITE_API_BASE ?? `${import.meta.env.BASE_URL}data/`,
  carouselInterval: 6000,
  /** App AngularJS legado, usado para as rotas ainda não migradas. */
  legacyAppUrl: import.meta.env.VITE_LEGACY_APP_URL ?? 'http://localhost:8080/',
} as const;
