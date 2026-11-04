import { PageHeader } from '../components/PageHeader';
import styles from './PendingMigration.module.css';

interface PendingMigrationProps {
  titulo: string;
}

export function PendingMigration({ titulo }: PendingMigrationProps) {
  return (
    <>
      <PageHeader titulo={titulo} />
      <section className={styles.content}>
        <div className="container">
          <p>Página em migração — veja a versão AngularJS</p>
        </div>
      </section>
    </>
  );
}
