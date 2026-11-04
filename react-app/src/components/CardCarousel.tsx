import { useEffect, useState, type ReactNode } from 'react';
import { useItensPorPagina } from '../hooks/useItensPorPagina';
import styles from './CardCarousel.module.css';

interface CardCarouselProps<T> {
  itens: T[];
  renderItem: (item: T) => ReactNode;
  porPagina?: number;
}

export function CardCarousel<T>({
  itens,
  renderItem,
  porPagina = 3
}: CardCarouselProps<T>) {
  const porPaginaAtual = useItensPorPagina(porPagina);
  const [pagina, setPagina] = useState(0);
  const totalPaginas = Math.ceil(itens.length / porPaginaAtual);
  const itensVisiveis = itens.slice(
    pagina * porPaginaAtual,
    pagina * porPaginaAtual + porPaginaAtual
  );

  useEffect(() => {
    if (pagina >= totalPaginas) {
      setPagina(0);
    }
  }, [pagina, totalPaginas]);

  return (
    <div className={styles.carousel}>
      <div
        className={styles.track}
        style={{
          gridTemplateColumns: `repeat(${Math.max(itensVisiveis.length, 1)}, minmax(0, 1fr))`
        }}
      >
        {itensVisiveis.map((item, index) => (
          <div className={styles.item} key={`${pagina}-${index}`}>
            {renderItem(item)}
          </div>
        ))}
      </div>
      {totalPaginas > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => setPagina((atual) => Math.max(atual - 1, 0))}
            disabled={pagina === 0}
            aria-label="página anterior"
          >
            &lsaquo;
          </button>
          {Array.from({ length: totalPaginas }, (_, index) => (
            <button
              type="button"
              className={`${styles.dot} ${index === pagina ? styles.dotActive : ''}`}
              key={index}
              onClick={() => setPagina(index)}
              aria-label={`Página ${index + 1}`}
              aria-current={index === pagina ? 'true' : undefined}
            />
          ))}
          <button
            type="button"
            className={styles.arrow}
            onClick={() => setPagina((atual) => Math.min(atual + 1, totalPaginas - 1))}
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
