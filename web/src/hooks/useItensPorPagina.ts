import { useEffect, useState } from 'react';

function calcularItensPorPagina(base: number): number {
  if (window.innerWidth < 768) {
    return 1;
  }
  if (window.innerWidth < 992) {
    return Math.min(base, 2);
  }
  return base;
}

export function useItensPorPagina(base: number): number {
  const [itensPorPagina, setItensPorPagina] = useState(() => calcularItensPorPagina(base));

  useEffect(() => {
    const atualizar = () => setItensPorPagina(calcularItensPorPagina(base));
    window.addEventListener('resize', atualizar);
    return () => window.removeEventListener('resize', atualizar);
  }, [base]);

  return itensPorPagina;
}
