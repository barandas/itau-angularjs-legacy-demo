import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getJson, limparCache } from './api';

describe('getJson', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    limparCache();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('busca JSON e reutiliza o cache em memória', async () => {
    const dados = [{ id: 1 }];
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(dados)
    });

    await expect(getJson<typeof dados>('cartoes')).resolves.toEqual(dados);
    await expect(getJson<typeof dados>('cartoes')).resolves.toEqual(dados);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/data/cartoes.json');
  });

  it('limparCache faz uma nova requisição', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ versao: 1 })
    });

    await getJson('taxas');
    limparCache();
    await getJson('taxas');

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('rejeita respostas HTTP malsucedidas', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 });

    await expect(getJson('taxas')).rejects.toThrow('Falha ao carregar taxas: 500');
  });
});
