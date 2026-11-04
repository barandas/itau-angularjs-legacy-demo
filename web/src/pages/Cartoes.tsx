import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import cardStyles from '../components/CardCartao.module.css';
import { Modal } from '../components/Modal';
import { PageHeader } from '../components/PageHeader';
import { useApi } from '../hooks/useApi';
import { filtrarCartoes } from '../lib/cartoes';
import { formatBRL } from '../lib/format';
import type { Cartao } from '../types';
import styles from './Cartoes.module.css';

const programas = [
  { valor: 'qualquer', nome: 'Todos os benefícios' },
  { valor: 'viagem', nome: 'Milhas e viagens' },
  { valor: 'pontos', nome: 'Pontos' },
  { valor: 'cashback', nome: 'Cashback e descontos' },
  { valor: 'sem-anuidade', nome: 'Sem anuidade' }
];

type Ordenacao = 'anuidade' | '-pontosPorDolar' | 'rendaMinima' | 'nome';

interface CriteriosFormulario {
  renda: string;
  programa: string;
  semAnuidade: boolean;
}

const criteriosIniciais: CriteriosFormulario = {
  renda: '',
  programa: 'qualquer',
  semAnuidade: false
};

function ordenarCartoes(cartoes: Cartao[], ordenacao: Ordenacao): Cartao[] {
  return [...cartoes].sort((a, b) => {
    switch (ordenacao) {
      case '-pontosPorDolar':
        return b.pontosPorDolar - a.pontosPorDolar;
      case 'rendaMinima':
        return a.rendaMinima - b.rendaMinima;
      case 'nome':
        return a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' });
      case 'anuidade':
        return (a.anuidade ?? 0) - (b.anuidade ?? 0);
    }
  });
}

export function Cartoes() {
  const { data, loading, error } = useApi<Cartao[]>('cartoes');
  const todos = useMemo(() => data ?? [], [data]);
  const [criterios, setCriterios] = useState(criteriosIniciais);
  const [ordenacao, setOrdenacao] = useState<Ordenacao>('anuidade');
  const [selecionado, setSelecionado] = useState<Cartao | null>(null);

  const cartoes = useMemo(
    () =>
      ordenarCartoes(
        filtrarCartoes(todos, {
          renda: criterios.renda === '' ? undefined : Number(criterios.renda),
          programa: criterios.programa,
          semAnuidade: criterios.semAnuidade
        }),
        ordenacao
      ),
    [criterios, ordenacao, todos]
  );

  const limpar = () => {
    setCriterios(criteriosIniciais);
  };

  const fecharModal = useCallback(() => {
    setSelecionado(null);
  }, []);

  return (
    <>
      <PageHeader
        titulo="Cartões de crédito"
        subtitulo="Encontre o cartão que dá match com você."
      />
      <section className={styles.content}>
        <div className="container">
          <div className={styles.layout}>
            <aside className={styles.filterColumn}>
              <div className={styles.filtersPanel}>
                <div className={styles.panelHeading}>
                  <strong>Filtrar cartões</strong>
                </div>
                <div className={styles.panelBody}>
                  <div className={styles.formGroup}>
                    <label htmlFor="renda">Sua renda mensal (R$)</label>
                    <input
                      id="renda"
                      type="number"
                      min="0"
                      step="100"
                      placeholder="Ex.: 5000"
                      value={criterios.renda}
                      onChange={(event) => {
                        const renda = event.currentTarget.value;
                        setCriterios((atual) => ({ ...atual, renda }));
                      }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="programa">Benefício preferido</label>
                    <select
                      id="programa"
                      value={criterios.programa}
                      onChange={(event) => {
                        const programa = event.currentTarget.value;
                        setCriterios((atual) => ({ ...atual, programa }));
                      }}
                    >
                      {programas.map((programa) => (
                        <option key={programa.valor} value={programa.valor}>
                          {programa.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={criterios.semAnuidade}
                      onChange={(event) => {
                        const semAnuidade = event.currentTarget.checked;
                        setCriterios((atual) => ({ ...atual, semAnuidade }));
                      }}
                    />
                    Somente sem anuidade
                  </label>
                  <div className={styles.formGroup}>
                    <label htmlFor="ordem">Ordenar por</label>
                    <select
                      id="ordem"
                      value={ordenacao}
                      onChange={(event) => setOrdenacao(event.currentTarget.value as Ordenacao)}
                    >
                      <option value="anuidade">Menor anuidade</option>
                      <option value="-pontosPorDolar">Mais pontos</option>
                      <option value="rendaMinima">Menor renda mínima</option>
                      <option value="nome">Nome</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    className={`btn btn-block ${styles.clearButton}`}
                    onClick={limpar}
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
            </aside>

            <div className={styles.results}>
              {loading && (
                <p className={styles.status} role="status">
                  Carregando cartões...
                </p>
              )}
              {Boolean(error) && (
                <p className={styles.error} role="alert">
                  Não foi possível carregar os cartões.
                </p>
              )}
              {!loading && !error && (
                <>
                  <p className={styles.count} aria-live="polite">
                    {cartoes.length} cartão(ões) encontrado(s)
                  </p>
                  {todos.length > 0 && cartoes.length === 0 && (
                    <p className={styles.empty}>
                      Nenhum cartão encontrado para os filtros selecionados.
                    </p>
                  )}
                  <div className={styles.cardGrid}>
                    {cartoes.map((cartao) => {
                      const estilo = cardStyles[cartao.estilo] ?? '';
                      return (
                        <article className={styles.card} key={cartao.id}>
                          <div className={`${cardStyles.plastico} ${estilo}`} aria-hidden="true">
                            <span className={cardStyles.chip} />
                            <span className={cardStyles.bandeira}>{cartao.bandeira}</span>
                            <span className={cardStyles.categoria}>{cartao.categoria}</span>
                            <span className={cardStyles.logo}>itaú</span>
                          </div>
                          <h3>{cartao.nome}</h3>
                          <p className={styles.description}>{cartao.destaque}</p>
                          <dl className={styles.details}>
                            <div>
                              <dt>Anuidade</dt>
                              <dd>{cartao.anuidade ? formatBRL(cartao.anuidade) : 'Grátis'}</dd>
                            </div>
                            <div>
                              <dt>Renda mín.</dt>
                              <dd>{formatBRL(cartao.rendaMinima)}</dd>
                            </div>
                            <div>
                              <dt>Pontos/US$</dt>
                              <dd>{cartao.pontosPorDolar || '—'}</dd>
                            </div>
                          </dl>
                          <button
                            type="button"
                            className="btn btn-itau btn-block"
                            onClick={() => setSelecionado(cartao)}
                          >
                            Peça o seu
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      {selecionado && (
        <Modal
          isOpen
          titulo={selecionado.nome}
          onClose={fecharModal}
          footer={
            <>
              <button type="button" className="btn btn-outline-navy" onClick={fecharModal}>
                Fechar
              </button>
              <Link to="/abra-sua-conta" className="btn btn-itau" onClick={fecharModal}>
                Abrir conta e pedir
              </Link>
            </>
          }
        >
          <p>{selecionado.destaque}</p>
          <p>
            Anuidade:{' '}
            <strong>{selecionado.anuidade ? formatBRL(selecionado.anuidade) : 'Grátis'}</strong>
          </p>
          <p className={styles.warning}>Ambiente de demonstração: nenhum pedido é realizado.</p>
        </Modal>
      )}
    </>
  );
}
