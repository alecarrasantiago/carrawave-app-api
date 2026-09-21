import type { StationSummary } from '../api/types';
import { stationGradient, stationInitials, formatListeners } from '../utils/gradient';
import { HeartIcon, PlayIcon } from './icons';

interface Props {
  station: StationSummary;
  favorited: boolean;
  onPlay: () => void;
  onToggleFavorite: () => void;
}

export function StationRow({ station, favorited, onPlay, onToggleFavorite }: Props) {
  return (
    <>
      <div
        onClick={onPlay}
        className="cw-row"
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 15,
          padding: '11px 12px',
          margin: '0 -12px',
          borderRadius: 20,
        }}
      >
        <div
          style={{
            flex: 'none',
            width: 52,
            height: 52,
            borderRadius: 17,
            background: stationGradient(station),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: '400 17px Caprasimo, serif',
            color: 'rgba(255,255,255,.95)',
          }}
        >
          {stationInitials(station)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: '700 14.5px Figtree', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{station.name}</div>
          <div style={{ font: '500 12.5px Figtree', color: 'var(--ink60)', marginTop: 2 }}>
            {station.frequency} · {station.city.name}
          </div>
        </div>
        <div style={{ flex: 'none', width: 100, font: '500 12.5px Figtree', color: 'var(--ink60)' }}>{station.genres[0]?.name ?? ''}</div>
        <div style={{ flex: 'none', width: 96, font: '500 12.5px Figtree', color: 'var(--ink40)' }}>{formatListeners(station.listenersNow)}</div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="cw-hover-soft"
          style={{ flex: 'none', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999 }}
        >
          <HeartIcon size={18} filled={favorited} color={favorited ? 'var(--accent)' : 'var(--ink40)'} />
        </div>
        <div
          className="cw-hover-accent"
          style={{
            flex: 'none',
            width: 38,
            height: 38,
            borderRadius: 999,
            border: '1.5px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PlayIcon size={13} color="var(--ink)" />
        </div>
      </div>
      <div style={{ height: 1, background: 'var(--line)', marginLeft: 67 }} />
    </>
  );
}
