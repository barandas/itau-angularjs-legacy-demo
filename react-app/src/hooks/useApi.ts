import { useEffect, useState } from 'react';
import { getJson } from '../lib/api';

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: unknown;
}

export function useApi<T>(recurso: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let ativo = true;
    setData(null);
    setLoading(true);
    setError(null);

    getJson<T>(recurso).then(
      (resultado) => {
        if (ativo) {
          setData(resultado);
          setLoading(false);
        }
      },
      (erro: unknown) => {
        if (ativo) {
          setError(erro);
          setLoading(false);
        }
      }
    );

    return () => {
      ativo = false;
    };
  }, [recurso]);

  return { data, loading, error };
}
