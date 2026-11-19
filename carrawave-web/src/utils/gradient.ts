import type { StationSummary } from '../api/types';

// Paleta de fallback (mesmos tons da identidade visual) para quando a
// estação não tem artworkColor definido no banco.
const FALLBACK_GRADIENTS = [
  'linear-gradient(145deg,#a855f7,#4c1d95)',
  'linear-gradient(145deg,#22d3ee,#155e75)',
  'linear-gradient(145deg,#ec4899,#831843)',
  'linear-gradient(145deg,#4f46e5,#1e1b4b)',
  'linear-gradient(145deg,#d946ef,#701a75)',
  'linear-gradient(145deg,#2563eb,#172554)',
  'linear-gradient(145deg,#f59e0b,#78350f)',
  'linear-gradient(145deg,#10b981,#064e3b)',
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function darken(hex: string, amount: number): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return hex;
  const num = parseInt(clean, 16);
  const r = Math.max(0, Math.floor(((num >> 16) & 0xff) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0xff) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 0xff) * (1 - amount)));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * As cores salvas no banco (artworkColor) foram escolhidas para a paleta
 * antiga (terrosa). Enquanto não forem revisadas, a capa usa a paleta da
 * nova identidade. Para voltar a usar as cores do banco, troque para true.
 */
const USE_DB_ARTWORK_COLOR = false;

export function stationGradient(station: Pick<StationSummary, 'id' | 'artworkColor'>): string {
  if (USE_DB_ARTWORK_COLOR && station.artworkColor) {
    return `linear-gradient(145deg, ${station.artworkColor}, ${darken(station.artworkColor, 0.45)})`;
  }
  return FALLBACK_GRADIENTS[hashString(station.id) % FALLBACK_GRADIENTS.length];
}

export function stationInitials(station: Pick<StationSummary, 'name' | 'initials'>): string {
  if (station.initials) return station.initials.toUpperCase();
  return station.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function formatListeners(n: number | null | undefined): string {
  if (n === null || n === undefined) return '';
  if (n >= 1000) {
    return `${(n / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mil ouvindo`;
  }
  return `${n} ouvindo`;
}
