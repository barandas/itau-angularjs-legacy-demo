import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { routeTitles } from '../../routes';
import { CookieBanner } from './CookieBanner';
import { Footer } from './Footer';
import { Header } from './Header';
import { WhatsAppButton } from './WhatsAppButton';

export function Layout() {
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const pageTitle = routeTitles[location.pathname] ?? routeTitles['/'];

  useEffect(() => {
    document.title = `${pageTitle} | Itaú (demo)`;
    setMenuAberto(false);
    window.scrollTo(0, 0);
  }, [location.pathname, pageTitle]);

  return (
    <>
      <Header
        menuAberto={menuAberto}
        onAlternarMenu={() => setMenuAberto((aberto) => !aberto)}
      />
      <main id="conteudo" className="site-main">
        <Outlet />
      </main>
      <Footer pageTitle={pageTitle} />
      <CookieBanner />
      <WhatsAppButton />
    </>
  );
}
