import { api, type ApiClient } from './client';
import type { Atalho, Banner, Cartao, Destaque, Produto } from './types';

export interface ConteudoHome {
  banners: Banner[];
  atalhos: Atalho[];
  produtos: Produto[];
  destaques: Destaque[];
  cartoesMaisPedidos: Cartao[];
}

/**
 * Equivalente ao `$q.all` do HomeController (ProdutosService + CartoesService.maisPedidos).
 * Usa apenas os recursos que a Home legada já consome.
 */
export async function carregarConteudoHome(client: ApiClient = api): Promise<ConteudoHome> {
  const [banners, atalhos, produtos, destaques, cartoes] = await Promise.all([
    client.get<Banner[]>('banners'),
    client.get<Atalho[]>('atalhos'),
    client.get<Produto[]>('produtos'),
    client.get<Destaque[]>('destaques'),
    client.get<Cartao[]>('cartoes'),
  ]);
  return {
    banners,
    atalhos,
    produtos,
    destaques,
    cartoesMaisPedidos: cartoes.filter((cartao) => cartao.maisPedido),
  };
}
