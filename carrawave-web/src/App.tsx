import { useEffect, useMemo, useRef, useState } from 'react';
import { Sidebar, type NavKey } from './components/Sidebar';
import { StationCard } from './components/StationCard';
import { StationRow } from './components/StationRow';
import { PlayerBar } from './components/PlayerBar';
import { Toast } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { GridIcon, ListIcon, SearchIcon, LockIcon } from './components/icons';
import { addFavorite, fetchCities, fetchFavorites, fetchGenres, fetchHistory, fetchMe, removeFavorite, searchStations } from './api/catalog';
import { logout } from './api/auth';
import type { CitySummary, GenreSummary, MeResponse, StationSummary } from './api/types';
import { usePlayerStore } from './store/playerStore';
import { audioEngine, type PlaybackSource } from './audio/AudioEngine';

const SIDEBAR_WIDTH = 238;

const TITLES: Record<NavKey, string> = {
  home: 'Ao vivo agora',
  explore: 'Explorar rádios',
  fav: 'Suas favoritas',
  recent: 'Ouvidas recentemente',
  settings: 'Configurações',
};

const SOURCE_BY_NAV: Record<NavKey, PlaybackSource> = {
  home: 'HOME_LIVE_NOW',
  explore: 'EXPLORE',
  fav: 'FAVORITES',
  recent: 'HISTORY',
  settings: 'EXPLORE',
};

export default function App() {
  const [nav, setNav] = useState<NavKey>('home');
  const [chip, setChip] = useState('Todas');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');

  const [cities, setCities] = useState<CitySummary[]>([]);
  const [genres, setGenres] = useState<GenreSummary[]>([]);
  const [stations, setStations] = useState<StationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [favorites, setFavorites] = useState<StationSummary[]>([]);
  const [history, setHistory] = useState<StationSummary[]>([]);
  const [authOpen, setAuthOpen] = useState(false);

  const current = usePlayerStore((s) => s.current);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const sleepTimer = usePlayerStore((s) => s.sleepTimer);
  const toast = usePlayerStore((s) => s.toast);
  const favIds = usePlayerStore((s) => s.favorites);

  const debounceRef = useRef<number | null>(null);

  const chips = useMemo(() => ['Todas', ...cities.slice(0, 2).map((c) => c.name), ...genres.slice(0, 6).map((g) => g.name)], [cities, genres]);

  async function refreshFavorites() {
    try {
      const favs = await fetchFavorites();
      setFavorites(favs);
      usePlayerStore.getState().setFavorites(favs.map((f) => f.id));
    } catch {
      // silencioso — favoritos recarregam na próxima ação
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const [c, g, meRes] = await Promise.all([fetchCities(), fetchGenres(), fetchMe()]);
        setCities(c);
        setGenres(g);
        setMe(meRes);
        await refreshFavorites();
      } catch {
        setLoadError('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      }
    })();
  }, []);

  useEffect(() => {
    if (nav === 'settings') return;
    if (nav === 'fav') {
      setStations(favorites);
      return;
    }

    setLoading(true);
    const cityMatch = cities.find((c) => c.name === chip);
    const genreMatch = genres.find((g) => g.name === chip);

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      try {
        if (nav === 'recent') {
          const items = await fetchHistory(30);
          setHistory(items);
          setStations(items);
        } else {
          const res = await searchStations({
            city: cityMatch?.id,
            genre: genreMatch?.id,
            q: query || undefined,
            sort: 'popular',
            size: 60,
          });
          setStations(res.content);
        }
        setLoadError(null);
      } catch {
        setLoadError('Não foi possível carregar as rádios agora.');
      } finally {
        setLoading(false);
      }
    }, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav, chip, query, cities, genres, favorites]);

  function isFavorited(stationId: string) {
    return favIds.has(stationId);
  }

  async function toggleFavorite(station: StationSummary) {
    const willFavorite = !isFavorited(station.id);
    usePlayerStore.getState().toggleFavorite(station.id);
    usePlayerStore.getState().showToast(willFavorite ? `${station.name} nos favoritos` : 'Removida dos favoritos');
    try {
      if (willFavorite) {
        await addFavorite(station.id);
      } else {
        await removeFavorite(station.id);
      }
      await refreshFavorites();
    } catch {
      usePlayerStore.getState().toggleFavorite(station.id);
      usePlayerStore.getState().showToast('Não foi possível atualizar os favoritos.');
    }
  }

  async function playStation(station: StationSummary) {
    usePlayerStore.getState().play(station);
    usePlayerStore.getState().showToast(`Tocando ${station.name}`);
    await audioEngine.load(station, SOURCE_BY_NAV[nav]);
  }

  async function togglePlay() {
    if (!current) return;
    if (isPlaying) {
      audioEngine.pause('USER_STOP');
      usePlayerStore.getState().setPlaying(false);
    } else {
      usePlayerStore.getState().setPlaying(true);
      await audioEngine.resume(current, SOURCE_BY_NAV[nav]);
    }
  }

  function handleVolumeChange(v: number) {
    usePlayerStore.getState().setVolume(v);
    audioEngine.syncVolume();
  }

  function handleSetSleepTimer(minutes: 15 | 30 | 60 | null) {
    usePlayerStore.getState().setSleepTimer(minutes);
    audioEngine.armSleepTimer(minutes);
  }

  async function handleAuthClick() {
    if (me?.accountType === 'REGISTERED') {
      await logout();
      const meRes = await fetchMe();
      setMe(meRes);
      usePlayerStore.getState().showToast('Sessão anônima');
    } else {
      setAuthOpen(true);
    }
  }

  async function handleAuthSuccess(info?: { favoritesMoved: number; sessionsMoved: number }) {
    setAuthOpen(false);
    const meRes = await fetchMe();
    setMe(meRes);
    await refreshFavorites();
    usePlayerStore.getState().showToast(info && info.favoritesMoved > 0 ? `Conectado — ${info.favoritesMoved} favoritas migradas` : 'Conectado');
  }

  const pageTitle = TITLES[nav];
  const showChips = nav === 'home' || nav === 'explore';
  const n = stations.length;

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        position: 'relative',
        background: 'var(--bg)',
      }}
    >
      <Sidebar nav={nav} onNavChange={(k) => { setNav(k); setQuery(''); }} favorites={favorites} onPlayFavorite={playStation} me={me} onAuthClick={handleAuthClick} />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 26px', borderBottom: '1px solid var(--line)' }}>
          <div
            style={{
              flex: 1,
              maxWidth: 430,
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              height: 44,
              padding: '0 18px',
              borderRadius: 999,
              background: 'var(--surf)',
              border: '1.5px solid var(--line)',
            }}
          >
            <SearchIcon />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rádio, cidade ou gênero"
              style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', font: '500 14px Figtree', color: 'var(--ink)' }}
            />
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 11px', borderRadius: 999, background: 'var(--accent-soft)', font: '600 11.5px Figtree', color: 'var(--accent-ink)' }}>
            <LockIcon />
            Conexão segura
          </div>
          <div style={{ display: 'flex', gap: 5, padding: 4, borderRadius: 999, background: 'var(--surf2)' }}>
            <div onClick={() => setView('grid')} style={{ cursor: 'pointer', width: 34, height: 30, borderRadius: 999, background: view === 'grid' ? 'var(--bg)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GridIcon />
            </div>
            <div onClick={() => setView('list')} style={{ cursor: 'pointer', width: 34, height: 30, borderRadius: 999, background: view === 'list' ? 'var(--bg)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ListIcon />
            </div>
          </div>
        </div>

        <div className="cw-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px 26px 110px' }}>
          {nav === 'settings' ? (
            <SettingsPanel me={me} />
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div className="cw-display" style={{ fontSize: 26, letterSpacing: '-.01em' }}>{pageTitle}</div>
                <div style={{ font: '500 13px Figtree', color: 'var(--ink60)' }}>{n === 1 ? '1 emissora' : `${n} emissoras`}</div>
              </div>

              {showChips && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
                  {chips.map((c) => (
                    <div
                      key={c}
                      onClick={() => setChip(c)}
                      className="cw-navitem"
                      style={{
                        cursor: 'pointer',
                        padding: '8px 16px',
                        borderRadius: 999,
                        border: `1.5px solid ${c === chip ? 'var(--ink)' : 'var(--line)'}`,
                        background: c === chip ? 'var(--ink)' : 'transparent',
                        color: c === chip ? 'var(--bg)' : 'var(--ink)',
                        font: '600 12.5px Figtree',
                      }}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}

              {loadError && (
                <div style={{ marginTop: 24, padding: '16px 20px', borderRadius: 18, background: 'var(--accent-soft)', color: 'var(--accent-ink)', font: '600 13px Figtree' }}>
                  {loadError}
                </div>
              )}

              {!loadError && !loading && n === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '80px 40px' }}>
                  <div style={{ width: 96, height: 96, borderRadius: 999, background: 'var(--surf2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SearchIcon size={40} color="var(--ink40)" />
                  </div>
                  <div className="cw-display" style={{ fontSize: 21, marginTop: 22 }}>Nenhuma rádio encontrada.</div>
                  <div style={{ font: '500 14px Figtree', color: 'var(--ink60)', marginTop: 9 }}>Tente outro nome, cidade ou gênero.</div>
                </div>
              )}

              {!loadError && n > 0 && view === 'grid' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(176px, 1fr))', gap: '22px 18px', marginTop: 24 }}>
                  {stations.map((st) => (
                    <StationCard key={st.id} station={st} favorited={isFavorited(st.id)} onPlay={() => playStation(st)} onToggleFavorite={() => toggleFavorite(st)} />
                  ))}
                </div>
              )}

              {!loadError && n > 0 && view === 'list' && (
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column' }}>
                  {stations.map((st) => (
                    <StationRow key={st.id} station={st} favorited={isFavorited(st.id)} onPlay={() => playStation(st)} onToggleFavorite={() => toggleFavorite(st)} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <PlayerBar
        station={current}
        isPlaying={isPlaying}
        favorited={current ? isFavorited(current.id) : false}
        volume={volume}
        sleepTimer={sleepTimer}
        onTogglePlay={togglePlay}
        onToggleFavorite={() => current && toggleFavorite(current)}
        onVolumeChange={handleVolumeChange}
        onSetSleepTimer={handleSetSleepTimer}
        sidebarWidth={SIDEBAR_WIDTH}
      />

      <Toast message={toast?.message ?? null} sidebarWidth={SIDEBAR_WIDTH} />

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />}
    </div>
  );
}

function SettingsPanel({ me }: { me: MeResponse | null }) {
  return (
    <div style={{ maxWidth: 480 }}>
      <div className="cw-display" style={{ fontSize: 26 }}>Configurações</div>
      <div style={{ marginTop: 20, padding: 18, borderRadius: 20, background: 'var(--surf)', border: '1px solid var(--line)' }}>
        <div style={{ font: '700 13px Figtree' }}>Conta</div>
        <div style={{ font: '500 13px Figtree', color: 'var(--ink60)', marginTop: 6 }}>
          {me?.accountType === 'REGISTERED' ? `${me.displayName ?? ''} · ${me.email ?? ''}` : `Convidado · ${me?.anonymousLabel ?? ''}`}
        </div>
        <div style={{ font: '500 12.5px Figtree', color: 'var(--ink40)', marginTop: 10 }}>
          {me?.favoriteCount ?? 0} rádio(s) favoritada(s).
        </div>
      </div>
      <div style={{ marginTop: 16, font: '500 12.5px Figtree', color: 'var(--ink40)' }}>
        Suas preferências de tema, qualidade de áudio e reprodução automática podem ser ajustadas na versão mobile e sincronizam com esta conta.
      </div>
    </div>
  );
}
