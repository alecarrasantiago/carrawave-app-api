import type { StationSummary } from '../api/types';

// Paleta de fallback (mesmos tons da identidade visual) para quando a
// estação não tem artworkColor definido no banco.
const FALLBACK_GRADIENTS = [
  'linear-gradient(145deg,#f6a06b,#b2622d)',
  'linear-gradient(145deg,#aebf92,#56633f)',
  'linear-gradient(145deg,#ffc6a5,#d67f48)',
  'linear-gradient(145deg,#c0b6a5,#5a5246)',
  'linear-gradient(145deg,#d67f48,#643312)',
  'linear-gradient(145deg,#ccdbb2,#728157)',
  'linear-gradient(145deg,#f6a06b,#8c491a)',
  'linear-gradient(145deg,#8fa073,#3d472b)',
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

export function stationGradient(station: Pick<StationSummary, 'id' | 'artworkColor'>): string {
  if (station.artworkColor) {
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
