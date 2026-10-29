import { Link } from 'react-router-dom';
import type { Produto } from '../api/types';
import { legacyHrefToPath } from '../utils/routes';
import { Icon } from './Icon';

interface ProdutoCardProps {
  produto: Produto;
  grande?: boolean;
}

/** Card da seção "Contrate nossos produtos online" (inline em app/views/home.html). */
export function ProdutoCard({ produto, grande = false }: ProdutoCardProps) {
  return (
    <div className={`produto-card${grande ? ' produto-card-grande' : ''}`}>
      <div className="produto-texto">
        <span className="produto-categoria">
          <Icon nome={produto.icone} /> {produto.categoria}
        </span>
        <h3>{produto.titulo}</h3>
        <p>{produto.descricao}</p>
        <Link to={legacyHrefToPath(produto.link)} className="link-seta">
          {produto.cta} <span>&rsaquo;</span>
        </Link>
      </div>
      <div className="produto-imagem" style={{ backgroundColor: produto.cor }} aria-hidden="true">
        <Icon nome={produto.icone} />
      </div>
    </div>
  );
}
