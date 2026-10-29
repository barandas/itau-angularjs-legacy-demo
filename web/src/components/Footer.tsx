import { Link } from 'react-router-dom';

const LOGO = `${import.meta.env.BASE_URL}logo-itau.svg`;

const COLUNAS = [
  {
    titulo: 'Nossos produtos',
    itens: [
      ['Conta corrente', '/abra-sua-conta'],
      ['Cartões de crédito', '/cartoes'],
      ['Empréstimos e Financiamentos', '/emprestimos'],
      ['Consórcio', '/'],
      ['Seguros', '/'],
      ['Investimentos', '/'],
      ['Renegociação', '/emprestimos'],
    ],
  },
  {
    titulo: 'Itaú',
    itens: [
      ['Relações com investidores', '/'],
      ['feito.itaú', '/'],
      ['Carreiras', '/'],
      ['Imprensa', '/'],
      ['Sustentabilidade', '/'],
      ['Termos de uso', '/'],
      ['Privacidade', '/'],
    ],
  },
  {
    titulo: 'Ajuda',
    itens: [
      ['Central de ajuda', '/'],
      ['Canais Itaú', '/'],
      ['Encontre agências', '/agencias'],
      ['Segurança', '/'],
      ['Acessos não correntista', '/'],
    ],
  },
] as const;

const SOCIAIS = [
  ['Instagram', 'IG'],
  ['YouTube', 'YT'],
  ['Facebook', 'FB'],
  ['X', 'X'],
] as const;

interface FooterProps {
  tituloPagina: string;
}

/** Equivalente a app/partials/footer.html (+ `anoAtual` do MainController). */
export function Footer({ tituloPagina }: FooterProps) {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <nav aria-label="Você está aqui">
          <ol className="breadcrumb footer-breadcrumb">
            <li>
              <Link to="/">Itaú</Link>
            </li>
            <li className="ativo" aria-current="page">
              Você está aqui: {tituloPagina}
            </li>
          </ol>
        </nav>

        <div className="footer-colunas">
          {COLUNAS.map((coluna) => (
            <div key={coluna.titulo}>
              <h5>{coluna.titulo}</h5>
              <ul className="lista-limpa">
                {coluna.itens.map(([nome, link]) => (
                  <li key={nome}>
                    <Link to={link}>{nome}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h5>Fale com o Itaú</h5>
            <ul className="lista-limpa footer-contatos">
              <li>
                <Link to="/">Para você</Link>
              </li>
              <li>
                <Link to="/">SAC</Link>
                <p>0000 000 0000</p>
              </li>
              <li>
                <Link to="/">Ouvidoria</Link>
                <p>0000 000 0000</p>
              </li>
            </ul>
            <h5 className="footer-sub">Acompanhe</h5>
            <ul className="lista-inline footer-sociais">
              {SOCIAIS.map(([nome, sigla]) => (
                <li key={nome}>
                  <Link to="/" aria-label={nome}>
                    {sigla}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-base">
          <img src={LOGO} alt="Itaú" width={40} height={40} />
          <div>
            <p>
              &copy; {anoAtual} Projeto de demonstração.{' '}
              <strong>Não possui qualquer vínculo com o Itaú Unibanco.</strong>
            </p>
            <p className="texto-suave">
              Clone visual reconstruído em React a partir da versão AngularJS 1.x, para fins de
              demonstração de migração de front-end. Dados, telefones e endereços são fictícios.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
