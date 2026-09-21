import type { StationSummary } from '../api/types';
import { stationGradient, stationInitials } from '../utils/gradient';
import { HeartIcon, PlayIcon } from './icons';

interface Props {
  station: StationSummary;
  favorited: boolean;
  onPlay: () => void;
  onToggleFavorite: () => void;
}

export function StationCard({ station, favorited, onPlay, onToggleFavorite }: Props) {
  return (
    <div onClick={onPlay} style={{ cursor: 'pointer', animation: 'cw-in .3s ease' }}>
      <div
        className="cw-card-art"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1',
          borderRadius: 24,
          background: stationGradient(station),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          font: '400 38px Caprasimo, serif',
          color: 'rgba(255,255,255,.95)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {stationInitials(station)}
        {station.live && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 9px',
              borderRadius: 999,
              background: 'rgba(24,16,10,.5)',
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: 999, background: '#ffd7bd', animation: 'cw-pulse 1.5s infinite' }} />
            <span style={{ font: "500 8.5px 'IBM Plex Mono', monospace", letterSpacing: '.1em', color: '#fff' }}>AO VIVO</span>
          </div>
        )}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <HeartIcon filled={favorited} color={favorited ? '#fff' : 'rgba(255,255,255,.92)'} />
        </div>
        <div
          style={{
            position: 'absolute',
            right: 10,
            bottom: 10,
            width: 38,
            height: 38,
            borderRadius: 999,
            background: 'var(--bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 5px 14px rgba(24,16,10,.3)',
          }}
        >
          <PlayIcon color="var(--ink)" />
        </div>
      </div>
      <div style={{ font: '700 14px Figtree', marginTop: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{station.name}</div>
      <div style={{ font: '500 12px Figtree', color: 'var(--ink60)', marginTop: 2 }}>
        {station.frequency} · {station.city.name}
      </div>
    </div>
  );
}
