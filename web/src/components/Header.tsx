import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrolled } from '../hooks/useScrolled';
import { Icon } from './Icon';

const LOGO = `${import.meta.env.BASE_URL}logo-itau.svg`;

const MENU = [
  {
    titulo: 'Para você',
    itens: [
      { nome: 'Conta corrente', link: '/abra-sua-conta' },
      { nome: 'Cartões de crédito', link: '/cartoes' },
      { nome: 'Empréstimos e Financiamentos', link: '/emprestimos' },
      { nome: 'Encontre agências', link: '/agencias' },
    ],
  },
  {
    titulo: 'Segmentos',
    itens: [
      { nome: 'Uniclass', link: '/' },
      { nome: 'Personnalité', link: '/' },
      { nome: 'Private Bank', link: '/' },
    ],
  },
  {
    titulo: 'Empresas',
    itens: [
      { nome: 'Conta PJ', link: '/' },
      { nome: 'Maquininha', link: '/' },
    ],
  },
];

const MAIS_ACESSOS = ['Itaú Uniclass', 'Itaú Personnalité', 'Itaú Empresas', 'Não correntista'];

/** Equivalente a app/partials/header.html + HeaderController (+ `menuAberto` do $rootScope). */
export function Header() {
  const [maisAcessosAberto, setMaisAcessosAberto] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const rolou = useScrolled(10);
  const fecharMenu = () => setMenuAberto(false);

  return (
    <header className={`site-header${rolou ? ' header-scrolled' : ''}`}>
      <div className="container">
        <div className="header-inner">
          <Link to="/" className="header-logo" aria-label="Página inicial">
            <img src={LOGO} alt="Itaú" width={44} height={44} />
          </Link>
          <div className="header-acoes">
            <Link to="/abra-sua-conta" className="btn btn-outline-white oculto-xs">
              Abra sua conta
            </Link>
            <button
              type="button"
              className="btn-icone"
              aria-label="Mais acessos"
              aria-expanded={maisAcessosAberto}
              onClick={() => setMaisAcessosAberto((aberto) => !aberto)}
            >
              <Icon nome="user" />
            </button>
            <button
              type="button"
              className="btn-icone btn-hamburger"
              aria-label="Menu de navegação"
              aria-expanded={menuAberto}
              onClick={() => setMenuAberto((aberto) => !aberto)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      {maisAcessosAberto && (
        <div className="mais-acessos">
          <div className="container">
            <div className="alert alert-warning demo-aviso" role="status">
              <strong>Ambiente de demonstração.</strong> O acesso à conta está desabilitado neste
              projeto.
            </div>
            <ul className="lista-inline mais-acessos-lista">
              {MAIS_ACESSOS.map((nome) => (
                <li key={nome}>
                  <Link to="/">{nome}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {menuAberto && <div className="menu-overlay" onClick={fecharMenu} aria-hidden="true" />}
      <nav
        className={`menu-lateral${menuAberto ? ' aberto' : ''}`}
        aria-label="Menu principal"
        aria-hidden={!menuAberto}
      >
        <button
          type="button"
          className="fechar"
          aria-label="Fechar menu"
          onClick={fecharMenu}
          tabIndex={menuAberto ? undefined : -1}
        >
          &times;
        </button>
        {MENU.map((grupo) => (
          <div key={grupo.titulo} className="menu-grupo">
            <h4>{grupo.titulo}</h4>
            <ul className="lista-limpa">
              {grupo.itens.map((item) => (
                <li key={item.nome}>
                  <Link to={item.link} onClick={fecharMenu} tabIndex={menuAberto ? undefined : -1}>
                    {item.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </header>
  );
}
