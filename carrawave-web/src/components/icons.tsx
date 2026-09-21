// Ícones inline (mesmos paths do design original) — sem dependência de
// biblioteca de ícones externa, para manter o bundle enxuto.
import type { CSSProperties } from 'react';

interface IconProps {
  size?: number;
  color?: string;
  style?: CSSProperties;
}

export function HeartIcon({ size = 17, filled, color = 'currentColor', style }: IconProps & { filled: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill={filled ? color : 'none'} stroke={filled ? 'none' : color} strokeWidth={2.4} strokeLinejoin="round">
      <path d="M12 20.3S3.8 15 3.8 9.4A4.6 4.6 0 0112 7.3a4.6 4.6 0 018.2 2.1c0 5.6-8.2 10.9-8.2 10.9z" />
    </svg>
  );
}

export function PlayIcon({ size = 15, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill={color}>
      <path d="M8 5.4a1 1 0 011.5-.87l9 6.6a1 1 0 010 1.74l-9 6.6A1 1 0 018 18.6z" />
    </svg>
  );
}

export function PauseIcon({ width = 4, height = 17, color = 'currentColor', gap = 4 }: { width?: number; height?: number; color?: string; gap?: number }) {
  return (
    <div style={{ display: 'flex', gap }}>
      <div style={{ width, height, borderRadius: 2, background: color }} />
      <div style={{ width, height, borderRadius: 2, background: color }} />
    </div>
  );
}

export function SearchIcon({ size = 16, color = 'var(--ink40)', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill="none" stroke={color} strokeWidth={2.75} strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
    </svg>
  );
}

export function GridIcon({ size = 15, color = 'var(--ink)' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </svg>
  );
}

export function ListIcon({ size = 15, color = 'var(--ink)' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.75} strokeLinecap="round">
      <path d="M4 6.5h16M4 12h16M4 17.5h16" />
    </svg>
  );
}

export function ClockIcon({ size = 15, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round">
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 9.8v3.7l2.4 1.6" />
    </svg>
  );
}

export function VolumeIcon({ size = 17, color = 'var(--ink60)' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round">
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
      <path d="M16 9.5a3.5 3.5 0 010 5" />
    </svg>
  );
}

export function LockIcon({ size = 12, color = 'var(--accent-2)' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.75} strokeLinecap="round">
      <rect x="5" y="11" width="14" height="9.5" rx="2.5" />
      <path d="M8.5 11V8a3.5 3.5 0 017 0v3" />
    </svg>
  );
}

export function CheckIcon({ size = 17, color = 'var(--accent)' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function HomeIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11.5L12 4l8 7.5" />
      <path d="M6 10v9.5h12V10" />
    </svg>
  );
}

export function CompassIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.6 9.4l-2 5.2-5.2 2 2-5.2z" />
    </svg>
  );
}

export function SettingsIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.4M12 18.1v2.4M4.4 7l2 1.2M17.6 15.8l2 1.2M4.4 17l2-1.2M17.6 8.2l2-1.2M2.9 12h2.4M18.7 12h2.4" />
    </svg>
  );
}

export function MicIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round">
      <rect x="8.5" y="3" width="7" height="12" rx="3.5" />
      <path d="M5.5 12.5a6.5 6.5 0 0013 0" />
      <path d="M12 19v2.4M8.8 21.4h6.4" />
    </svg>
  );
}

export function CarnivalMaskIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9c0-2.6 2-4.5 4.5-4.5 1.6 0 2.8.7 3.5 1.7.7-1 1.9-1.7 3.5-1.7C17 4.5 19 6.4 19 9c0 3.6-2.6 6.7-6 7.8V18a1 1 0 01-2 0v-1.2c-3.4-1.1-6-4.2-6-7.8z" />
      <circle cx="8" cy="9" r="1.4" fill={color} stroke="none" />
      <circle cx="16" cy="9" r="1.4" fill={color} stroke="none" />
      <path d="M4.5 6.8L2.5 5.4M19.5 6.8l2-1.4M5 3.2l.8 1.8M19 3.2l-.8 1.8" />
    </svg>
  );
}

export function GitHubIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.01 3.25 9.26 7.77 10.76.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.16.69-3.83-1.34-3.83-1.34-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04 0 4.35-2.66 5.31-5.19 5.59.41.35.77 1.04.77 2.11 0 1.52-.01 2.75-.01 3.13 0 .3.2.66.79.55A11.53 11.53 0 0 0 23.5 12.02C23.5 5.74 18.27.5 12 .5z" />
    </svg>
  );
}

export function InstagramIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill={color} stroke="none" />
    </svg>
  );
}

export function MailIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="M3.5 6.2l8 6.2 8-6.2" />
    </svg>
  );
}
