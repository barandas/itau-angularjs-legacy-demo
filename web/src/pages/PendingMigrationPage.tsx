import { Link, useLocation } from 'react-router-dom';
import { APP_CONFIG } from '../config';

interface PendingMigrationPageProps {
  titulo: string;
  /** Caminho da rota equivalente no app AngularJS (sem o prefixo `#!`). */
  caminhoLegado: string;
}

/** Placeholder para as rotas que ainda só existem no app AngularJS. */
export function PendingMigrationPage({ titulo, caminhoLegado }: PendingMigrationPageProps) {
  const { search } = useLocation();
  const urlLegada = `${APP_CONFIG.legacyAppUrl}#!${caminhoLegado}${search}`;

  return (
    <div className="banner-interno">
      <div className="container">
        <h1>{titulo}</h1>
        <p>Esta página ainda não foi migrada para React.</p>
        <p className="acoes-pendentes">
          <a href={urlLegada} className="btn btn-outline-white">
            Abrir na versão AngularJS
          </a>
          <Link to="/" className="btn btn-outline-white">
            Voltar para a Home
          </Link>
        </p>
      </div>
    </div>
  );
}
