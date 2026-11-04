import { Link } from 'react-router-dom';
import type { Destaque } from '../types';
import styles from './CardDestaque.module.css';

interface CardDestaqueProps {
  item: Destaque;
}

export function CardDestaque({ item }: CardDestaqueProps) {
  return (
    <article className={styles.card}>
      <figure className={styles.image} style={{ backgroundColor: item.cor }}>
        <svg className={styles.imageIcon} viewBox="0 0 48 48" aria-hidden="true">
          <rect x="5" y="7" width="38" height="34" rx="2" />
          <circle cx="17" cy="18" r="3" className={styles.imageCutout} />
          <path d="m9 36 10-10 7 6 7-9 8 13z" className={styles.imageCutout} />
        </svg>
      </figure>
      <h3>{item.titulo}</h3>
      <p>{item.descricao}</p>
      <Link to="/" className="link-seta">
        {item.cta} <span>&rsaquo;</span>
      </Link>
    </article>
  );
}
