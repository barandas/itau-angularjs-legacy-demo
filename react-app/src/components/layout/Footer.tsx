import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

interface FooterProps {
  pageTitle: string;
}

export function Footer({ pageTitle }: FooterProps) {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <ol className={styles.breadcrumb}>
          <li><Link to="/">Itaú</Link></li>
          <li className={styles.current}>Você está aqui: {pageTitle}</li>
        </ol>

        <div className={styles.columns}>
          <div>
            <h2>Nossos produtos</h2>
            <ul>
              <li><Link to="/abra-sua-conta">Conta corrente</Link></li>
              <li><Link to="/cartoes">Cartões de crédito</Link></li>
              <li><Link to="/emprestimos">Empréstimos e Financiamentos</Link></li>
              <li><Link to="/">Consórcio</Link></li>
              <li><Link to="/">Seguros</Link></li>
              <li><Link to="/">Investimentos</Link></li>
              <li><Link to="/emprestimos">Renegociação</Link></li>
            </ul>
          </div>
          <div>
            <h2>Itaú</h2>
            <ul>
              <li><Link to="/">Relações com investidores</Link></li>
              <li><Link to="/">feito.itaú</Link></li>
              <li><Link to="/">Carreiras</Link></li>
              <li><Link to="/">Imprensa</Link></li>
              <li><Link to="/">Sustentabilidade</Link></li>
              <li><Link to="/">Termos de uso</Link></li>
              <li><Link to="/">Privacidade</Link></li>
            </ul>
          </div>
          <div>
            <h2>Ajuda</h2>
            <ul>
              <li><Link to="/">Central de ajuda</Link></li>
              <li><Link to="/">Canais Itaú</Link></li>
              <li><Link to="/agencias">Encontre agências</Link></li>
              <li><Link to="/">Segurança</Link></li>
              <li><Link to="/">Acessos não correntista</Link></li>
            </ul>
          </div>
          <div>
            <h2>Fale com o Itaú</h2>
            <ul className={styles.contacts}>
              <li><Link to="/">Para você</Link></li>
              <li><Link to="/">SAC</Link><p>0000 000 0000</p></li>
              <li><Link to="/">Ouvidoria</Link><p>0000 000 0000</p></li>
            </ul>
            <h2 className={styles.subheading}>Acompanhe</h2>
            <ul className={styles.socials}>
              <li><Link to="/" aria-label="Instagram">IG</Link></li>
              <li><Link to="/" aria-label="YouTube">YT</Link></li>
              <li><Link to="/" aria-label="Facebook">FB</Link></li>
              <li><Link to="/" aria-label="X">X</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.base}>
          <img src="/assets/img/logo-itau.svg" alt="Itaú" width="40" height="40" />
          <div>
            <p>
              &copy; {anoAtual} Projeto de demonstração.{' '}
              <strong>Não possui qualquer vínculo com o Itaú Unibanco.</strong>
            </p>
            <p className={styles.disclaimer}>
              Clone visual construído em AngularJS 1.x para fins de demonstração
              de migração de front-end. Dados, telefones e endereços são fictícios.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
