import type { MeResponse, StationSummary } from '../api/types';
import { stationGradient, stationInitials } from '../utils/gradient';
import { ClockIcon, CompassIcon, HeartIcon, HomeIcon, SettingsIcon } from './icons';
import { useIsMobile } from '../hooks/useIsMobile';

export type NavKey = 'home' | 'explore' | 'fav' | 'recent' | 'settings';

const NAV: { key: NavKey; label: string }[] = [
  { key: 'home', label: 'Início' },
  { key: 'explore', label: 'Explorar' },
  { key: 'fav', label: 'Favoritos' },
  { key: 'recent', label: 'Recentes' },
  { key: 'settings', label: 'Configurações' },
];

const NAV_ICON: Record<NavKey, (color: string) => JSX.Element> = {
  home: (color) => <HomeIcon size={21} color={color} />,
  explore: (color) => <CompassIcon size={21} color={color} />,
  fav: (color) => <HeartIcon size={20} filled={false} color={color} />,
  recent: (color) => <ClockIcon size={20} color={color} />,
  settings: (color) => <SettingsIcon size={20} color={color} />,
};

interface Props {
  nav: NavKey;
  onNavChange: (n: NavKey) => void;
  favorites: StationSummary[];
  onPlayFavorite: (s: StationSummary) => void;
  me: MeResponse | null;
  onAuthClick: () => void;
  bottomOffset?: number;
}

export function Sidebar({ nav, onNavChange, favorites, onPlayFavorite, me, onAuthClick, bottomOffset = 0 }: Props) {
  const isMobile = useIsMobile();
  const logged = me?.accountType === 'REGISTERED';
  const acctIni = logged ? (me?.displayName?.[0]?.toUpperCase() ?? 'A') : '?';
  const acctName = logged ? me?.displayName || 'Minha conta' : 'Convidado';
  const acctSub = logged ? me?.email ?? '' : me?.anonymousLabel ?? '';

  if (isMobile) {
    return (
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: bottomOffset,
          zIndex: 25,
          display: 'flex',
          background: 'var(--surf)',
          borderTop: '1px solid var(--line)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {NAV.map((n) => {
          const active = nav === n.key;
          const color = active ? 'var(--accent)' : 'var(--ink40)';
          return (
            <div
              key={n.key}
              onClick={() => onNavChange(n.key)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                padding: '9px 2px 8px',
                cursor: 'pointer',
              }}
            >
              {NAV_ICON[n.key](color)}
              <span style={{ font: '600 10px Figtree', color, letterSpacing: '-.01em' }}>{n.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 'none',
        width: 238,
        borderRight: '1px solid var(--line)',
        background: 'var(--surf)',
        display: 'flex',
        flexDirection: 'column',
        padding: '22px 16px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px' }}>
        <div style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="var(--onacc)" strokeWidth={2.75} strokeLinecap="round">
            <circle cx="16" cy="16" r="3.2" fill="var(--onacc)" stroke="none" />
            <path d="M10.2 10.2a8.2 8.2 0 000 11.6" />
            <path d="M21.8 10.2a8.2 8.2 0 010 11.6" />
          </svg>
        </div>
        <span className="cw-display" style={{ fontSize: 18 }}>Carra Wave</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 24 }}>
        {NAV.map((n) => (
          <div
            key={n.key}
            onClick={() => onNavChange(n.key)}
            className="cw-navitem"
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              padding: '10px 14px',
              borderRadius: 999,
              background: nav === n.key ? 'var(--ink)' : 'transparent',
              color: nav === n.key ? 'var(--bg)' : 'var(--ink)',
              font: '700 13.5px Figtree',
            }}
          >
            {n.label}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, padding: '0 8px', font: "600 11px 'IBM Plex Mono', monospace", letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink40)' }}>
        Suas favoritas
      </div>
      <div className="cw-scroll" style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', maxHeight: 210 }}>
        {favorites.map((f) => (
          <div
            key={f.id}
            onClick={() => onPlayFavorite(f)}
            className="cw-navitem"
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 14 }}
          >
            <div
              style={{
                flex: 'none',
                width: 30,
                height: 30,
                borderRadius: 10,
                background: stationGradient(f),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                font: '400 11px Caprasimo, serif',
                color: 'rgba(255,255,255,.95)',
              }}
            >
              {stationInitials(f)}
            </div>
            <div style={{ flex: 1, minWidth: 0, font: '600 12.5px Figtree', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
          </div>
        ))}
        {favorites.length === 0 && (
          <div style={{ font: '500 12px Figtree', color: 'var(--ink40)', padding: '4px 8px' }}>Nenhuma ainda.</div>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 16 }} />

      <div style={{ margin: '0 -16px', padding: '13px 16px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            flex: 'none',
            width: 32,
            height: 32,
            borderRadius: 999,
            background: 'var(--accent-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: '400 13px Caprasimo, serif',
            color: 'var(--accent-ink)',
          }}
        >
          {acctIni}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: '700 12.5px Figtree', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{acctName}</div>
          <div style={{ font: "500 10px 'IBM Plex Mono', monospace", color: 'var(--ink40)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {acctSub}
          </div>
        </div>
        <div
          onClick={onAuthClick}
          className="cw-hover-soft"
          style={{ cursor: 'pointer', flex: 'none', padding: '5px 10px', borderRadius: 999, border: '1.5px solid var(--line)', font: '600 11px Figtree', color: 'var(--ink60)' }}
        >
          {logged ? 'Sair' : 'Entrar'}
        </div>
      </div>
    </div>
  );
}
