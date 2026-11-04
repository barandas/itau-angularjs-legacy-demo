import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

interface HeaderProps {
  menuAberto: boolean;
  onAlternarMenu: () => void;
}

const gruposMenu = [
  {
    titulo: 'Para você',
    itens: [
      { nome: 'Conta corrente', to: '/abra-sua-conta' },
      { nome: 'Cartões de crédito', to: '/cartoes' },
      { nome: 'Empréstimos e Financiamentos', to: '/emprestimos' },
      { nome: 'Encontre agências', to: '/agencias' }
    ]
  },
  {
    titulo: 'Segmentos',
    itens: [
      { nome: 'Uniclass', to: '/' },
      { nome: 'Personnalité', to: '/' },
      { nome: 'Private Bank', to: '/' }
    ]
  },
  {
    titulo: 'Empresas',
    itens: [
      { nome: 'Conta PJ', to: '/' },
      { nome: 'Maquininha', to: '/' }
    ]
  }
];

export function Header({ menuAberto, onAlternarMenu }: HeaderProps) {
  const [maisAcessosAberto, setMaisAcessosAberto] = useState(false);
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const atualizarRolagem = () => setRolou(window.scrollY > 10);
    window.addEventListener('scroll', atualizarRolagem, { passive: true });
    atualizarRolagem();
    return () => window.removeEventListener('scroll', atualizarRolagem);
  }, []);

  return (
    <header className={`${styles.header} ${rolou ? styles.scrolled : ''}`}>
      <div className="container">
        <div className={styles.inner}>
          <Link to="/" className={styles.logo} aria-label="Página inicial">
            <img src="/assets/img/logo-itau.svg" alt="Itaú" width="44" height="44" />
          </Link>
          <div className={styles.actions}>
            <Link
              to="/abra-sua-conta"
              className="btn btn-outline-white"
              aria-label="Abra sua conta"
            >
              Abra sua conta
            </Link>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Mais acessos"
              aria-expanded={maisAcessosAberto}
              onClick={() => setMaisAcessosAberto((aberto) => !aberto)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
              </svg>
            </button>
            <button
              type="button"
              className={`${styles.iconButton} ${styles.hamburger}`}
              aria-label="Menu de navegação"
              aria-expanded={menuAberto}
              aria-controls="menu-principal"
              onClick={onAlternarMenu}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      {maisAcessosAberto && (
        <div className={styles.moreAccess}>
          <div className="container">
            <div className={styles.demoNotice} role="status">
              <strong>Ambiente de demonstração.</strong> O acesso à conta está
              desabilitado neste projeto.
            </div>
            <ul className={styles.moreAccessLinks}>
              <li><Link to="/">Itaú Uniclass</Link></li>
              <li><Link to="/">Itaú Personnalité</Link></li>
              <li><Link to="/">Itaú Empresas</Link></li>
              <li><Link to="/">Não correntista</Link></li>
            </ul>
          </div>
        </div>
      )}

      {menuAberto && (
        <div
          className={styles.overlay}
          aria-hidden="true"
          onClick={onAlternarMenu}
        />
      )}
      <nav
        id="menu-principal"
        className={`${styles.sideMenu} ${menuAberto ? styles.sideMenuOpen : ''}`}
        aria-label="Menu principal"
        aria-hidden={!menuAberto}
      >
        <button
          type="button"
          className={styles.close}
          aria-label="Fechar menu"
          onClick={onAlternarMenu}
        >
          &times;
        </button>
        {gruposMenu.map((grupo) => (
          <section className={styles.menuGroup} key={grupo.titulo}>
            <h2>{grupo.titulo}</h2>
            <ul>
              {grupo.itens.map((item) => (
                <li key={item.nome}>
                  <Link to={item.to} onClick={onAlternarMenu}>{item.nome}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </header>
  );
}
