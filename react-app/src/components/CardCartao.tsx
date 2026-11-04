import { Link } from 'react-router-dom';
import type { Cartao } from '../types';
import styles from './CardCartao.module.css';

interface CardCartaoProps {
  item: Cartao;
}

export function CardCartao({ item }: CardCartaoProps) {
  const estilo = styles[item.estilo] ?? '';

  return (
    <article className={styles.card}>
      <div className={`${styles.plastico} ${estilo}`} aria-hidden="true">
        <span className={styles.chip} />
        <span className={styles.bandeira}>{item.bandeira}</span>
        <span className={styles.categoria}>{item.categoria}</span>
        <span className={styles.logo}>itaú</span>
      </div>
      <h3>{item.nome}</h3>
      <p>{item.destaque}</p>
      <Link to="/cartoes" className="link-seta">
        {item.programa === 'todos' ? 'Escolha o seu' : 'Peça o seu'}{' '}
        <span>&rsaquo;</span>
      </Link>
    </article>
  );
}
