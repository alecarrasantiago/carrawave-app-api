import { useEffect, useState } from 'react';

/**
 * Breakpoint mobile via matchMedia (em vez de media query em CSS puro),
 * porque o layout do app é montado com estilos inline no React — assim os
 * componentes (Sidebar, PlayerBar, App) conseguem trocar de layout
 * (barra lateral <-> barra inferior, grade compacta, etc.) de forma
 * consistente com o resto do código.
 */
export function useIsMobile(breakpoint = 760): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);

  return isMobile;
}
