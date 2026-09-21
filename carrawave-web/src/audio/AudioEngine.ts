import type Hls from 'hls.js';
import { apiFetch } from '../api/client';
import { usePlayerStore } from '../store/playerStore';
import type { StationSummary } from '../api/types';

/**
 * Regra de ouro do áudio (ver MANUAL-CARRA-WAVE.md): existe UM único
 * elemento <audio>, criado FORA do React, que nunca é desmontado por um
 * re-render. Trocar de estação troca a fonte desse mesmo elemento — nunca
 * criamos um novo <audio> por componente/card.
 */
export type PlaybackSource =
  | 'HOME_LIVE_NOW'
  | 'HOME_SECTION'
  | 'EXPLORE'
  | 'SEARCH'
  | 'FAVORITES'
  | 'HISTORY'
  | 'STATION_DETAIL'
  | 'MINI_PLAYER';

function uuidv4(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class AudioEngine {
  private audio: HTMLAudioElement;
  private hls: Hls | null = null;
  private currentSessionId: string | null = null;
  private heartbeatHandle: number | null = null;
  private sleepTimerHandle: number | null = null;
  private startedAt: number | null = null;

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'none';
    // Sem crossOrigin: os relays de rádio de terceiros (ICECAST) não mandam
    // cabeçalho Access-Control-Allow-Origin, e não precisamos ler os bytes do
    // áudio via JS (Web Audio API/canvas) — só reproduzir. Com crossOrigin
    // definido, o navegador exige CORS e bloqueia a reprodução com
    // "blocked by CORS policy" mesmo a URL sendo válida (200 OK).

    this.audio.addEventListener('waiting', () => usePlayerStore.getState().setBuffering(true));
    this.audio.addEventListener('playing', () => usePlayerStore.getState().setBuffering(false));
    this.audio.addEventListener('canplay', () => usePlayerStore.getState().setBuffering(false));
    this.audio.addEventListener('pause', () => {
      // Só reflete no estado se não fomos nós que pausamos via troca de fonte.
      if (usePlayerStore.getState().isPlaying) {
        usePlayerStore.getState().setPlaying(false);
      }
    });
    this.audio.addEventListener('error', () => {
      usePlayerStore.getState().setBuffering(false);
      usePlayerStore.getState().setPlaying(false);
      usePlayerStore.getState().showToast('Não foi possível reproduzir esta rádio agora.');
      this.stopTelemetry('ERROR');
    });

    this.applyVolume();
  }

  private applyVolume() {
    const { volume, muted } = usePlayerStore.getState();
    this.audio.volume = volume;
    this.audio.muted = muted;
  }

  syncVolume() {
    this.applyVolume();
  }

  private teardownHls() {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
  }

  async load(station: StationSummary, source: PlaybackSource = 'EXPLORE') {
    this.teardownHls();
    this.stopTelemetry('SWITCHED_STATION');

    if (station.streamFormat === 'HLS') {
      // hls.js só é baixado quando alguma estação realmente precisa dele —
      // as 13 rádios agregadas hoje são ICECAST/MP3, então o caminho comum
      // nunca paga esse custo de bundle.
      const { default: HlsCtor } = await import('hls.js');
      if (HlsCtor.isSupported()) {
        const hls = new HlsCtor({ enableWorker: true });
        hls.loadSource(station.streamUrl);
        hls.attachMedia(this.audio);
        hls.on(HlsCtor.Events.ERROR, (_evt, data) => {
          if (data.fatal) {
            usePlayerStore.getState().showToast('Sinal instável para esta rádio.');
            usePlayerStore.getState().setPlaying(false);
          }
        });
        this.hls = hls;
      } else {
        // Safari/iOS reproduzem HLS nativamente via <audio src>.
        this.audio.src = station.streamUrl;
      }
    } else {
      // ICECAST / MP3: src direto é suficiente.
      this.audio.src = station.streamUrl;
    }

    this.applyVolume();
    await this.play();
    this.startTelemetry(station, source);
  }

  async play() {
    try {
      await this.audio.play();
    } catch {
      // Autoplay bloqueado ou stream ainda carregando — o listener de
      // "playing"/"error" cuida de refletir o estado real.
    }
  }

  /** Retoma a estação atual (após pausa manual), abrindo uma nova sessão de telemetria. */
  async resume(station: StationSummary, source: PlaybackSource = 'MINI_PLAYER') {
    await this.play();
    if (!this.currentSessionId) {
      this.startTelemetry(station, source);
    }
  }

  pause(reason: 'USER_STOP' | 'SLEEP_TIMER' = 'USER_STOP') {
    this.audio.pause();
    this.stopTelemetry(reason);
  }

  private playedSeconds(): number {
    if (!this.startedAt) return 0;
    return Math.round((Date.now() - this.startedAt) / 1000);
  }

  private async startTelemetry(station: StationSummary, source: PlaybackSource) {
    this.startedAt = Date.now();
    try {
      const res = await apiFetch<{ sessionId: string }>('/api/v1/playback/start', {
        method: 'POST',
        body: {
          stationId: station.id,
          clientSessionId: uuidv4(),
          startedAt: new Date(this.startedAt).toISOString(),
          source,
        },
      });
      this.currentSessionId = res.sessionId;
      this.heartbeatHandle = window.setInterval(() => {
        if (this.currentSessionId) {
          apiFetch(`/api/v1/playback/${this.currentSessionId}/heartbeat`, {
            method: 'POST',
            body: { playedSeconds: this.playedSeconds() },
          }).catch(() => {
            // Telemetria não deve nunca derrubar a reprodução — falha aqui é silenciosa.
          });
        }
      }, 60_000);
    } catch {
      // Reprodução continua mesmo se a telemetria falhar ao iniciar.
    }
  }

  private stopTelemetry(reason: 'USER_STOP' | 'SLEEP_TIMER' | 'ERROR' | 'SWITCHED_STATION' = 'USER_STOP') {
    if (this.heartbeatHandle !== null) {
      window.clearInterval(this.heartbeatHandle);
      this.heartbeatHandle = null;
    }
    if (this.currentSessionId) {
      const sessionId = this.currentSessionId;
      const playedSeconds = this.playedSeconds();
      this.currentSessionId = null;
      this.startedAt = null;
      apiFetch(`/api/v1/playback/${sessionId}/stop`, {
        method: 'POST',
        body: { playedSeconds, reason },
      }).catch(() => {
        // best-effort
      });
    }
  }

  armSleepTimer(minutes: number | null) {
    if (this.sleepTimerHandle !== null) {
      window.clearTimeout(this.sleepTimerHandle);
      this.sleepTimerHandle = null;
    }
    if (minutes) {
      this.sleepTimerHandle = window.setTimeout(() => {
        this.pause('SLEEP_TIMER');
        usePlayerStore.getState().setPlaying(false);
        usePlayerStore.getState().clearSleepTimer();
        usePlayerStore.getState().showToast('Temporizador: reprodução pausada.');
      }, minutes * 60_000);
    }
  }

  teardown() {
    this.stopTelemetry();
    this.teardownHls();
    this.audio.pause();
    this.audio.src = '';
  }
}

export const audioEngine = new AudioEngine();
