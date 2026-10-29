import { APP_CONFIG } from '../config';

/**
 * Cliente HTTP base, equivalente ao `ApiService` de app/services/api.service.js:
 * - `get(recurso)` busca `${baseUrl}${recurso}.json`;
 * - respostas bem-sucedidas ficam em cache em memória por recurso;
 * - falhas são logadas com o prefixo do serviço e propagadas (sem cache);
 * - `limparCache()` descarta o cache.
 *
 * Diferença intencional: requisições simultâneas ao mesmo recurso compartilham a mesma Promise
 * (o legado só preenchia o cache após a resposta, gerando chamadas duplicadas).
 */

export class ApiError extends Error {
  readonly recurso: string;
  readonly status?: number;

  constructor(recurso: string, mensagem: string, status?: number, options?: { cause?: unknown }) {
    super(mensagem, options);
    this.name = 'ApiError';
    this.recurso = recurso;
    this.status = status;
  }
}

export interface ApiClient {
  get<T>(recurso: string): Promise<T>;
  limparCache(): void;
}

export interface ApiClientOptions {
  baseUrl: string;
  fetchFn?: typeof fetch;
  logger?: Pick<Console, 'error'>;
}

export function createApiClient({
  baseUrl,
  fetchFn = (...args) => fetch(...args),
  logger = console,
}: ApiClientOptions): ApiClient {
  let cache = new Map<string, Promise<unknown>>();

  async function requisitar(recurso: string): Promise<unknown> {
    let resposta: Response;
    try {
      resposta = await fetchFn(`${baseUrl}${recurso}.json`, {
        headers: { Accept: 'application/json' },
      });
    } catch (erro) {
      throw new ApiError(recurso, `Falha de rede ao carregar ${recurso}`, undefined, {
        cause: erro,
      });
    }
    if (!resposta.ok) {
      throw new ApiError(
        recurso,
        `HTTP ${resposta.status} ao carregar ${recurso}`,
        resposta.status,
      );
    }
    try {
      return await resposta.json();
    } catch (erro) {
      throw new ApiError(recurso, `Resposta inválida ao carregar ${recurso}`, resposta.status, {
        cause: erro,
      });
    }
  }

  function get<T>(recurso: string): Promise<T> {
    const emCache = cache.get(recurso);
    if (emCache) {
      return emCache as Promise<T>;
    }
    const cacheAtual = cache;
    const promessa = requisitar(recurso).catch((erro: unknown) => {
      if (cacheAtual.get(recurso) === promessa) {
        cacheAtual.delete(recurso);
      }
      logger.error(`[ApiClient] Falha ao carregar ${recurso}`, erro);
      throw erro;
    });
    cache.set(recurso, promessa);
    return promessa as Promise<T>;
  }

  function limparCache() {
    cache = new Map();
  }

  return { get, limparCache };
}

export const api = createApiClient({ baseUrl: APP_CONFIG.apiBase });
