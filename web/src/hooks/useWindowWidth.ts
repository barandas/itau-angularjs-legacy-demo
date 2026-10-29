import { useEffect, useState } from 'react';

export function useWindowWidth(): number {
  const [largura, setLargura] = useState(() => window.innerWidth);

  useEffect(() => {
    const aoRedimensionar = () => setLargura(window.innerWidth);
    window.addEventListener('resize', aoRedimensionar);
    return () => window.removeEventListener('resize', aoRedimensionar);
  }, []);

  return largura;
}
