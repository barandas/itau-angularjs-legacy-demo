import { Link } from 'react-router-dom';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  titulo: string;
  subtitulo?: string;
}

export function PageHeader({ titulo, subtitulo }: PageHeaderProps) {
  return (
    <section className={styles.header}>
      <div className="container">
        <nav aria-label="Breadcrumb">
          <ol className={styles.breadcrumb}>
            <li>
              <Link to="/">Início</Link>
            </li>
            <li aria-current="page">{titulo}</li>
          </ol>
        </nav>
        <h1>{titulo}</h1>
        {subtitulo && <p>{subtitulo}</p>}
      </div>
    </section>
  );
}
