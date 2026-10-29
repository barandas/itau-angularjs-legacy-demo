import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { Layout, TITULO_PADRAO, type RouteHandle } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { PendingMigrationPage } from './pages/PendingMigrationPage';

/** Rotas de app/app.routes.js ainda não migradas (mantidas para os links da Home funcionarem). */
const ROTAS_PENDENTES = [
  { path: 'cartoes', title: 'Cartões de crédito' },
  { path: 'emprestimos', title: 'Empréstimos e Financiamentos' },
  { path: 'agencias', title: 'Encontre agências' },
  { path: 'abra-sua-conta', title: 'Abra sua conta' },
];

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
        handle: { title: TITULO_PADRAO } satisfies RouteHandle,
      },
      ...ROTAS_PENDENTES.map(({ path, title }) => ({
        path,
        element: <PendingMigrationPage titulo={title} caminhoLegado={`/${path}`} />,
        handle: { title } satisfies RouteHandle,
      })),
      // Equivalente ao `.otherwise({ redirectTo: '/' })` do ngRoute.
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(routes, { basename: import.meta.env.BASE_URL });
}
