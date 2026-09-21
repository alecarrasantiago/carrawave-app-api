import { create } from 'zustand';
import type { StationSummary } from '../api/types';

export type SleepTimerOption = 15 | 30 | 60 | null;

interface ToastState {
  id: number;
  message: string;
}

interface PlayerState {
  // Estação atualmente carregada no <audio> (pode estar pausada).
  current: StationSummary | null;
  isPlaying: boolean;
  isBuffering: boolean;
  volume: number;
  muted: boolean;
  favorites: Set<string>;
  sleepTimer: SleepTimerOption;
  sleepTimerEndsAt: number | null;
  toast: ToastState | null;

  play: (station: StationSummary) => void;
  togglePlay: () => void;
  pause: () => void;
  setPlaying: (playing: boolean) => void;
  setBuffering: (buffering: boolean) => void;
  setVolume: (v: number) => void;
  toggleMuted: () => void;
  toggleFavorite: (stationId: string) => void;
  setFavorites: (ids: string[]) => void;
  setSleepTimer: (minutes: SleepTimerOption) => void;
  clearSleepTimer: () => void;
  showToast: (message: string) => void;
  dismissToast: () => void;
}

let toastCounter = 0;

export const usePlayerStore = create<PlayerState>((set, get) => ({
  current: null,
  isPlaying: false,
  isBuffering: false,
  volume: 0.85,
  muted: false,
  favorites: new Set(),
  sleepTimer: null,
  sleepTimerEndsAt: null,
  toast: null,

  play: (station) => {
    set({ current: station, isPlaying: true });
  },
  togglePlay: () => {
    const { current, isPlaying } = get();
    if (!current) return;
    set({ isPlaying: !isPlaying });
  },
  pause: () => set({ isPlaying: false }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setBuffering: (buffering) => set({ isBuffering: buffering }),
  setVolume: (v) => set({ volume: Math.max(0, Math.min(1, v)), muted: v === 0 }),
  toggleMuted: () => set((s) => ({ muted: !s.muted })),
  toggleFavorite: (stationId) => {
    set((s) => {
      const next = new Set(s.favorites);
      if (next.has(stationId)) {
        next.delete(stationId);
      } else {
        next.add(stationId);
      }
      return { favorites: next };
    });
  },
  setFavorites: (ids) => set({ favorites: new Set(ids) }),
  setSleepTimer: (minutes) => {
    set({
      sleepTimer: minutes,
      sleepTimerEndsAt: minutes ? Date.now() + minutes * 60_000 : null,
    });
  },
  clearSleepTimer: () => set({ sleepTimer: null, sleepTimerEndsAt: null }),
  showToast: (message) => set({ toast: { id: ++toastCounter, message } }),
  dismissToast: () => set({ toast: null }),
}));
