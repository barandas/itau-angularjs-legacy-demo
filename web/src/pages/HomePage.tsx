import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { carregarConteudoHome, type ConteudoHome } from '../api/home';
import { CardCarousel } from '../components/CardCarousel';
import { CartaoCard } from '../components/CartaoCard';
import { DestaqueCard } from '../components/DestaqueCard';
import { HeroCarousel } from '../components/HeroCarousel';
import { Icon } from '../components/Icon';
import { ProdutoCard } from '../components/ProdutoCard';
import { legacyHrefToPath } from '../utils/routes';

const APPS = [
  { nome: 'Itaú', classe: 'app-itau' },
  { nome: 'Itaú Personnalité', classe: 'app-personnalite' },
  { nome: 'Itaú Empresas', classe: 'app-empresas' },
];

const CONTEUDO_VAZIO: ConteudoHome = {
  banners: [],
  atalhos: [],
  produtos: [],
  destaques: [],
  cartoesMaisPedidos: [],
};

type Estado =
  { status: 'carregando' } | { status: 'pronto'; conteudo: ConteudoHome } | { status: 'erro' };

/** Rota Home: equivalente a app/views/home.html + app/controllers/home.controller.js. */
export function HomePage() {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<Estado>({ status: 'carregando' });
  const [termoAgencia, setTermoAgencia] = useState('');

  useEffect(() => {
    let ativo = true;
    carregarConteudoHome().then(
      (conteudo) => ativo && setEstado({ status: 'pronto', conteudo }),
      () => ativo && setEstado({ status: 'erro' }),
    );
    return () => {
      ativo = false;
    };
  }, []);

  const conteudo = estado.status === 'pronto' ? estado.conteudo : CONTEUDO_VAZIO;

  const buscarAgencia = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const termo = termoAgencia.trim();
    navigate({
      pathname: '/agencias',
      search: termo ? `?${new URLSearchParams({ q: termo })}` : '',
    });
  };

  return (
    <div className="pagina-home">
      {estado.status === 'carregando' && (
        <div className="texto-centro carregando" role="status">
          <span className="spinner" aria-hidden="true" /> Carregando...
        </div>
      )}
      {estado.status === 'erro' && (
        <div className="container">
          <div className="alert alert-danger" role="alert">
            Não foi possível carregar o conteúdo. Tente novamente.
          </div>
        </div>
      )}

      <HeroCarousel banners={conteudo.banners} />

      <section className="secao secao-atalhos">
        <div className="container">
          <h2 className="titulo-secao">Resolva as questões do dia a dia</h2>
          <ul className="lista-limpa atalhos-lista">
            {conteudo.atalhos.map((atalho) => (
              <li key={atalho.titulo}>
                <Link
                  to={legacyHrefToPath(atalho.link)}
                  className="atalho-card"
                  aria-label={`${atalho.titulo} ${atalho.descricao}`}
                >
                  <Icon nome={atalho.icone} className="atalho-icone" />
                  <strong>{atalho.titulo}</strong>
                  <span className="atalho-desc">{atalho.descricao}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="secao secao-produtos">
        <div className="container">
          <h2 className="titulo-secao">Contrate nossos produtos online</h2>
          <p className="subtitulo-secao">Confira as soluções que o banco Itaú oferece para você.</p>
          <div className="produtos-grade">
            {conteudo.produtos.map((produto, i) => (
              <div key={produto.id} className={i < 2 ? 'produto-coluna-grande' : 'produto-coluna'}>
                <ProdutoCard produto={produto} grande={i < 2} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="secao secao-cartoes">
        <div className="container">
          <h2 className="titulo-secao">Confira nossos cartões de crédito mais pedidos da semana</h2>
          <CardCarousel
            itens={conteudo.cartoesMaisPedidos}
            porPagina={3}
            getKey={(cartao) => cartao.id}
            renderItem={(cartao) => <CartaoCard cartao={cartao} />}
            rotulo="Cartões mais pedidos"
          />
        </div>
      </section>

      <section className="secao secao-destaques">
        <div className="container">
          <span className="tag-feito">@ feito.itaú</span>
          <h2 className="titulo-secao">
            Confira os principais destaques do feito.itaú que separamos para você
          </h2>
          <CardCarousel
            itens={conteudo.destaques}
            porPagina={3}
            getKey={(destaque) => destaque.titulo}
            renderItem={(destaque) => <DestaqueCard destaque={destaque} />}
            rotulo="Destaques feito.itaú"
          />
          <div className="texto-centro">
            <Link to="/" className="btn btn-outline-navy">
              Acesse o feito.itaú
            </Link>
          </div>
        </div>
      </section>

      <section className="secao secao-apps">
        <div className="container">
          <h2 className="titulo-secao">Resolva tudo pelos apps</h2>
          <p className="subtitulo-secao">
            Com os nossos aplicativos, você faz tudo pelo seu celular!
          </p>
          <ul className="lista-inline apps-lista">
            {APPS.map((app) => (
              <li key={app.nome}>
                <Link to="/" className={`app-icone ${app.classe}`} aria-label={`logo ${app.nome}`}>
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

      <section className="secao secao-agencias">
        <div className="container">
          <div className="agencia-box">
            <span className="produto-categoria">
              <Icon nome="map-marker" /> Agências
            </span>
            <h2>Qual a agência Itaú mais próxima?</h2>
            <form className="form-agencia" onSubmit={buscarAgencia} role="search">
              <label htmlFor="busca-agencia">Busque por endereço, agência, CEP</label>
              <div className="input-group input-group-lg">
                <span className="input-group-addon" aria-hidden="true">
                  <Icon nome="search" />
                </span>
                <input
                  id="busca-agencia"
                  name="address"
                  type="text"
                  className="form-control"
                  value={termoAgencia}
                  onChange={(e) => setTermoAgencia(e.target.value)}
                  placeholder="Ex.: Av. Paulista, 0350, 01310-100"
                />
                <button className="btn btn-itau" type="submit">
                  Buscar
                </button>
              </div>
              <Link to="/agencias" className="link-localizacao">
                <Icon nome="screenshot" /> Usar minha localização atual
              </Link>
            </form>
          </div>
        </div>
      </section>

      <Link to="/abra-sua-conta" className="barra-abra-conta">
        <Icon nome="briefcase" /> Abra sua conta
      </Link>
    </div>
  );
}
