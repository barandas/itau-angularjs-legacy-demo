import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import { CardCarousel } from '../components/CardCarousel';
import { CardCartao } from '../components/CardCartao';
import { CardDestaque } from '../components/CardDestaque';
import { HeroCarousel } from '../components/HeroCarousel';
import { useApi } from '../hooks/useApi';
import { maisPedidos } from '../lib/cartoes';
import type { Atalho, Banner, Cartao, Destaque, Produto } from '../types';
import styles from './Home.module.css';

const apps = [
  { nome: 'Itaú', classe: 'app-itau' },
  { nome: 'Itaú Personnalité', classe: 'app-personnalite' },
  { nome: 'Itaú Empresas', classe: 'app-empresas' }
];

const icones: Record<string, ReactNode> = {
  'glyphicon-barcode': (
    <path
      d="M4 5v14m3-14v14m3-14v14m4-14v14m3-14v14m3-14v14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  ),
  'glyphicon-credit-card': (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18M6 14h4" fill="none" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  'glyphicon-phone': (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M10 18h4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  'glyphicon-file': (
    <>
      <path d="M6 2.5h8l4 4v15H6z" />
      <path d="M14 2.5v5h4M9 12h6M9 15h6" fill="none" stroke="#fff" strokeWidth="1.5" />
    </>
  ),
  'glyphicon-list-alt': (
    <>
      <path d="M5 4h3v3H5zM10 4h9v2H10zM5 10h3v3H5zM10 10h9v2H10zM5 16h3v3H5zM10 16h9v2H10z" />
    </>
  ),
  'glyphicon-question-sign': (
    <text x="12" y="20" textAnchor="middle" fontSize="20" fontWeight="700">?</text>
  ),
  'glyphicon-refresh': (
    <path d="M17.65 6.35A8 8 0 0 0 4 12h2a6 6 0 0 1 10.24-4.24L13 11h7V4zM18 12a6 6 0 0 1-10.24 4.24L11 13H4v7l2.35-2.35A8 8 0 0 0 20 12z" />
  ),
  'glyphicon-usd': (
    <text x="12" y="20" textAnchor="middle" fontSize="20" fontWeight="700">$</text>
  ),
  'glyphicon-transfer': (
    <path d="M3 7h14l-3-3 1.4-1.4L21 8l-5.6 5.4L14 12l3-3H3zm18 10H7l3 3-1.4 1.4L3 16l5.6-5.4L10 12l-3 3h14z" />
  )
};

function Icone({ nome, className }: { nome: string; className?: string }) {
  return (
    <svg
      className={`${styles.icon} ${className ?? ''}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {icones[nome] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}

function converterRota(link: string): string {
  return link.startsWith('#!') ? link.slice(2) : link;
}

export function Home() {
  const navigate = useNavigate();
  const [termo, setTermo] = useState('');
  const banners = useApi<Banner[]>('banners');
  const atalhos = useApi<Atalho[]>('atalhos');
  const produtos = useApi<Produto[]>('produtos');
  const destaques = useApi<Destaque[]>('destaques');
  const cartoes = useApi<Cartao[]>('cartoes');
  const carregando = [
    banners.loading,
    atalhos.loading,
    produtos.loading,
    destaques.loading,
    cartoes.loading
  ].some(Boolean);
  const erro = [
    banners.error,
    atalhos.error,
    produtos.error,
    destaques.error,
    cartoes.error
  ].some(Boolean);

  const buscarAgencia = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = termo ? `?${createSearchParams({ q: termo })}` : '';
    navigate({ pathname: '/agencias', search });
  };

  return (
    <div className={styles.home}>
      {carregando && (
        <div className={styles.loading} role="status">
          <span className={styles.spinner} />
          Carregando...
        </div>
      )}
      {erro && (
        <div className={`container ${styles.error}`} role="alert">
          Não foi possível carregar o conteúdo. Tente novamente.
        </div>
      )}

      {banners.data && <HeroCarousel banners={banners.data} />}

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Resolva as questões do dia a dia</h2>
          <ul className={styles.shortcutsList}>
            {(atalhos.data ?? []).map((atalho) => (
              <li key={atalho.titulo}>
                <Link
                  to={converterRota(atalho.link)}
                  className={styles.shortcut}
                  aria-label={`${atalho.titulo} ${atalho.descricao}`}
                >
                  <Icone nome={atalho.icone} className={styles.shortcutIcon} />
                  <strong>{atalho.titulo}</strong>
                  <span className={styles.shortcutDescription}>{atalho.descricao}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${styles.section} ${styles.productsSection}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Contrate nossos produtos online</h2>
          <p className={styles.sectionSubtitle}>
            Confira as soluções que o banco Itaú oferece para você.
          </p>
          <div className={styles.productsGrid}>
            {(produtos.data ?? []).map((produto, index) => (
              <div className={styles.productCell} key={produto.id}>
                <article
                  className={`${styles.productCard} ${index < 2 ? styles.productCardLarge : ''}`}
                >
                  <div className={styles.productText}>
                    <span className={styles.productCategory}>
                      <Icone nome={produto.icone} /> {produto.categoria}
                    </span>
                    <h3>{produto.titulo}</h3>
                    <p>{produto.descricao}</p>
                    <Link to={converterRota(produto.link)} className="link-seta">
                      {produto.cta} <span>&rsaquo;</span>
                    </Link>
                  </div>
                  <div
                    className={styles.productImage}
                    style={{ backgroundColor: produto.cor }}
                    aria-hidden="true"
                  >
                    <Icone nome={produto.icone} className={styles.productImageIcon} />
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            Confira nossos cartões de crédito mais pedidos da semana
          </h2>
          <CardCarousel
            itens={maisPedidos(cartoes.data ?? [])}
            porPagina={3}
            renderItem={(item) => <CardCartao item={item} />}
          />
        </div>
      </section>

      <section className={`${styles.section} ${styles.highlightsSection}`}>
        <div className="container">
          <span className={styles.madeTag}>@ feito.itaú</span>
          <h2 className={styles.sectionTitle}>
            Confira os principais destaques do feito.itaú que separamos para você
          </h2>
          <CardCarousel
            itens={destaques.data ?? []}
            porPagina={3}
            renderItem={(item) => <CardDestaque item={item} />}
          />
          <div className={styles.center}>
            <Link to="/" className="btn btn-outline-navy">Acesse o feito.itaú</Link>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.appsSection}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Resolva tudo pelos apps</h2>
          <p className={styles.sectionSubtitle}>
            Com os nossos aplicativos, você faz tudo pelo seu celular!
          </p>
          <ul className={styles.appsList}>
            {apps.map((app) => (
              <li key={app.nome}>
                <Link
                  to="/"
                  className={`${styles.appIcon} ${styles[app.classe]}`}
                  aria-label={`logo ${app.nome}`}
                >
                  itaú
                </Link>
                <span>{app.nome}</span>
              </li>
            ))}
          </ul>
          <Link to="/agencias" className="link-seta">
            Conheça os canais <span>&rsaquo;</span>
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.agencyBox}>
            <span className={styles.productCategory}>
              <span className={styles.agencyIcon} aria-hidden="true">⌖</span> Agências
            </span>
            <h2>Qual a agência Itaú mais próxima?</h2>
            <form className={styles.agencyForm} onSubmit={buscarAgencia}>
              <label htmlFor="busca-agencia">Busque por endereço, agência, CEP</label>
              <div className={styles.inputGroup}>
                <span className={styles.searchIcon} aria-hidden="true">⌕</span>
                <input
                  id="busca-agencia"
                  name="address"
                  type="text"
                  value={termo}
                  onChange={(event) => setTermo(event.target.value)}
                  placeholder="Ex.: Av. Paulista, 0350, 01310-100"
                />
                <button className="btn btn-itau" type="submit">Buscar</button>
              </div>
              <Link to="/agencias" className={styles.locationLink}>
                <span aria-hidden="true">⌖</span> Usar minha localização atual
              </Link>
            </form>
          </div>
        </div>
      </section>

      <Link to="/abra-sua-conta" className={styles.openAccountBar}>
        <span aria-hidden="true">▣</span> Abra sua conta
      </Link>
    </div>
  );
}
