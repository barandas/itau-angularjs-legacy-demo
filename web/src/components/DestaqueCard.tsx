import { Link } from 'react-router-dom';
import type { Destaque } from '../api/types';
import { Icon } from './Icon';

/** Equivalente a app/partials/card-destaque.html. */
export function DestaqueCard({ destaque }: { destaque: Destaque }) {
  return (
    <div className="destaque-card">
      <figure className="destaque-imagem" style={{ backgroundColor: destaque.cor }}>
        <Icon nome="picture" />
      </figure>
      <h3>{destaque.titulo}</h3>
      <p>{destaque.descricao}</p>
      <Link to="/" className="link-seta">
        {destaque.cta} <span>&rsaquo;</span>
      </Link>
    </div>
  );
}
