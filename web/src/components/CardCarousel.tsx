import { useState, type CSSProperties, type Key, type ReactNode } from 'react';
import { useWindowWidth } from '../hooks/useWindowWidth';

interface CardCarouselProps<T> {
  itens: T[];
  renderItem: (item: T) => ReactNode;
  getKey: (item: T) => Key;
  porPagina?: number;
  rotulo?: string;
}

function itensPorPagina(base: number, largura: number): number {
  if (largura < 768) return 1;
  if (largura < 992) return Math.min(base, 2);
  return base;
}

/**
 * Carrossel paginado genérico (equivalente à diretiva cardCarousel). O template dinâmico via
 * `ng-include` virou a render prop `renderItem`.
 */
export function CardCarousel<T>({
  itens,
  renderItem,
  getKey,
  porPagina = 3,
  rotulo,
}: CardCarouselProps<T>) {
  const largura = useWindowWidth();
  const [paginaEscolhida, setPaginaEscolhida] = useState(0);

  const n = itensPorPagina(porPagina, largura);
  const totalPaginas = Math.ceil(itens.length / n);
  // Como no legado, volta para a primeira página se um resize deixar a página atual fora do intervalo.
  const pagina = paginaEscolhida < totalPaginas ? paginaEscolhida : 0;
  const visiveis = itens.slice(pagina * n, pagina * n + n);

  const irPara = (p: number) => {
    if (p < 0 || p >= totalPaginas) return;
    setPaginaEscolhida(p);
  };

  return (
    <div className="card-carousel" role="region" aria-label={rotulo}>
      <ul
        className="lista-limpa card-carousel-trilho"
        style={{ '--colunas': Math.min(Math.max(visiveis.length, 1), 4) } as CSSProperties}
      >
        {visiveis.map((item) => (
          <li key={getKey(item)} className="card-carousel-item">
            {renderItem(item)}
          </li>
        ))}
      </ul>
      {totalPaginas > 1 && (
        <div className="card-carousel-paginacao">
          <button
            type="button"
            className="seta"
            onClick={() => irPara(pagina - 1)}
            disabled={pagina === 0}
            aria-label="página anterior"
          >
            &lsaquo;
          </button>
          {Array.from({ length: totalPaginas }, (_, p) => (
            <button
              key={p}
              type="button"
              className={`dot${p === pagina ? ' ativo' : ''}`}
              onClick={() => irPara(p)}
              aria-label={`Página ${p + 1}`}
              aria-current={p === pagina ? 'true' : undefined}
            />
          ))}
          <button
            type="button"
            className="seta"
            onClick={() => irPara(pagina + 1)}
            disabled={pagina >= totalPaginas - 1}
            aria-label="próxima página"
          >
            &rsaquo;
          </button>
        </div>
      )}
    </div>
  );
}
