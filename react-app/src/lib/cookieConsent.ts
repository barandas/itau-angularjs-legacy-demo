const CHAVE = 'itau-demo-cookie-consent';

export type PreferenciaCookie = 'todos' | 'essenciais';
export type ListenerCookie = (valor: PreferenciaCookie | null) => void;

const listeners = new Set<ListenerCookie>();

function obter(): PreferenciaCookie | null {
  try {
    return (window.localStorage.getItem(CHAVE) as PreferenciaCookie | null) ?? null;
  } catch {
    return null;
  }
}

function notificar(): void {
  const valor = obter();
  listeners.forEach((listener) => listener(valor));
}

function salvar(valor: PreferenciaCookie): void {
  try {
    window.localStorage.setItem(CHAVE, valor);
  } catch {
    // Mantém a interface funcional quando o armazenamento está indisponível.
  }
  notificar();
}

export const cookieConsent = {
  jaRespondeu(): boolean {
    return !!obter();
  },
  preferencia(): PreferenciaCookie | null {
    return obter();
  },
  aceitarTodos(): void {
    salvar('todos');
  },
  rejeitarNaoEssenciais(): void {
    salvar('essenciais');
  },
  limpar(): void {
    try {
      window.localStorage.removeItem(CHAVE);
    } catch {
      // Ignora armazenamento indisponível.
    }
    notificar();
  },
  subscribe(listener: ListenerCookie): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};
