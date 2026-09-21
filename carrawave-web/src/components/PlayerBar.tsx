import { useState } from 'react';
import type { StationSummary } from '../api/types';
import { stationGradient, stationInitials } from '../utils/gradient';
import { CheckIcon, ClockIcon, HeartIcon, PauseIcon, PlayIcon, VolumeIcon } from './icons';
import type { SleepTimerOption } from '../store/playerStore';
import { useIsMobile } from '../hooks/useIsMobile';

const TIMER_OPTIONS: { label: string; minutes: SleepTimerOption }[] = [
  { label: '15 minutos', minutes: 15 },
  { label: '30 minutos', minutes: 30 },
  { label: '1 hora', minutes: 60 },
];

interface Props {
  station: StationSummary | null;
  isPlaying: boolean;
  favorited: boolean;
  volume: number;
  sleepTimer: SleepTimerOption;
  onTogglePlay: () => void;
  onToggleFavorite: () => void;
  onVolumeChange: (v: number) => void;
  onSetSleepTimer: (minutes: SleepTimerOption) => void;
  onExpand?: () => void;
  sidebarWidth: number;
  bottomOffset?: number;
}

export function PlayerBar({
  station,
  isPlaying,
  favorited,
  volume,
  sleepTimer,
  onTogglePlay,
  onToggleFavorite,
  onVolumeChange,
  onSetSleepTimer,
  onExpand,
  sidebarWidth,
  bottomOffset = 0,
}: Props) {
  const [timerOpen, setTimerOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!station) {
    return null;
  }

  if (isMobile) {
    return (
      <>
        {timerOpen && (
          <div
            style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: `0 16px ${bottomOffset + 76 + 12}px` }}
          >
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginTop: 12, padding: '0 2px' }}>
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

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: bottomOffset,
            zIndex: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 14px',
            background: 'var(--surf)',
            borderTop: '1px solid var(--line)',
            boxShadow: '0 -8px 26px -18px rgba(46,43,37,.6)',
          }}
        >
          <div
            onClick={() => onExpand?.()}
            style={{
              flex: 'none',
              width: 42,
              height: 42,
              borderRadius: 14,
              background: stationGradient(station),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              font: '400 15px Caprasimo, serif',
              color: 'rgba(255,255,255,.95)',
            }}
          >
            {stationInitials(station)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }} onClick={() => onExpand?.()}>
            <div style={{ font: '700 13.5px Figtree', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{station.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <div style={{ flex: 'none', width: 5, height: 5, borderRadius: 999, background: 'var(--accent)', animation: 'cw-pulse 1.5s infinite' }} />
              <span style={{ font: '500 11.5px Figtree', color: 'var(--ink60)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Ao vivo · {station.city.name}
              </span>
            </div>
          </div>
          <div onClick={onToggleFavorite} style={{ cursor: 'pointer', flex: 'none', width: 34, height: 34, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HeartIcon size={18} filled={favorited} color={favorited ? 'var(--accent)' : 'var(--ink40)'} />
          </div>
          <div
            onClick={onTogglePlay}
            style={{
              cursor: 'pointer',
              flex: 'none',
              width: 42,
              height: 42,
              borderRadius: 999,
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px -10px var(--accent)',
            }}
          >
            {isPlaying ? <PauseIcon height={15} color="var(--onacc)" /> : <PlayIcon size={16} color="var(--onacc)" />}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {timerOpen && (
        <div
          style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '0 26px 88px' }}
        >
          <div onClick={() => setTimerOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(24,16,10,.28)' }} />
          <div
            style={{
              position: 'relative',
              width: 268,
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
              Desativar
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          left: sidebarWidth,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '12px 26px',
          background: 'var(--surf)',
          borderTop: '1px solid var(--line)',
          boxShadow: '0 -8px 26px -18px rgba(46,43,37,.6)',
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
            font: '400 18px Caprasimo, serif',
            color: 'rgba(255,255,255,.95)',
          }}
        >
          {stationInitials(station)}
        </div>
        <div style={{ flex: 'none', width: 190, minWidth: 0 }}>
          <div style={{ font: '700 14px Figtree', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{station.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <div style={{ flex: 'none', width: 5, height: 5, borderRadius: 999, background: 'var(--accent)', animation: 'cw-pulse 1.5s infinite' }} />
            <span style={{ font: '500 12px Figtree', color: 'var(--ink60)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Ao vivo · {station.city.name}
            </span>
          </div>
        </div>
        <div onClick={onToggleFavorite} className="cw-hover-soft" style={{ cursor: 'pointer', flex: 'none', width: 36, height: 36, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <HeartIcon size={19} filled={favorited} color={favorited ? 'var(--accent)' : 'var(--ink40)'} />
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            onClick={onTogglePlay}
            className="cw-hover-dim"
            style={{
              cursor: 'pointer',
              width: 50,
              height: 50,
              borderRadius: 999,
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px -10px var(--accent)',
            }}
          >
            {isPlaying ? <PauseIcon height={17} color="var(--onacc)" /> : <PlayIcon size={18} color="var(--onacc)" />}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 20, opacity: isPlaying ? 1 : 0.25 }}>
            {[0, 0.12, 0.24, 0.36, 0.48].map((delay, i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  height: '100%',
                  borderRadius: 9,
                  background: i === 2 ? 'var(--accent-2)' : 'var(--accent)',
                  animation: `cw-wave 1.1s ${delay}s infinite ease-in-out`,
                }}
              />
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, flex: 'none', width: 170 }}>
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
        <div
          onClick={() => setTimerOpen(true)}
          className="cw-hover-dim"
          style={{
            cursor: 'pointer',
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '7px 13px',
            borderRadius: 999,
            background: sleepTimer ? 'var(--accent-soft)' : 'var(--surf2)',
            font: '600 12px Figtree',
            color: sleepTimer ? 'var(--accent-ink)' : 'var(--ink60)',
          }}
        >
          <ClockIcon />
          {sleepTimer ? `${sleepTimer} min` : 'Temporizador'}
        </div>
      </div>
    </>
  );
}
