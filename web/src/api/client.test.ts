import { describe, expect, it, vi } from 'vitest';
import { ApiError, createApiClient } from './client';

function respostaJson(corpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function criar(fetchFn: typeof fetch) {
  const logger = { error: vi.fn() };
  const client = createApiClient({ baseUrl: 'data/', fetchFn, logger });
  return { client, logger };
}

describe('createApiClient (porta do ApiService)', () => {
  it('busca `${baseUrl}${recurso}.json` e retorna o corpo', async () => {
    const fetchFn = vi.fn<typeof fetch>().mockResolvedValue(respostaJson([{ id: 1 }]));
    const { client } = criar(fetchFn);

    await expect(client.get('banners')).resolves.toEqual([{ id: 1 }]);
    expect(fetchFn).toHaveBeenCalledWith('data/banners.json', expect.any(Object));
  });

  it('usa o cache em memória nas chamadas seguintes', async () => {
    const fetchFn = vi.fn<typeof fetch>().mockImplementation(async () => respostaJson(['a']));
    const { client } = criar(fetchFn);

    await client.get('atalhos');
    await expect(client.get('atalhos')).resolves.toEqual(['a']);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('compartilha a requisição em andamento entre chamadas simultâneas', async () => {
    const fetchFn = vi.fn<typeof fetch>().mockImplementation(async () => respostaJson(['a']));
    const { client } = criar(fetchFn);

    const [a, b] = await Promise.all([client.get('produtos'), client.get('produtos')]);
    expect(a).toBe(b);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('mantém cache separado por recurso', async () => {
    const fetchFn = vi
      .fn<typeof fetch>()
      .mockImplementation(async (url) => respostaJson({ url: String(url) }));
    const { client } = criar(fetchFn);

    await expect(client.get('a')).resolves.toEqual({ url: 'data/a.json' });
    await expect(client.get('b')).resolves.toEqual({ url: 'data/b.json' });
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('rejeita com ApiError em respostas HTTP de erro, loga e não guarda em cache', async () => {
    const fetchFn = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response('não encontrado', { status: 404 }))
      .mockResolvedValueOnce(respostaJson(['ok']));
    const { client, logger } = criar(fetchFn);

    const erro = await client.get('cartoes').catch((e: unknown) => e);
    expect(erro).toBeInstanceOf(ApiError);
    expect(erro).toMatchObject({ recurso: 'cartoes', status: 404 });
    expect(logger.error).toHaveBeenCalledWith('[ApiClient] Falha ao carregar cartoes', erro);

    await expect(client.get('cartoes')).resolves.toEqual(['ok']);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('rejeita com ApiError em falhas de rede e JSON inválido', async () => {
    const fetchFn = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(new Response('<html>', { status: 200 }));
    const { client } = criar(fetchFn);

    await expect(client.get('x')).rejects.toMatchObject({ name: 'ApiError', status: undefined });
    await expect(client.get('x')).rejects.toMatchObject({ name: 'ApiError', status: 200 });
  });

  it('limparCache força uma nova requisição', async () => {
    const fetchFn = vi.fn<typeof fetch>().mockImplementation(async () => respostaJson([]));
    const { client } = criar(fetchFn);

    await client.get('destaques');
    client.limparCache();
    await client.get('destaques');
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });
});
