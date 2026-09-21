import { apiFetch } from './client';
import type { CitySummary, GenreSummary, HistoryItem, MeResponse, PageResponse, StationSummary } from './types';

export interface StationQuery {
  [key: string]: string | number | boolean | undefined;
  city?: string;
  state?: string;
  genre?: string;
  q?: string;
  onlyLive?: boolean;
  sort?: 'popular' | 'name' | 'recent';
  page?: number;
  size?: number;
}

export function searchStations(query: StationQuery = {}): Promise<PageResponse<StationSummary>> {
  return apiFetch<PageResponse<StationSummary>>('/api/v1/stations', { query });
}

export function getStation(id: string): Promise<StationSummary & { similar?: StationSummary[] }> {
  return apiFetch(`/api/v1/stations/${id}`);
}

export function fetchNowPlaying(stationId: string): Promise<{ title: string | null }> {
  return apiFetch(`/api/v1/stations/${stationId}/now-playing`);
}

export function fetchCities(): Promise<CitySummary[]> {
  return apiFetch<CitySummary[]>('/api/v1/cities');
}

export function fetchGenres(): Promise<GenreSummary[]> {
  return apiFetch<GenreSummary[]>('/api/v1/genres');
}

export function fetchMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>('/api/v1/me');
}

export function fetchFavorites(): Promise<StationSummary[]> {
  return apiFetch<StationSummary[]>('/api/v1/me/favorites');
}

export function addFavorite(stationId: string): Promise<void> {
  return apiFetch<void>(`/api/v1/me/favorites/${stationId}`, { method: 'PUT' });
}

export function removeFavorite(stationId: string): Promise<void> {
  return apiFetch<void>(`/api/v1/me/favorites/${stationId}`, { method: 'DELETE' });
}

export function fetchHistory(size = 20): Promise<HistoryItem[]> {
  return apiFetch<HistoryItem[]>('/api/v1/me/history', { query: { size } });
}
