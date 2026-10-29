import { describe, expect, it, vi } from 'vitest';
import type { ApiClient } from './client';
import { carregarConteudoHome } from './home';

describe('carregarConteudoHome', () => {
  it('carrega os cinco recursos da Home e filtra os cartões mais pedidos', async () => {
    const dados: Record<string, unknown> = {
      banners: [{ id: 1 }],
      atalhos: [{ titulo: 'Boleto' }],
      produtos: [{ id: 'p' }],
      destaques: [{ titulo: 'd' }],
      cartoes: [
        { id: 'a', maisPedido: true },
        { id: 'b', maisPedido: false },
        { id: 'c', maisPedido: true },
      ],
    };
    const client: ApiClient = {
      get: vi.fn(async (recurso: string) => dados[recurso]) as ApiClient['get'],
      limparCache: vi.fn(),
    };

    const conteudo = await carregarConteudoHome(client);

    expect(client.get).toHaveBeenCalledTimes(5);
    expect(conteudo.banners).toEqual([{ id: 1 }]);
    expect(conteudo.cartoesMaisPedidos.map((c) => c.id)).toEqual(['a', 'c']);
  });

  it('rejeita se qualquer recurso falhar', async () => {
    const client: ApiClient = {
      get: vi.fn(async (recurso: string) => {
        if (recurso === 'produtos') throw new Error('falhou');
        return [];
      }) as ApiClient['get'],
      limparCache: vi.fn(),
    };

    await expect(carregarConteudoHome(client)).rejects.toThrow('falhou');
  });
});
