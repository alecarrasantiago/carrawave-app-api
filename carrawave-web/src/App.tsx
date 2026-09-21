import { useEffect, useMemo, useRef, useState } from 'react';
import { Sidebar, type NavKey } from './components/Sidebar';
import { StationCard } from './components/StationCard';
import { StationRow } from './components/StationRow';
import { PlayerBar } from './components/PlayerBar';
import { Toast } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { WelcomeGate } from './components/WelcomeGate';
import { GridIcon, ListIcon, SearchIcon, LockIcon, MicIcon, GitHubIcon, InstagramIcon, MailIcon } from './components/icons';
import { addFavorite, fetchCities, fetchFavorites, fetchGenres, fetchHistory, fetchMe, removeFavorite, searchStations } from './api/catalog';
import { logout } from './api/auth';
import { storage } from './api/storage';
import type { CitySummary, GenreSummary, MeResponse, StationSummary } from './api/types';
import { usePlayerStore } from './store/playerStore';
import { audioEngine, type PlaybackSource } from './audio/AudioEngine';
import { useIsMobile } from './hooks/useIsMobile';
import { useInstallPrompt } from './hooks/useInstallPrompt';

const ENTERED_KEY = 'cw.entered';
const SIDEBAR_WIDTH = 238;
// Altura reservada pra barra de navegação inferior no mobile (conteúdo +
// uma margem generosa pra cobrir a safe-area do notch/home-indicator do
// iPhone sem precisar calcular o valor exato em JS).
const MOBILE_TABBAR_H = 92;
const MOBILE_PLAYER_H = 62;

const TITLES: Record<NavKey, string> = {
  home: 'Ao vivo agora',
  explore: 'Explorar rádios',
  podcasts: 'Melhores podcasts',
  samba: 'Samba Enredo',
  fav: 'Suas favoritas',
  recent: 'Ouvidas recentemente',
  settings: 'Configurações',
};

const SOURCE_BY_NAV: Record<NavKey, PlaybackSource> = {
  home: 'HOME_LIVE_NOW',
  explore: 'EXPLORE',
  podcasts: 'EXPLORE',
  samba: 'EXPLORE',
  fav: 'FAVORITES',
  recent: 'HISTORY',
  settings: 'EXPLORE',
};

const UF_NAMES: Record<string, string> = {
  AC: 'Acre',
  AL: 'Alagoas',
  AM: 'Amazonas',
  AP: 'Amapá',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MG: 'Minas Gerais',
  MS: 'Mato Grosso do Sul',
  MT: 'Mato Grosso',
  PA: 'Pará',
  PB: 'Paraíba',
  PE: 'Pernambuco',
  PI: 'Piauí',
  PR: 'Paraná',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RO: 'Rondônia',
  RR: 'Roraima',
  RS: 'Rio Grande do Sul',
  SC: 'Santa Catarina',
  SE: 'Sergipe',
  SP: 'São Paulo',
  TO: 'Tocantins',
};

const PAGE_SIZE = 60;

export default function App() {
  const [nav, setNav] = useState<NavKey>('home');
  const [chip, setChip] = useState('Todas');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');

  const [cities, setCities] = useState<CitySummary[]>([]);
  const [genres, setGenres] = useState<GenreSummary[]>([]);
  const [stations, setStations] = useState<StationSummary[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [stateFilter, setStateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [favorites, setFavorites] = useState<StationSummary[]>([]);
  const [history, setHistory] = useState<StationSummary[]>([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [entered, setEntered] = useState(() => storage.get(ENTERED_KEY) === '1');
  const [connecting, setConnecting] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const isMobile = useIsMobile();

  const current = usePlayerStore((s) => s.current);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const sleepTimer = usePlayerStore((s) => s.sleepTimer);
  const toast = usePlayerStore((s) => s.toast);
  const favIds = usePlayerStore((s) => s.favorites);

  const debounceRef = useRef<number | null>(null);
  // Evita que uma resposta antiga (ex.: busca sem filtro, mais lenta)
  // sobrescreva o resultado de uma busca mais nova que respondeu primeiro
  // — cada chamada carrega seu próprio número de sequência e só aplica
  // o resultado se ainda for a mais recente.
  const searchSeqRef = useRef(0);

  const stateOptions = useMemo(() => {
    const ufs = Array.from(new Set(cities.map((c) => c.state).filter(Boolean)));
    const priority = ['RJ', 'SP'];
    ufs.sort((a, b) => {
      const pa = priority.indexOf(a);
      const pb = priority.indexOf(b);
      if (pa !== -1 || pb !== -1) return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
      return (UF_NAMES[a] ?? a).localeCompare(UF_NAMES[b] ?? b);
    });
    return ufs.map((uf) => ({ uf, label: UF_NAMES[uf] ?? uf }));
  }, [cities]);

  const chips = useMemo(() => ['Todas', ...genres.slice(0, 8).map((g) => g.name)], [genres]);

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
    // Só chamamos a API (e, com isso, criamos a sessão anônima no banco) depois
    // que a pessoa passar pela tela inicial e escolher "visitante" ou entrar —
    // assim nenhum registro é criado no banco antes de uma escolha explícita.
    if (!entered) return;
    let cancelled = false;

    (async () => {
      // O backend roda no plano grátis do Render, que "dorme" depois de um
      // tempo sem uso — a primeira chamada depois disso pode levar até ~1
      // minuto pra responder enquanto ele acorda. Em vez de mostrar um erro
      // assustador de cara, tentamos de novo algumas vezes, com uma mensagem
      // mais tranquila, antes de admitir que realmente não conectou.
      const delaysMs = [1500, 3000, 6000, 10000, 15000];
      for (let attempt = 0; attempt <= delaysMs.length; attempt++) {
        if (cancelled) return;
        try {
          const [c, g, meRes] = await Promise.all([fetchCities(), fetchGenres(), fetchMe()]);
          if (cancelled) return;
          setCities(c);
          setGenres(g);
          setMe(meRes);
          setLoadError(null);
          setConnecting(false);
          await refreshFavorites();
          return;
        } catch {
          if (cancelled) return;
          if (attempt === delaysMs.length) {
            setConnecting(false);
            setLoadError('Não foi possível conectar ao servidor. Tente novamente em um instante.');
            return;
          }
          setConnecting(true);
          await new Promise((resolve) => window.setTimeout(resolve, delaysMs[attempt]));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [entered, retryKey]);

  useEffect(() => {
    if (!entered) return;
    if (nav === 'settings') return;
    if (nav === 'fav') {
      setStations(favorites);
      return;
    }

    setLoading(true);
    const genreMatch = genres.find((g) => g.name === chip);

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    const seq = ++searchSeqRef.current;
    debounceRef.current = window.setTimeout(async () => {
      try {
        if (nav === 'recent') {
          const items = await fetchHistory(30);
          if (seq !== searchSeqRef.current) return;
          const stationsFromHistory = items.map((item) => item.station);
          setHistory(stationsFromHistory);
          setStations(stationsFromHistory);
        } else if (nav === 'podcasts') {
          // Ainda não temos podcasts de verdade (episódios/RSS) — a aba
          // mostra um aviso de "em breve" em vez de listar rádios ao vivo
          // como se fossem podcast.
          setStations([]);
        } else if (nav === 'samba') {
          // Aba fixa com as rádios de samba-enredo/carnaval do Rio
          // verificadas manualmente — sempre mostra todas de uma vez.
          const sambaGenre = genres.find((g) => g.slug === 'samba-enredo');
          const res = await searchStations({
            genre: sambaGenre?.id,
            sort: 'popular',
            page: 0,
            size: PAGE_SIZE,
          });
          if (seq !== searchSeqRef.current) return;
          setStations(res.content);
          setTotalElements(res.totalElements);
        } else {
          // Sempre busca a primeira página aqui — o app carrega pouco de
          // início (leve e rápido de abrir) e "Carregar mais" (loadMore,
          // abaixo) busca o resto só se a pessoa pedir.
          const res = await searchStations({
            state: stateFilter || undefined,
            genre: genreMatch?.id,
            q: query || undefined,
            sort: 'popular',
            page: 0,
            size: PAGE_SIZE,
          });
          if (seq !== searchSeqRef.current) return;
          setStations(res.content);
          setTotalElements(res.totalElements);
        }
        setLoadError(null);
      } catch {
        if (seq !== searchSeqRef.current) return;
        setLoadError('Não foi possível carregar as rádios agora.');
      } finally {
        if (seq === searchSeqRef.current) setLoading(false);
      }
    }, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entered, retryKey, nav, chip, query, stateFilter, cities, genres, favorites]);

  async function loadMore() {
    if (loadingMore || nav === 'podcasts' || nav === 'samba' || nav === 'fav' || nav === 'recent') return;
    // Trava a sequência atual: se o filtro mudar (e a busca debounced
    // disparar de novo) antes dessa página extra voltar, o resultado é
    // descartado em vez de ser anexado à lista errada.
    const seq = searchSeqRef.current;
    setLoadingMore(true);
    try {
      const genreMatch = genres.find((g) => g.name === chip);
      const nextPage = Math.floor(stations.length / PAGE_SIZE);
      const res = await searchStations({
        state: stateFilter || undefined,
        genre: genreMatch?.id,
        q: query || undefined,
        sort: 'popular',
        page: nextPage,
        size: PAGE_SIZE,
      });
      if (seq !== searchSeqRef.current) return;
      setStations((prev) => [...prev, ...res.content]);
      setTotalElements(res.totalElements);
    } catch {
      if (seq === searchSeqRef.current) {
        usePlayerStore.getState().showToast('Não foi possível carregar mais rádios.');
      }
    } finally {
      if (seq === searchSeqRef.current) setLoadingMore(false);
    }
  }

  function handleRetry() {
    setLoadError(null);
    setRetryKey((k) => k + 1);
  }

  function isFavorited(stationId: string) {
    return favIds.has(stationId);
  }

  async function toggleFavorite(station: StationSummary) {
    if (me?.accountType !== 'REGISTERED') {
      usePlayerStore.getState().showToast('Crie uma conta para favoritar suas rádios.');
      setAuthOpen(true);
      return;
    }
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
    markEntered();
    const meRes = await fetchMe();
    setMe(meRes);
    await refreshFavorites();
    usePlayerStore.getState().showToast(info && info.favoritesMoved > 0 ? `Conectado — ${info.favoritesMoved} favoritas migradas` : 'Conectado');
  }

  function markEntered() {
    storage.set(ENTERED_KEY, '1');
    setEntered(true);
  }

  function handleContinueAsGuest() {
    markEntered();
  }

  if (!entered) {
    return (
      <>
        <WelcomeGate onContinueAsGuest={handleContinueAsGuest} onOpenAuth={() => setAuthOpen(true)} />
        {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />}
      </>
    );
  }

  const pageTitle = TITLES[nav];
  const showChips = nav === 'home' || nav === 'explore';
  const n = nav === 'home' || nav === 'explore' ? totalElements : stations.length;

  const hasStation = !!current;
  const bottomReserved = isMobile ? MOBILE_TABBAR_H + (hasStation ? MOBILE_PLAYER_H : 0) : 0;
  const sidebarWidthForOverlays = isMobile ? 0 : SIDEBAR_WIDTH;

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        position: 'relative',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      <Sidebar nav={nav} onNavChange={(k) => { setNav(k); setQuery(''); }} favorites={favorites} onPlayFavorite={playStation} me={me} onAuthClick={handleAuthClick} />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 10 : 14,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            padding: isMobile ? '14px 14px' : '16px 26px',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 0,
              maxWidth: isMobile ? 'none' : 430,
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
              style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', font: '500 16px Figtree', color: 'var(--ink)' }}
            />
          </div>
          {!isMobile && <div style={{ flex: 1 }} />}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 11px', borderRadius: 999, background: 'var(--accent-soft)', font: '600 11.5px Figtree', color: 'var(--accent-ink)' }}>
              <LockIcon />
              Conexão segura
            </div>
          )}
          <div style={{ display: 'flex', gap: 5, padding: 4, borderRadius: 999, background: 'var(--surf2)', flex: 'none' }}>
            <div onClick={() => setView('grid')} style={{ cursor: 'pointer', width: 34, height: 30, borderRadius: 999, background: view === 'grid' ? 'var(--bg)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GridIcon />
            </div>
            <div onClick={() => setView('list')} style={{ cursor: 'pointer', width: 34, height: 30, borderRadius: 999, background: view === 'list' ? 'var(--bg)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ListIcon />
            </div>
          </div>
        </div>

        <div
          className="cw-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: isMobile ? `16px 14px ${bottomReserved + 16}px` : '24px 26px 110px',
          }}
        >
          {nav === 'settings' ? (
            <SettingsPanel me={me} onAuthClick={handleAuthClick} />
          ) : nav === 'podcasts' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '80px 40px' }}>
              <div style={{ width: 96, height: 96, borderRadius: 999, background: 'var(--surf2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MicIcon size={36} color="var(--ink40)" />
              </div>
              <div className="cw-display" style={{ fontSize: 21, marginTop: 22 }}>Podcasts — em breve.</div>
              <div style={{ font: '500 14px Figtree', color: 'var(--ink60)', marginTop: 9, maxWidth: 320 }}>
                Estamos preparando os melhores podcasts pra você. Por enquanto, aproveite as rádios ao vivo em Explorar.
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div className="cw-display" style={{ fontSize: isMobile ? 22 : 26, letterSpacing: '-.01em' }}>{pageTitle}</div>
                <div style={{ font: '500 13px Figtree', color: 'var(--ink60)' }}>{n === 1 ? '1 emissora' : `${n} emissoras`}</div>
              </div>

              {showChips && stateOptions.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    style={{
                      padding: '9px 14px',
                      borderRadius: 999,
                      border: '1.5px solid var(--line)',
                      background: 'var(--surf)',
                      color: 'var(--ink)',
                      font: '600 12.5px Figtree',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">Todos os estados</option>
                    {stateOptions.map((s) => (
                      <option key={s.uf} value={s.uf}>{s.label}</option>
                    ))}
                  </select>
                </div>
              )}

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

              {connecting && !loadError && (
                <div style={{ marginTop: 24, padding: '16px 20px', borderRadius: 18, background: 'var(--surf2)', color: 'var(--ink60)', font: '600 13px Figtree', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 999, border: '2px solid var(--ink40)', borderTopColor: 'transparent', animation: 'cw-spin 0.8s linear infinite' }} />
                  Conectando ao servidor… na primeira vez pode levar até 1 minuto.
                </div>
              )}

              {loadError && (
                <div
                  style={{
                    marginTop: 24,
                    padding: '16px 20px',
                    borderRadius: 18,
                    background: 'var(--accent-soft)',
                    color: 'var(--accent-ink)',
                    font: '600 13px Figtree',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    flexWrap: 'wrap',
                  }}
                >
                  {loadError}
                  <div
                    onClick={handleRetry}
                    style={{
                      cursor: 'pointer',
                      flex: 'none',
                      padding: '7px 14px',
                      borderRadius: 999,
                      background: 'var(--accent-ink)',
                      color: 'var(--onacc)',
                      font: '700 12px Figtree',
                    }}
                  >
                    Tentar novamente
                  </div>
                </div>
              )}

              {!loadError && !connecting && !loading && n === 0 && nav === 'fav' && me?.accountType !== 'REGISTERED' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '80px 40px' }}>
                  <div style={{ width: 96, height: 96, borderRadius: 999, background: 'var(--surf2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LockIcon size={36} color="var(--ink40)" />
                  </div>
                  <div className="cw-display" style={{ fontSize: 21, marginTop: 22 }}>Favoritos são só para quem tem conta.</div>
                  <div style={{ font: '500 14px Figtree', color: 'var(--ink60)', marginTop: 9, maxWidth: 320 }}>
                    Crie uma conta gratuita para salvar suas rádios favoritas e encontrá-las de novo em qualquer aparelho.
                  </div>
                  <div
                    onClick={() => setAuthOpen(true)}
                    className="cw-hover-soft"
                    style={{
                      cursor: 'pointer',
                      marginTop: 18,
                      padding: '11px 22px',
                      borderRadius: 999,
                      background: 'var(--accent)',
                      color: 'var(--onacc)',
                      font: '700 13.5px Figtree',
                    }}
                  >
                    Entrar ou criar conta
                  </div>
                </div>
              )}

              {!loadError && !connecting && !loading && n === 0 && !(nav === 'fav' && me?.accountType !== 'REGISTERED') && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '80px 40px' }}>
                  <div style={{ width: 96, height: 96, borderRadius: 999, background: 'var(--surf2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SearchIcon size={40} color="var(--ink40)" />
                  </div>
                  <div className="cw-display" style={{ fontSize: 21, marginTop: 22 }}>
                    {nav === 'fav'
                      ? 'Você ainda não tem favoritos.'
                      : nav === 'recent'
                      ? 'Você ainda não ouviu nenhuma rádio.'
                      : 'Nenhuma rádio encontrada.'}
                  </div>
                  <div style={{ font: '500 14px Figtree', color: 'var(--ink60)', marginTop: 9 }}>
                    {nav === 'fav'
                      ? 'Toque no coração de uma rádio para guardá-la aqui.'
                      : nav === 'recent'
                      ? 'As rádios que você tocar vão aparecer aqui.'
                      : 'Tente outro nome, cidade ou gênero.'}
                  </div>
                </div>
              )}

              {!loadError && n > 0 && view === 'grid' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? 134 : 176}px, 1fr))`,
                    gap: isMobile ? '14px 10px' : '22px 18px',
                    marginTop: 24,
                  }}
                >
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

              {!loadError && (nav === 'home' || nav === 'explore') && stations.length < totalElements && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 26 }}>
                  <div
                    onClick={loadMore}
                    className="cw-hover-soft"
                    style={{
                      cursor: loadingMore ? 'default' : 'pointer',
                      padding: '11px 22px',
                      borderRadius: 999,
                      border: '1.5px solid var(--line)',
                      font: '700 13px Figtree',
                      color: 'var(--ink)',
                      opacity: loadingMore ? 0.6 : 1,
                    }}
                  >
                    {loadingMore ? 'Carregando…' : 'Carregar mais'}
                  </div>
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
        sidebarWidth={sidebarWidthForOverlays}
        bottomOffset={isMobile ? MOBILE_TABBAR_H : 0}
      />

      <Toast message={toast?.message ?? null} sidebarWidth={sidebarWidthForOverlays} bottom={isMobile ? bottomReserved + 14 : 96} />

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />}
    </div>
  );
}

function SettingsPanel({ me, onAuthClick }: { me: MeResponse | null; onAuthClick: () => void }) {
  const logged = me?.accountType === 'REGISTERED';
  const { canInstall, installed, isIOS, promptInstall } = useInstallPrompt();

  return (
    <div style={{ maxWidth: 480 }}>
      <div className="cw-display" style={{ fontSize: 26 }}>Configurações</div>
      <div style={{ marginTop: 20, padding: 18, borderRadius: 20, background: 'var(--surf)', border: '1px solid var(--line)' }}>
        <div style={{ font: '700 13px Figtree' }}>Conta</div>
        <div style={{ font: '500 13px Figtree', color: 'var(--ink60)', marginTop: 6 }}>
          {logged ? `${me?.displayName ?? ''} · ${me?.email ?? ''}` : `Convidado · ${me?.anonymousLabel ?? ''}`}
        </div>
        <div style={{ font: '500 12.5px Figtree', color: 'var(--ink40)', marginTop: 10 }}>
          {me?.favoriteCount ?? 0} rádio(s) favoritada(s).
        </div>
        <div
          onClick={onAuthClick}
          style={{
            cursor: 'pointer',
            marginTop: 14,
            display: 'inline-flex',
            alignItems: 'center',
            padding: '9px 16px',
            borderRadius: 999,
            border: '1.5px solid var(--line)',
            font: '600 12.5px Figtree',
            color: 'var(--ink60)',
          }}
        >
          {logged ? 'Sair da conta' : 'Entrar ou criar conta'}
        </div>
      </div>

      {!installed && (
        <div style={{ marginTop: 16, padding: 18, borderRadius: 20, background: 'var(--surf)', border: '1px solid var(--line)' }}>
          <div style={{ font: '700 13px Figtree' }}>Instalar como app</div>
          <div style={{ font: '500 12.5px Figtree', color: 'var(--ink60)', marginTop: 6 }}>
            Coloca o Carra Wave na tela inicial do seu celular pra abrir direto, como um app — sem digitar o endereço no navegador.
          </div>

          {canInstall && (
            <div
              onClick={() => promptInstall()}
              style={{
                cursor: 'pointer',
                marginTop: 14,
                display: 'inline-flex',
                alignItems: 'center',
                padding: '9px 16px',
                borderRadius: 999,
                background: 'var(--accent)',
                color: 'var(--onacc)',
                font: '700 12.5px Figtree',
              }}
            >
              Instalar app
            </div>
          )}

          {!canInstall && isIOS && (
            <div style={{ font: '500 12.5px Figtree', color: 'var(--ink40)', marginTop: 12, lineHeight: 1.6 }}>
              No iPhone: toque no ícone de compartilhar do Safari (o quadrado com a flecha pra cima, na barra de baixo) e escolha <strong>"Adicionar à Tela de Início"</strong>.
            </div>
          )}

          {!canInstall && !isIOS && (
            <div style={{ font: '500 12.5px Figtree', color: 'var(--ink40)', marginTop: 12, lineHeight: 1.6 }}>
              No menu do navegador (geralmente os três pontinhos, no canto da tela), procure por <strong>"Instalar app"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 16, font: '500 12.5px Figtree', color: 'var(--ink40)' }}>
        Suas preferências de tema, qualidade de áudio e reprodução automática podem ser ajustadas na versão mobile e sincronizam com esta conta.
      </div>

      <div style={{ marginTop: 16, padding: 18, borderRadius: 20, background: 'var(--surf)', border: '1px solid var(--line)' }}>
        <div style={{ font: '700 13px Figtree' }}>Desenvolvido por</div>
        <div style={{ font: '600 13px Figtree', color: 'var(--ink)', marginTop: 6 }}>
          Alessandro Carra Rodrigues Santiago
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
          <a
            href="https://github.com/alecarrasantiago"
            target="_blank"
            rel="noreferrer"
            title="GitHub"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 999, background: 'var(--surf2)', color: 'var(--ink)' }}
          >
            <GitHubIcon size={18} color="var(--ink)" />
          </a>
          <a
            href="mailto:alecarra.santiago@gmail.com"
            title="E-mail"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 999, background: 'var(--surf2)', color: 'var(--ink)' }}
          >
            <MailIcon size={18} color="var(--ink)" />
          </a>
          <a
            href="https://www.instagram.com/alehcarra/"
            target="_blank"
            rel="noreferrer"
            title="Instagram"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 999, background: 'var(--surf2)', color: 'var(--ink)' }}
          >
            <InstagramIcon size={18} color="var(--ink)" />
          </a>
        </div>
      </div>
    </div>
  );
}
