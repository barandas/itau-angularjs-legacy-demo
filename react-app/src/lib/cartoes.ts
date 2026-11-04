import type { Cartao } from '../types';

export interface CriteriosCartoes {
  renda?: number;
  programa?: string;
  semAnuidade?: boolean;
}

export function filtrarCartoes(
  cartoes: Cartao[],
  criterios: CriteriosCartoes = {}
): Cartao[] {
  return cartoes.filter((cartao) => {
    if (cartao.programa === 'todos') {
      return false;
    }
    if (criterios.renda && cartao.rendaMinima > criterios.renda) {
      return false;
    }
    if (
      criterios.programa &&
      criterios.programa !== 'qualquer' &&
      cartao.programa !== criterios.programa
    ) {
      return false;
    }
    if (criterios.semAnuidade && (cartao.anuidade ?? 0) > 0) {
      return false;
    }
    return true;
  });
}

export function maisPedidos(cartoes: Cartao[]): Cartao[] {
  return cartoes.filter((cartao) => cartao.maisPedido);
}
