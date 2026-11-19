import { useId } from 'react';

/** Traçado da onda do símbolo CarraWave Music (viewBox 48x32). */
export const WAVE_PATH =
  'M3.0 16.0L3.4 15.5L3.8 15.0L4.1 14.5L4.5 14.1L4.9 13.8L5.3 13.7L5.7 13.7L6.1 13.8L6.4 14.1L6.8 14.6L7.2 15.2L7.6 15.8L8.0 16.6L8.3 17.4L8.7 18.1L9.1 18.8L9.5 19.4L9.9 19.8L10.3 19.9L10.6 19.8L11.0 19.4L11.4 18.8L11.8 17.8L12.2 16.6L12.5 15.2L12.9 13.7L13.3 12.3L13.7 10.9L14.1 9.8L14.5 8.9L14.8 8.6L15.2 8.7L15.6 9.4L16.0 10.6L16.4 12.3L16.7 14.4L17.1 16.8L17.5 19.4L17.9 21.8L18.3 24.1L18.7 25.8L19.0 27.1L19.4 27.5L19.8 27.2L20.2 26.2L20.6 24.3L20.9 21.8L21.3 18.9L21.7 15.6L22.1 12.4L22.5 9.3L22.9 6.7L23.2 4.7L23.6 3.4L24.0 3.1L24.4 3.6L24.8 4.9L25.1 7.0L25.5 9.6L25.9 12.6L26.3 15.7L26.7 18.7L27.1 21.3L27.4 23.5L27.8 25.1L28.2 26.0L28.6 26.2L29.0 25.6L29.3 24.5L29.7 22.9L30.1 21.0L30.5 18.8L30.9 16.7L31.3 14.7L31.6 13.0L32.0 11.6L32.4 10.6L32.8 10.1L33.2 10.0L33.5 10.4L33.9 11.0L34.3 12.0L34.7 13.0L35.1 14.2L35.5 15.4L35.8 16.5L36.2 17.4L36.6 18.2L37.0 18.7L37.4 19.1L37.7 19.2L38.1 19.0L38.5 18.8L38.9 18.3L39.3 17.8L39.7 17.1L40.0 16.5L40.4 15.9L40.8 15.3L41.2 14.8L41.6 14.4L41.9 14.1L42.3 13.9L42.7 13.9L43.1 14.0L43.5 14.3L43.9 14.6L44.2 15.0L44.6 15.5L45.0 16.0';

/** Símbolo da marca: a onda em gradiente rosa → roxo → ciano. */
export function LogoMark({ size = 32, strokeWidth = 2.6 }: { size?: number; strokeWidth?: number }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg width={size * 1.5} height={size} viewBox="0 0 48 32" fill="none" aria-hidden="true" style={{ flex: 'none' }}>
      <defs>
        <linearGradient id={`cw-g-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--brand-pink)" />
          <stop offset="0.5" stopColor="var(--brand-purple)" />
          <stop offset="1" stopColor="var(--brand-cyan)" />
        </linearGradient>
      </defs>
      <path d={WAVE_PATH} stroke={`url(#cw-g-${id})`} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Logo completo: onda + "CarraWave" + "MUSIC". */
export function Logo({ size = 30, stacked = false }: { size?: number; stacked?: boolean }) {
  return (
    <div
      role="img"
      aria-label="CarraWave Music"
      style={{
        display: 'flex',
        flexDirection: stacked ? 'column' : 'row',
        alignItems: 'center',
        gap: stacked ? size * 0.25 : size * 0.3,
      }}
    >
      <LogoMark size={stacked ? size * 1.6 : size} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: stacked ? 'center' : 'flex-start', lineHeight: 1 }}>
        <span className="cw-display" style={{ fontSize: size * 0.66, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
          CarraWave
        </span>
        <span className="cw-brand-music" style={{ fontSize: size * 0.3, marginTop: size * 0.08, letterSpacing: stacked ? '0.55em' : '0.42em' }}>
          MUSIC
        </span>
      </div>
    </div>
  );
}
