# Carra Wave — Contrato de API (frontend ⇄ backend)

**Stack backend:** Java 21 + Spring Boot 3.x · **Banco:** PostgreSQL 16 (schema único, compartilhado)
**Consumidores:** app Android, web app, extensão Chrome, admin
**Arquitetura:** dois backends independentes, mesmo schema

| Serviço | Consumidores | Porta | Base path |
|---|---|---|---|
| `carrawave-app-api` | Android, web, extensão Chrome | 8080 | `/api/v1` |
| `carrawave-admin-api` | Admin web | 8081 | `/admin/v1` |

Regras: **só o admin-api escreve** em `station`, `city`, `genre`. O app-api lê essas tabelas (read-only) e escreve apenas dados do usuário (`app_user`, `favorite`, `play_session`, `device`). Cada serviço tem seu próprio usuário de banco com GRANTs distintos — é isso que garante a separação, não convenção.

Convenções gerais:
- Todo payload em `application/json; charset=utf-8`.
- Datas/horas em **ISO-8601 UTC** (`2026-09-20T14:32:10Z`). Java: `Instant`.
- IDs públicos são **UUID v7** (ordenáveis por tempo). O `bigserial` interno nunca vaza na API.
- Paginação: `?page=0&size=20` → resposta envelopada em `Page<T>` (padrão Spring Data).
- Idioma: `Accept-Language: pt-BR` (fallback `pt-BR`).

---

## 1. Identidade: com login e sem login

O ponto central do produto. **Todo cliente tem um identificador, sempre** — a diferença é se ele está ligado a uma conta.

### 1.1 Fluxo

1. Na primeira abertura, o cliente gera um `deviceId` (UUID v4) localmente e o guarda de forma persistente:
   - Android: `EncryptedSharedPreferences`
   - Web: `localStorage`
   - Extensão Chrome: `chrome.storage.local` (sobrevive ao fechar o popup)
2. Cliente chama `POST /api/v1/auth/anonymous` enviando `deviceId` → recebe um par de tokens JWT.
3. O usuário navega normalmente. `accountType` no token vale `ANONYMOUS`.
4. Se ele fizer login depois, chama `POST /api/v1/auth/login` **enviando o token anônimo atual no header**. O backend faz o *merge*: favoritos e histórico do anônimo passam para a conta. `accountType` vira `REGISTERED`.

Isso dá exatamente a métrica pedida: `COUNT(DISTINCT device_id)` total, segmentado por `account_type`.

### 1.2 Token

JWT assinado (HS256 ou RS256), com:

```json
{
  "sub": "018f3a2b-...",        // userId (UUID v7)
  "deviceId": "7c1e...",
  "accountType": "ANONYMOUS",   // ANONYMOUS | REGISTERED
  "platform": "ANDROID",        // ANDROID | WEB | CHROME_EXTENSION
  "roles": ["ROLE_USER"],
  "iat": 1790000000,
  "exp": 1790003600
}
```

- Access token: **1 hora**. Refresh token: **60 dias**, rotativo (um refresh queima o anterior).
- Header em toda chamada autenticada: `Authorization: Bearer <accessToken>`.
- Anônimo **não** é "sem autenticação" — ele tem token e passa pelo mesmo filtro de segurança.

### 1.3 Endpoints de auth

#### `POST /api/v1/auth/anonymous`
Cria (ou recupera) o usuário anônimo daquele device. **Idempotente**: mesmo `deviceId` devolve o mesmo `userId`.

```json
// request
{
  "deviceId": "7c1e9f40-3f2a-4d1e-9a11-2b0c8f5d7e33",
  "platform": "ANDROID",
  "appVersion": "1.0.0",
  "osVersion": "Android 14",
  "locale": "pt-BR",
  "timezone": "America/Sao_Paulo"
}
```
```json
// 200 OK
{
  "userId": "018f3a2b-7c4d-7e1a-9b33-5f2c1d8e4a06",
  "accountType": "ANONYMOUS",
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...",
  "expiresIn": 3600
}
```

#### `POST /api/v1/auth/login`
E-mail e senha. Se vier `Authorization: Bearer <token anônimo>`, faz merge.

```json
// request
{ "email": "ana.ribeiro@email.com", "password": "•••••••• ", "deviceId": "7c1e9f40-..." }
```
```json
// 200 OK
{
  "userId": "018f3a2b-...",
  "accountType": "REGISTERED",
  "displayName": "Ana Ribeiro",
  "email": "ana.ribeiro@email.com",
  "accessToken": "...", "refreshToken": "...", "expiresIn": 3600,
  "merged": { "favoritesMoved": 3, "sessionsMoved": 18 }
}
```

#### `POST /api/v1/auth/register`
`{ "displayName", "email", "password", "deviceId" }` → mesma resposta do login (já autenticado).

#### `POST /api/v1/auth/oauth/{provider}`
`provider` = `google` | `apple`. Body: `{ "idToken", "deviceId" }`. Backend valida o idToken no provedor.

#### `POST /api/v1/auth/refresh`
`{ "refreshToken" }` → novo par. Refresh usado é invalidado.

#### `POST /api/v1/auth/logout`
`{ "refreshToken" }` → 204. Cliente volta ao estado anônimo (reusa o mesmo `deviceId`).

---

## 2. Catálogo (leitura — app-api)

O frontend **não** guarda lista de rádios hard-coded. Tudo vem daqui.

#### `GET /api/v1/stations`
Query params (todos opcionais): `city`, `state`, `genre`, `q`, `onlyLive` (bool), `sort` (`popular|name|recent`), `page`, `size`.

```json
// 200 OK
{
  "content": [
    {
      "id": "018f3a2b-...",
      "name": "JB FM",
      "slug": "jb-fm",
      "frequency": "99.9 FM",
      "city": { "id": "018f...", "name": "Rio de Janeiro", "state": "RJ" },
      "genres": [{ "id": "018f...", "name": "MPB", "slug": "mpb" }],
      "streamUrl": "https://stream.carrawave.com.br/jb-fm/live.m3u8",
      "streamFormat": "HLS",
      "artworkUrl": null,
      "artworkColor": "#c67139",
      "initials": "JB",
      "website": "https://www.jbfm.com.br",
      "description": "Transmite ao vivo do Rio de Janeiro...",
      "live": true,
      "listenersNow": 12400,
      "favorited": true
    }
  ],
  "page": 0, "size": 20, "totalElements": 14, "totalPages": 1
}
```

Notas para o frontend:
- `artworkUrl` nulo → renderiza o placeholder geométrico com `initials` sobre `artworkColor`.
- `favorited` é calculado para o usuário do token (anônimo inclusive). Sem token, vem sempre `false`.
- `listenersNow` é aproximado (janela de 5 min) e pode ser omitido — trate como opcional.

#### `GET /api/v1/stations/{id}`
Mesmo objeto + `similar` (array de até 6 stations resumidas) e `currentProgram` quando houver:
```json
"currentProgram": { "title": "Manhã JB", "host": "—", "startsAt": "2026-09-20T09:00:00Z", "endsAt": "2026-09-20T12:00:00Z" }
```

#### `GET /api/v1/stations/{id}/stream-token`
Devolve URL assinada de curta duração — evita hotlink do stream.
`{ "url": "https://stream.../live.m3u8?token=...", "expiresAt": "2026-09-20T15:00:00Z" }`

#### `GET /api/v1/home`
Uma chamada só para montar a Home (evita 5 requisições no cold start):
```json
{
  "greeting": "BOM_DIA",
  "liveNow": [ /* StationSummary */ ],
  "sections": [
    { "key": "featured-rj", "title": "Destaques do Rio", "cityId": "018f...", "stations": [] },
    { "key": "featured-sp", "title": "Destaques de São Paulo", "cityId": "018f...", "stations": [] },
    { "key": "most-played", "title": "Mais ouvidas", "stations": [] }
  ],
  "genres": [ { "id": "...", "name": "Pop", "slug": "pop", "stationCount": 4 } ]
}
```

#### `GET /api/v1/cities` · `GET /api/v1/genres`
Listas simples com `stationCount`.

#### `GET /api/v1/search?q=...`
`{ "stations": [], "cities": [], "genres": [] }` — resultado agrupado, como na tela de busca.

---

## 3. Dados do usuário (escrita — app-api)

Funciona igual para anônimo e logado. É o que permite favoritar sem criar conta.

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/v1/me` | Perfil + `accountType` + `deviceId` + contadores |
| `PATCH` | `/api/v1/me` | `{ displayName }` (só `REGISTERED`) |
| `GET` | `/api/v1/me/favorites` | Lista de stations favoritadas |
| `PUT` | `/api/v1/me/favorites/{stationId}` | Favorita → 204 (idempotente) |
| `DELETE` | `/api/v1/me/favorites/{stationId}` | Desfavorita → 204 |
| `GET` | `/api/v1/me/history?size=20` | Ouvidas recentemente, com `lastPlayedAt` |
| `GET` | `/api/v1/me/settings` | Preferências |
| `PUT` | `/api/v1/me/settings` | `{ theme, audioQuality, autoplay, sleepTimerMinutes }` |

`GET /api/v1/me`:
```json
{
  "userId": "018f3a2b-...",
  "accountType": "ANONYMOUS",
  "displayName": null,
  "email": null,
  "deviceId": "7c1e9f40-...",
  "anonymousLabel": "CW-7C1E9F40",
  "favoriteCount": 3,
  "createdAt": "2026-09-01T12:00:00Z"
}
```
`anonymousLabel` é o que a UI mostra ao convidado ("seu ID: CW-7C1E9F40") — 8 primeiros caracteres do deviceId em maiúsculas.

`settings`:
- `theme`: `LIGHT` | `DARK` | `SYSTEM`
- `audioQuality`: `AUTO` | `HIGH` | `DATA_SAVER`
- `autoplay`: boolean
- `sleepTimerMinutes`: integer nullable (15/30/45/60)

---

## 4. Telemetria de reprodução

É daqui que saem as métricas de uso. **Duas chamadas por sessão de escuta.**

#### `POST /api/v1/playback/start`
```json
{ "stationId": "018f...", "clientSessionId": "b2d4...", "startedAt": "2026-09-20T14:32:10Z", "source": "HOME_LIVE_NOW" }
```
→ `201 { "sessionId": "018f..." }`

`source`: `HOME_LIVE_NOW` | `HOME_SECTION` | `EXPLORE` | `SEARCH` | `FAVORITES` | `HISTORY` | `STATION_DETAIL` | `MINI_PLAYER` | `EXTENSION_POPUP` | `EXTENSION_SIDE_PANEL`

#### `POST /api/v1/playback/{sessionId}/heartbeat`
A cada **60s** enquanto tocando: `{ "playedSeconds": 120 }` → 204.
Sessão sem heartbeat por 5 min é fechada automaticamente pelo servidor (cliente pode ter morrido).

#### `POST /api/v1/playback/{sessionId}/stop`
`{ "playedSeconds": 344, "reason": "USER_STOP" }` → 204.
`reason`: `USER_STOP` | `SLEEP_TIMER` | `ERROR` | `APP_CLOSED` | `SWITCHED_STATION`

#### `POST /api/v1/events` (opcional, batch)
Fila local, envia em lote ao voltar online:
```json
{ "events": [ { "type": "SCREEN_VIEW", "name": "explore", "at": "...", "props": {} } ] }
```

---

## 5. Schema do banco (compartilhado)

Flyway, migrations em `V1__init.sql`. Os dois serviços leem o mesmo schema; os GRANTs diferem.

```sql
create extension if not exists "uuid-ossp";

create table city (
  id           bigserial primary key,
  public_id    uuid not null unique default uuid_generate_v4(),
  name         varchar(120) not null,
  state        char(2) not null,
  slug         varchar(140) not null unique,
  created_at   timestamptz not null default now()
);

create table genre (
  id           bigserial primary key,
  public_id    uuid not null unique default uuid_generate_v4(),
  name         varchar(80) not null,
  slug         varchar(90) not null unique
);

create table station (
  id             bigserial primary key,
  public_id      uuid not null unique default uuid_generate_v4(),
  name           varchar(160) not null,
  slug           varchar(180) not null unique,
  frequency      varchar(40),
  city_id        bigint not null references city(id),
  stream_url     text not null,
  stream_format  varchar(20) not null default 'HLS',   -- HLS | ICECAST | MP3
  artwork_url    text,
  artwork_color  varchar(9),
  initials       varchar(4),
  website        text,
  description    text,
  active         boolean not null default true,
  sort_weight    int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index idx_station_city on station(city_id);
create index idx_station_active on station(active) where active;

create table station_genre (
  station_id bigint not null references station(id) on delete cascade,
  genre_id   bigint not null references genre(id) on delete cascade,
  primary key (station_id, genre_id)
);

create table app_user (
  id            bigserial primary key,
  public_id     uuid not null unique,                  -- UUID v7 gerado na app
  account_type  varchar(16) not null,                  -- ANONYMOUS | REGISTERED
  email         varchar(255) unique,                   -- null quando anônimo
  password_hash varchar(100),                          -- bcrypt; null em OAuth/anônimo
  display_name  varchar(120),
  oauth_provider varchar(20),                          -- GOOGLE | APPLE | null
  oauth_subject  varchar(255),
  created_at    timestamptz not null default now(),
  last_seen_at  timestamptz,
  constraint chk_registered_has_email
    check (account_type = 'ANONYMOUS' or email is not null)
);
create unique index idx_user_oauth on app_user(oauth_provider, oauth_subject)
  where oauth_provider is not null;

create table device (
  id            bigserial primary key,
  device_id     uuid not null unique,                  -- gerado no cliente
  user_id       bigint not null references app_user(id),
  platform      varchar(24) not null,                  -- ANDROID | WEB | CHROME_EXTENSION
  app_version   varchar(24),
  os_version    varchar(60),
  locale        varchar(12),
  timezone      varchar(60),
  first_seen_at timestamptz not null default now(),
  last_seen_at  timestamptz not null default now()
);
create index idx_device_user on device(user_id);
create index idx_device_platform on device(platform);

create table favorite (
  user_id    bigint not null references app_user(id) on delete cascade,
  station_id bigint not null references station(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, station_id)
);

create table play_session (
  id             bigserial primary key,
  public_id      uuid not null unique,
  user_id        bigint not null references app_user(id),
  device_id      bigint not null references device(id),
  station_id     bigint not null references station(id),
  source         varchar(32),
  started_at     timestamptz not null,
  ended_at       timestamptz,
  played_seconds int not null default 0,
  end_reason     varchar(24)
);
create index idx_play_user_time on play_session(user_id, started_at desc);
create index idx_play_station_time on play_session(station_id, started_at desc);
create index idx_play_started on play_session(started_at desc);

create table user_settings (
  user_id             bigint primary key references app_user(id) on delete cascade,
  theme               varchar(10) not null default 'SYSTEM',
  audio_quality       varchar(12) not null default 'AUTO',
  autoplay            boolean not null default true,
  sleep_timer_minutes int
);

create table refresh_token (
  id         bigserial primary key,
  user_id    bigint not null references app_user(id) on delete cascade,
  token_hash varchar(100) not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
```

**GRANTs (a separação real entre os dois backends):**
```sql
-- app-api: lê catálogo, escreve dados do usuário
grant select on city, genre, station, station_genre to carrawave_app;
grant select, insert, update, delete on app_user, device, favorite,
      play_session, user_settings, refresh_token to carrawave_app;

-- admin-api: escreve catálogo, lê agregados de uso
grant select, insert, update, delete on city, genre, station, station_genre to carrawave_admin;
grant select on app_user, device, favorite, play_session to carrawave_admin;
```

### Métricas de uso — as queries que respondem sua pergunta

```sql
-- usuários ativos hoje, com e sem login
select u.account_type, count(distinct d.device_id) as devices
from play_session p
join app_user u on u.id = p.user_id
join device   d on d.id = p.device_id
where p.started_at >= current_date
group by u.account_type;

-- instalações por plataforma
select platform, count(*) from device group by platform;

-- top rádios da semana
select s.name, count(*) as sessions, sum(p.played_seconds)/3600 as hours
from play_session p join station s on s.id = p.station_id
where p.started_at >= now() - interval '7 days'
group by s.name order by hours desc limit 20;
```

---

## 6. Admin API (`carrawave-admin-api`, porta 8081)

Autenticação separada, roles `ROLE_ADMIN` / `ROLE_EDITOR`. Nunca compartilha secret de JWT com o app-api.

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/admin/v1/auth/login` | Login de operador |
| `GET/POST/PUT/DELETE` | `/admin/v1/stations` | CRUD de emissoras |
| `POST` | `/admin/v1/stations/{id}/check-stream` | Testa o stream, devolve status e latência |
| `GET/POST/PUT/DELETE` | `/admin/v1/cities` · `/admin/v1/genres` | CRUD auxiliar |
| `GET` | `/admin/v1/metrics/overview` | DAU/MAU, split anônimo × logado, por plataforma |
| `GET` | `/admin/v1/metrics/stations?from=&to=` | Ranking de audiência |
| `GET` | `/admin/v1/users?accountType=&page=` | Lista paginada (sem PII além do e-mail) |

`GET /admin/v1/metrics/overview`:
```json
{
  "range": { "from": "2026-09-13", "to": "2026-09-20" },
  "activeUsers": { "total": 4820, "anonymous": 3110, "registered": 1710 },
  "devices": { "ANDROID": 3980, "WEB": 640, "CHROME_EXTENSION": 200 },
  "sessions": 18740,
  "listeningHours": 9312.5,
  "conversionRate": 0.213
}
```

---

## 7. Erros

Formato único (RFC 7807 simplificado), em toda rota dos dois serviços:

```json
{
  "timestamp": "2026-09-20T14:32:10Z",
  "status": 404,
  "error": "STATION_NOT_FOUND",
  "message": "Rádio não encontrada.",
  "path": "/api/v1/stations/018f..."
}
```

`message` é **texto pronto para exibir ao usuário, em pt-BR** — o frontend não monta string de erro. Códigos previstos:

| HTTP | `error` | Tela |
|---|---|---|
| 401 | `TOKEN_EXPIRED` | silencioso → refresh e repete |
| 401 | `INVALID_CREDENTIALS` | login |
| 404 | `STATION_NOT_FOUND` | detalhe |
| 409 | `EMAIL_ALREADY_REGISTERED` | cadastro |
| 422 | `STREAM_UNAVAILABLE` | tela "Erro de stream" |
| 429 | `RATE_LIMITED` | toast |
| 503 | `SERVICE_UNAVAILABLE` | tela "Sem conexão" |

Rate limit: 60 req/min por device no app-api (`429` + header `Retry-After`).

---

## 8. Extensão Chrome (MV3) — o que muda

A extensão consome o **mesmo app-api**, sem endpoints próprios. Três pontos de atenção:

1. **Áudio não pode morrer com o popup.** O popup é destruído ao perder o foco. Use um *offscreen document* (`chrome.offscreen`, razão `AUDIO_PLAYBACK`) para hospedar o `<audio>`, ou o Side Panel, que fica aberto. O popup só manda mensagens.
2. **Storage.** `deviceId` e tokens em `chrome.storage.local` — não `localStorage`, que é limpo junto com dados de navegação.
3. **Permissões do `manifest.json`:**
```json
{
  "manifest_version": 3,
  "permissions": ["storage", "offscreen", "alarms", "sidePanel"],
  "host_permissions": ["https://api.carrawave.com.br/*", "https://stream.carrawave.com.br/*"],
  "background": { "service_worker": "sw.js", "type": "module" }
}
```
   O heartbeat de 60s deve usar `chrome.alarms` (mínimo 30s), porque o service worker hiberna — `setInterval` não sobrevive.
4. Envie `platform: "CHROME_EXTENSION"` no `/auth/anonymous` para a métrica separar a extensão do web app.

**CORS no Spring:** liberar `https://app.carrawave.com.br` e `chrome-extension://<id-publicado>`. A origem da extensão é fixa depois de publicada na Web Store.

---

## 9. Ordem sugerida de implementação

1. `V1__init.sql` + entidades JPA + Flyway
2. `/auth/anonymous` e `/auth/refresh` — destrava todo o resto
3. `/stations`, `/home`, `/cities`, `/genres` (catálogo read-only, com cache)
4. `/me/favorites` e `/me/history`
5. `/playback/*` (telemetria)
6. `/auth/login` + `/auth/register` + merge anônimo→conta
7. Admin API e métricas
