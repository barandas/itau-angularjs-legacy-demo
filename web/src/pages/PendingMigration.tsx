import styles from './PendingMigration.module.css';

interface PendingMigrationProps {
  titulo: string;
}

export function PendingMigration({ titulo }: PendingMigrationProps) {
  return (
    <>
      <section className={styles.pending}>
        <div className="container">
          <h1>{titulo}</h1>
        </div>
      </section>
      <section className={styles.content}>
        <div className="container">
          <p>Página em migração — veja a versão AngularJS</p>
        </div>
      </section>
    </>
  );
}
