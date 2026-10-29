import { Link } from 'react-router-dom';
import type { Cartao } from '../api/types';

/** Equivalente a app/partials/card-cartao.html. */
export function CartaoCard({ cartao }: { cartao: Cartao }) {
  return (
    <div className="cartao-card">
      <div className={`cartao-plastico ${cartao.estilo}`} aria-hidden="true">
        <span className="cartao-chip" />
        <span className="cartao-bandeira">{cartao.bandeira}</span>
        <span className="cartao-categoria">{cartao.categoria}</span>
        <span className="cartao-logo">itaú</span>
      </div>
      <h3>{cartao.nome}</h3>
      <p>{cartao.destaque}</p>
      <Link to="/cartoes" className="link-seta">
        {cartao.programa === 'todos' ? 'Escolha o seu' : 'Peça o seu'} <span>&rsaquo;</span>
      </Link>
    </div>
  );
}
