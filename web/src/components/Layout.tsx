import { useEffect } from 'react';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

export const TITULO_PADRAO = 'Abra sua conta no Banco Itaú';

export interface RouteHandle {
  title?: string;
}

/**
 * Shell da aplicação (equivalente ao index.html + MainController + run block do app.module.js):
 * header, conteúdo da rota, footer, título da página e scroll ao topo a cada navegação.
 */
export function Layout() {
  const matches = useMatches();
  const { pathname } = useLocation();
  const titulo =
    matches
      .map((match) => (match.handle as RouteHandle | undefined)?.title)
      .filter(Boolean)
      .pop() ?? TITULO_PADRAO;

  useEffect(() => {
    document.title = `${titulo} | Itaú (demo)`;
  }, [titulo]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <main id="conteudo" className="site-main">
        <Outlet />
      </main>
      <Footer tituloPagina={titulo} />
    </>
  );
}
