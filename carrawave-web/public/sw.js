// Service worker mínimo do Carra Wave.
//
// O objetivo aqui NÃO é tocar rádio offline (impossível — é streaming ao
// vivo) nem cachear a API. É só o que falta pro navegador considerar o site
// "instalável" (o botão/menu "Adicionar à tela de início" / "Instalar app"
// no Android e no Chrome) e abrir em modo standalone, sem a barra de
// endereço, como um app de verdade.
//
// Por segurança: só tocamos em requisições GET da MESMA origem (o HTML, o
// JS/CSS do build, ícones). Chamadas pra API do backend e pros streams de
// áudio das rádios são de outras origens e sempre vão direto pra rede, sem
// passar por cache.
const CACHE_NAME = 'carrawave-shell-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches
          .open(CACHE_NAME)
          .then((cache) => cache.put(request, copy))
          .catch(() => {});
        return response;
      })
      .catch(() => caches.match(request))
  );
});
