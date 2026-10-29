import { useEffect, useState } from 'react';

/** Indica se a janela rolou mais que `limite` px (substitui o listener jQuery do HeaderController). */
export function useScrolled(limite = 10): boolean {
  const [rolou, setRolou] = useState(() => window.scrollY > limite);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > limite);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, [limite]);

  return rolou;
}
