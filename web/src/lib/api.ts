const cache = new Map<string, unknown>();

export async function getJson<T>(recurso: string): Promise<T> {
  if (cache.has(recurso)) {
    return cache.get(recurso) as T;
  }

  const resposta = await fetch(`/data/${recurso}.json`);
  if (!resposta.ok) {
    throw new Error(`Falha ao carregar ${recurso}: ${resposta.status}`);
  }

  const dados = (await resposta.json()) as T;
  cache.set(recurso, dados);
  return dados;
}

export function limparCache(): void {
  cache.clear();
}
