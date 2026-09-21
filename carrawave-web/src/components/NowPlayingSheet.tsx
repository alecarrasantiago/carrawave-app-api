import { useState } from 'react';
import type { StationSummary } from '../api/types';
import { stationGradient, stationInitials } from '../utils/gradient';
import { CheckIcon, ChevronDownIcon, ClockIcon, HeartIcon, PauseIcon, PlayIcon, VolumeIcon } from './icons';
import type { SleepTimerOption } from '../store/playerStore';
import { useNowPlaying } from '../hooks/useNowPlaying';

const TIMER_OPTIONS: { label: string; minutes: SleepTimerOption }[] = [
  { label: '15 minutos', minutes: 15 },
  { label: '30 minutos', minutes: 30 },
  { label: '1 hora', minutes: 60 },
];

interface Props {
  open: boolean;
  onClose: () => void;
  station: StationSummary | null;
  isPlaying: boolean;
  favorited: boolean;
  volume: number;
  sleepTimer: SleepTimerOption;
  onTogglePlay: () => void;
  onToggleFavorite: () => void;
  onVolumeChange: (v: number) => void;
  onSetSleepTimer: (minutes: SleepTimerOption) => void;
}

/**
 * Tela cheia de "tocando agora" pro mobile — mesma ideia do player expandido
 * do Spotify/Apple Music: capa grande, nome da rádio, música atual (quando a
 * emissora manda esse metadado) e os controles principais. Abre por cima do
 * resto do app sem interromper a reprodução; fechar aqui só volta pra barra
 * compacta de baixo, o áudio continua tocando.
 */
export function NowPlayingSheet({
  open,
  onClose,
  station,
  isPlaying,
  favorited,
  volume,
  sleepTimer,
  onTogglePlay,
  onToggleFavorite,
  onVolumeChange,
  onSetSleepTimer,
}: Props) {
  const [timerOpen, setTimerOpen] = useState(false);
  const nowPlayingTitle = useNowPlaying(station?.id ?? null, open && isPlaying);

  if (!open || !station) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
        animation: 'cw-in .22s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 18px 4px' }}>
        <div
          onClick={onClose}
          style={{ cursor: 'pointer', width: 38, height: 38, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surf2)' }}
        >
          <ChevronDownIcon size={22} color="var(--ink)" />
        </div>
        <div style={{ font: '700 11px Figtree', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink40)' }}>
          Tocando agora
        </div>
        <div style={{ width: 38, height: 38 }} />
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', overflow: 'hidden' }}>
        <div
          style={{
            width: 'min(74vw, 300px)',
            height: 'min(74vw, 300px)',
            borderRadius: 28,
            background: stationGradient(station),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: '400 68px Caprasimo, serif',
            color: 'rgba(255,255,255,.95)',
            boxShadow: '0 28px 60px -24px rgba(46,43,37,.5)',
            flex: 'none',
          }}
        >
          {stationInitials(station)}
        </div>

        <div style={{ marginTop: 32, width: '100%', textAlign: 'center' }}>
          <div className="cw-display" style={{ fontSize: 24, letterSpacing: '-.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {station.name}
          </div>
          <div style={{ marginTop: 8, minHeight: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {nowPlayingTitle ? (
              <span style={{ font: '600 14px Figtree', color: 'var(--ink60)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {nowPlayingTitle}
              </span>
            ) : (
              <>
                <div style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)', animation: 'cw-pulse 1.5s infinite' }} />
                <span style={{ font: '600 14px Figtree', color: 'var(--ink60)' }}>Ao vivo · {station.city.name}</span>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 40 }}>
          <div onClick={onToggleFavorite} style={{ cursor: 'pointer', width: 46, height: 46, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HeartIcon size={23} filled={favorited} color={favorited ? 'var(--accent)' : 'var(--ink40)'} />
          </div>
          <div
            onClick={onTogglePlay}
            style={{
              cursor: 'pointer',
              width: 72,
              height: 72,
              borderRadius: 999,
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 14px 30px -12px var(--accent)',
            }}
          >
            {isPlaying ? <PauseIcon height={22} color="var(--onacc)" /> : <PlayIcon size={24} color="var(--onacc)" />}
          </div>
          <div
            onClick={() => setTimerOpen(true)}
            style={{
              cursor: 'pointer',
              width: 46,
              height: 46,
              borderRadius: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: sleepTimer ? 'var(--accent-soft)' : 'transparent',
            }}
          >
            <ClockIcon size={20} color={sleepTimer ? 'var(--accent-ink)' : 'var(--ink40)'} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginTop: 34, width: '100%', maxWidth: 280 }}>
          <VolumeIcon />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--accent)' }}
          />
        </div>
      </div>

      {timerOpen && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 16px 28px' }}>
          <div onClick={() => setTimerOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(24,16,10,.28)' }} />
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 320,
              borderRadius: 24,
              background: 'var(--surf)',
              border: '1.5px solid var(--line)',
              boxShadow: '0 20px 44px -18px rgba(46,43,37,.6)',
              padding: 16,
              animation: 'cw-in .2s ease',
            }}
          >
            <div className="cw-display" style={{ fontSize: 18 }}>Temporizador</div>
            <div style={{ font: '500 12px Figtree', color: 'var(--ink60)', marginTop: 4 }}>A reprodução para no fim do tempo.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 12 }}>
              {TIMER_OPTIONS.map((t) => (
                <div
                  key={t.label}
                  onClick={() => {
                    onSetSleepTimer(t.minutes);
                    setTimerOpen(false);
                  }}
                  className="cw-hover-surf2"
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 13px',
                    borderRadius: 16,
                    background: sleepTimer === t.minutes ? 'var(--accent-soft)' : 'transparent',
                    font: '600 13.5px Figtree',
                    color: sleepTimer === t.minutes ? 'var(--accent-ink)' : 'var(--ink)',
                  }}
                >
                  {t.label}
                  {sleepTimer === t.minutes && <CheckIcon />}
                </div>
              ))}
            </div>
            <div
              onClick={() => {
                onSetSleepTimer(null);
                setTimerOpen(false);
              }}
              className="cw-hover-surf2"
              style={{
                cursor: 'pointer',
                marginTop: 10,
                height: 42,
                borderRadius: 999,
                border: '1.5px solid var(--line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                font: '600 13px Figtree',
                color: 'var(--ink60)',
              }}
            >
              Fechar
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
