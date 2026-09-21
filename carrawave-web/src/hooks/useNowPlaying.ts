import { useEffect, useRef, useState } from 'react';
import { fetchNowPlaying } from '../api/catalog';

const POLL_INTERVAL_MS = 20_000;

/**
 * Busca (com polling) o nome da música tocando na rádio atual, quando a
 * emissora manda esse metadado (nem toda manda — nesse caso fica null e o
 * app simplesmente não mostra nada extra, sem erro pra pessoa).
 */
export function useNowPlaying(stationId: string | null, active: boolean): string | null {
  const [title, setTitle] = useState<string | null>(null);
  const seqRef = useRef(0);

  useEffect(() => {
    setTitle(null);
    if (!stationId || !active) return;

    const seq = ++seqRef.current;
    const id = stationId;
    let cancelled = false;

    async function tick() {
      try {
        const res = await fetchNowPlaying(id);
        if (!cancelled && seq === seqRef.current) setTitle(res.title || null);
      } catch {
        // Falha de rede/timeout — mantém o último título conhecido em vez
        // de piscar "sem informação" a cada request que falhar.
      }
    }

    tick();
    const interval = window.setInterval(tick, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [stationId, active]);

  return title;
}
