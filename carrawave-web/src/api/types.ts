export interface CitySummary {
  id: string;
  name: string;
  state: string;
  stationCount?: number;
}

export interface GenreSummary {
  id: string;
  name: string;
  slug: string;
  stationCount?: number;
}

export interface StationSummary {
  id: string;
  name: string;
  slug: string;
  frequency: string;
  city: CitySummary;
  genres: GenreSummary[];
  streamUrl: string;
  streamFormat: 'HLS' | 'ICECAST' | 'MP3';
  artworkUrl: string | null;
  artworkColor: string | null;
  initials: string | null;
  website: string | null;
  description: string | null;
  live: boolean;
  listenersNow: number | null;
  favorited: boolean;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface HomeResponse {
  greeting: string;
  liveNow: StationSummary[];
  sections: { key: string; title: string; stations: StationSummary[] }[];
  genres: GenreSummary[];
}

export interface AuthResponse {
  userId: string;
  accountType: 'ANONYMOUS' | 'REGISTERED';
  displayName?: string;
  email?: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  merged?: { favoritesMoved: number; sessionsMoved: number };
}

export interface MeResponse {
  userId: string;
  accountType: 'ANONYMOUS' | 'REGISTERED';
  displayName: string | null;
  email: string | null;
  deviceId: string;
  anonymousLabel: string | null;
  favoriteCount: number;
  createdAt: string;
}

export interface HistoryItem extends StationSummary {
  lastPlayedAt: string;
}

export interface SettingsResponse {
  theme: 'LIGHT' | 'DARK' | 'SYSTEM';
  audioQuality: 'AUTO' | 'HIGH' | 'DATA_SAVER';
  autoplay: boolean;
  sleepTimerMinutes: number | null;
}

export interface ApiErrorBody {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
