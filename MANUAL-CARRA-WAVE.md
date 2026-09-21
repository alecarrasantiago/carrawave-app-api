# Carra Wave — Manual de construção do zero ao ar

**Objetivo:** sair do papel e chegar num app de rádio funcional — Android, iOS e web — começando com **custo zero**, medindo **acessos anônimos e logados**, e podendo crescer sem refazer nada.

**Como usar este documento:** as seções 1 a 8 são o passo a passo humano (o que clicar, o que instalar, em que ordem). A **seção 9 são os prompts prontos** — copie, cole na sua ferramenta de IA junto com o print da tela correspondente, e vá construindo. A seção 10 é a conferência final.

Arquivos que acompanham este manual:
- `API-CONTRACT.md` — contrato de API, schema do banco, regras de token. **É a fonte da verdade** para o backend.
- `Carra Wave - App.dc.html` — as 19 telas do mobile (claro e escuro). Use como referência visual nos prompts.
- `Carra Wave - Web.dc.html` — desktop, web mobile e popup da extensão Chrome.

---

## 1. Decisões que já estão tomadas (não repense, só execute)

| Camada | Escolha | Por quê |
|---|---|---|
| Backend | **Java 21 + Spring Boot 3.3** | Você já sabe. Nativo no Railway/Render/Fly. |
| Banco | **PostgreSQL 16** | Grátis no Neon/Supabase, schema já escrito. |
| Web | **React 18 + Vite + TypeScript** | Build rápido, deploy grátis na Vercel. |
| Mobile | **Capacitor 6** sobre o mesmo React | Um código → Android **e** iOS. Sem Flutter, sem Kotlin+Swift separados. |
| Áudio | `hls.js` no web, player nativo via plugin no mobile | Streams de rádio são HLS ou Icecast. |
| Auth | JWT próprio (anônimo + registrado) | Já especificado no contrato. |

**A decisão mais importante é o Capacitor.** Você escreve o app uma vez em React e ele vira APK (Android) e IPA (iOS) empacotando a mesma interface. Isso corta o trabalho pela metade e é o motivo de o web vir primeiro.

> **Aviso sobre iOS:** compilar e publicar iPhone exige um **Mac** (Xcode) e a conta de desenvolvedor Apple (**US$ 99/ano** — não tem versão grátis para publicar na App Store). Você consegue *testar* no seu próprio iPhone de graça com um Mac, mas publicar custa. Android é grátis para gerar APK e **US$ 25 uma única vez** para publicar na Play Store. Por isso o plano abaixo faz **web → Android → iOS**, nessa ordem.

---

## 2. Paleta e identidade (já definida — use exatamente estes valores)

Nome: **Carra Wave** · Assinatura: *Sua sintonia, em qualquer lugar.*

### 2.1 Cores — modo claro

| Papel | Token | Hex | Uso |
|---|---|---|---|
| Fundo | `--bg` | `#f5ead8` | Fundo da tela |
| Superfície | `--surf` | `#fffaf1` | Cards, barras, campos |
| Superfície 2 | `--surf2` | `#ebddc5` | Chips inativos, trilhos |
| Texto | `--ink` | `#201e1d` | Texto principal |
| Texto 60% | `--ink60` | `rgba(32,30,29,.62)` | Texto secundário |
| Texto 40% | `--ink40` | `rgba(32,30,29,.42)` | Placeholder, ícone inativo |
| Linha | `--line` | `rgba(32,30,29,.14)` | Bordas e divisores |
| **Acento** | `--accent` | `#c67139` | Botões, play, ativo |
| Acento escuro | `--accent-ink` | `#8c491a` | Texto sobre fundo claro |
| Acento suave | `--accent-soft` | `rgba(198,113,57,.13)` | Fundos tingidos |
| Acento 2 (sálvia) | `--accent-2` | `#7a8a5e` | Segunda voz, gráficos |
| Sobre acento | `--onacc` | `#fffaf1` | Texto dentro do botão laranja |

### 2.2 Cores — modo escuro

| Token | Hex |
|---|---|
| `--bg` | `#17120e` |
| `--surf` | `#241c15` |
| `--surf2` | `#32271d` |
| `--ink` | `#f7eede` |
| `--ink60` | `rgba(247,238,222,.64)` |
| `--ink40` | `rgba(247,238,222,.4)` |
| `--line` | `rgba(247,238,222,.13)` |
| `--accent` | `#f6a06b` |
| `--accent-ink` | `#ffc6a5` |
| `--accent-soft` | `rgba(246,160,107,.16)` |
| `--accent-2` | `#aebf92` |
| `--onacc` | `#3a1f0e` |

### 2.3 Gradientes das capas de rádio (placeholder com as iniciais)

```
0  linear-gradient(145deg,#f6a06b,#b2622d)
1  linear-gradient(145deg,#aebf92,#56633f)
2  linear-gradient(145deg,#ffc6a5,#d67f48)
3  linear-gradient(145deg,#c0b6a5,#5a5246)
4  linear-gradient(145deg,#d67f48,#643312)
5  linear-gradient(145deg,#ccdbb2,#728157)
6  linear-gradient(145deg,#f6a06b,#8c491a)
7  linear-gradient(145deg,#8fa073,#3d472b)
```
Regra: `gradiente = hash(stationId) % 8`. A inicial vai em branco 95%, fonte display.

### 2.4 Tipografia

- **Display/títulos:** Caprasimo (Google Fonts) — só para títulos, nunca corpo de texto.
- **Interface/corpo:** Figtree 400/500/600/700.
- **Números técnicos e etiquetas:** IBM Plex Mono 500, `letter-spacing: .12em`, maiúsculas.

### 2.5 Forma

Raio 16px em containers, **999px em botões, chips e campos** (tudo em pílula). Nada de cantos vivos. Sombras suaves e quentes, nunca cinza-azuladas.

### 2.6 Regras de acessibilidade que não podem quebrar

- Texto corrido nunca abaixo de 14px; alvo de toque nunca abaixo de 44×44px.
- Texto laranja sobre fundo creme: use `--accent-ink` (#8c491a), **não** `--accent`, senão não passa em contraste.
- Foco de teclado sempre visível: `outline: 2px solid var(--accent); outline-offset: 2px`.

---

## 3. Contas grátis para abrir (nesta ordem, ~30 minutos)

| # | Serviço | Para quê | Plano grátis |
|---|---|---|---|
| 1 | **GitHub** | Código dos 3 repositórios | Ilimitado, privado |
| 2 | **Neon.tech** | PostgreSQL | 0,5 GB, suficiente para milhares de usuários |
| 3 | **Railway** ou **Render** | Rodar os backends Spring Boot | Railway: US$5 de crédito/mês. Render: grátis com "sono" após 15 min |
| 4 | **Vercel** | Hospedar o web app | Generoso, domínio `.vercel.app` incluso |
| 5 | **Cloudflare** | DNS, cache e HTTPS | Grátis |
| 6 | **PostHog Cloud** | Métricas de uso (complemento) | 1 milhão de eventos/mês |

**Sobre "dormir":** o plano grátis do Render desliga o serviço após 15 min sem uso e a primeira chamada seguinte demora ~40s. Para um rádio isso é ruim. Duas saídas grátis: (a) use o Railway, que não dorme dentro do crédito mensal; (b) mantenha um ping a cada 10 min via **cron-job.org** (grátis) batendo em `/actuator/health`.

### 3.1 Domínio grátis

Você tem três caminhos, do mais simples ao mais "de verdade":

1. **Subdomínio de graça, imediato:** `carrawave.vercel.app` (web) e `carrawave-api.up.railway.app` (API). Funciona, tem HTTPS, serve para começar hoje.
2. **`.js.org` / `is-a.dev`** — domínios comunitários gratuitos, concedidos via pull request no GitHub. Dá um `carrawave.is-a.dev`. Leva alguns dias de aprovação.
3. **Domínio próprio pago (quando quiser):** `.com.br` custa ~R$ 40/ano no **registro.br** (precisa de CPF/CNPJ). Aponte o DNS no Cloudflare, adicione na Vercel, HTTPS sai automático. Faça isso só quando o app já estiver no ar.

Recomendo começar no caminho 1 e migrar para o 3 quando lançar. **Nada no código deve ter URL fixa** — sempre variável de ambiente `VITE_API_URL`, para trocar de domínio sem reconstruir.

---

## 4. Ordem de construção (o caminho crítico)

```
SEMANA 1  Banco + backend auth          → você consegue criar usuário anônimo
SEMANA 2  Backend catálogo + favoritos  → a API devolve rádios de verdade
SEMANA 3  Web app React                 → dá para ouvir rádio no navegador
SEMANA 4  Capacitor → APK Android       → instala no seu celular
SEMANA 5  Telemetria + painel de números→ você vê quantas pessoas usaram
DEPOIS    Admin web, iOS, domínio próprio
```

Não pule a ordem. Cada etapa depende da anterior estar funcionando.

---

## 5. Backend — passo a passo

### 5.1 Criar os projetos

No [start.spring.io](https://start.spring.io), gere **dois** projetos:

**`carrawave-app-api`** — Java 21, Maven, Spring Boot 3.3.x
Dependências: Spring Web, Spring Data JPA, Spring Security, PostgreSQL Driver, Flyway Migration, Validation, Spring Boot Actuator, Lombok.

**`carrawave-admin-api`** — as mesmas dependências.

### 5.2 Banco no Neon

1. Crie o projeto `carrawave` no Neon, região `aws-us-east-1` (ou São Paulo se disponível).
2. Copie a *connection string*.
3. Crie os dois usuários de banco com permissões separadas (o SQL de GRANT está na seção 5 do `API-CONTRACT.md`) — é isso que impede o app-api de escrever no catálogo.

### 5.3 Migrations

Cole o schema da seção 5 do `API-CONTRACT.md` em `src/main/resources/db/migration/V1__init.sql`. O Flyway aplica sozinho ao subir. **Só o admin-api roda migrations** (`spring.flyway.enabled=true`); no app-api deixe `false`, senão os dois brigam.

### 5.4 Configuração

`application.yml` sem nenhum segredo escrito no arquivo:

```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USER}
    password: ${DATABASE_PASSWORD}
  jpa:
    hibernate.ddl-auto: validate
    open-in-view: false
  flyway:
    enabled: ${FLYWAY_ENABLED:false}
carrawave:
  jwt:
    secret: ${JWT_SECRET}
    access-ttl-minutes: 60
    refresh-ttl-days: 60
  cors:
    origins: ${CORS_ORIGINS}
```

Gere o `JWT_SECRET` com `openssl rand -base64 48` e guarde nas variáveis de ambiente do Railway. **Nunca** no GitHub.

### 5.5 O que implementar, em ordem

1. Entidades JPA espelhando o schema (`City`, `Genre`, `Station`, `AppUser`, `Device`, `Favorite`, `PlaySession`, `UserSettings`, `RefreshToken`).
2. `JwtService` (gerar/validar) + `JwtAuthenticationFilter` + `SecurityConfig`.
3. `POST /auth/anonymous` — **este é o endpoint mais importante do sistema**. Sem ele nada funciona e é dele que sai sua contagem de usuários.
4. Catálogo read-only com cache (`@Cacheable`, TTL 5 min).
5. Favoritos e histórico.
6. Telemetria `/playback/*`.
7. Login/registro + merge do anônimo.

### 5.6 Deploy no Railway

Adicione um `Dockerfile` na raiz:

```dockerfile
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
```

No Railway: *New Project → Deploy from GitHub → escolher o repo → adicionar as variáveis de ambiente*. Cada push na `main` reimplanta sozinho.

---

## 6. Web app — passo a passo

```bash
npm create vite@latest carrawave-web -- --template react-ts
cd carrawave-web
npm i react-router-dom @tanstack/react-query hls.js zustand
```

Estrutura:

```
src/
  api/          client.ts, auth.ts, stations.ts, playback.ts
  store/        authStore.ts, playerStore.ts
  audio/        AudioEngine.ts       ← um só <audio> global
  components/   StationCard, PlayerBar, Sidebar, StationArtwork...
  pages/        Home, Explore, Favorites, Recent, Station, Settings
  theme.css     ← as variáveis da seção 2
```

**Regra de ouro do áudio:** existe **um único elemento `<audio>`** na aplicação inteira, criado fora do React em `AudioEngine.ts`. Se você montar o `<audio>` dentro de um componente, ele reinicia a cada re-render e o som corta. O estado (tocando / pausado / rádio atual) vive no Zustand; o `<audio>` só obedece.

Deploy: conecte o repo na Vercel, defina `VITE_API_URL`, pronto.

---

## 7. Android e iOS com Capacitor

```bash
npm i @capacitor/core @capacitor/cli
npx cap init "Carra Wave" br.com.carrawave.app
npm i @capacitor/android && npx cap add android
npm run build && npx cap sync
npx cap open android      # abre o Android Studio
```

No Android Studio: *Build → Generate Signed Bundle/APK → APK → criar keystore*. **Guarde o arquivo `.keystore` e a senha em dois lugares** — se perder, nunca mais consegue atualizar o app publicado.

Três ajustes obrigatórios no Android:
1. `AndroidManifest.xml` precisa de `<uses-permission android:name="android.permission.INTERNET"/>` e `android:usesCleartextTraffic="false"`.
2. Áudio em segundo plano: instale `@capacitor-community/audio-session` e declare um *foreground service* do tipo `mediaPlayback`, senão o Android mata o som ao trocar de app.
3. Notificação de mídia (play/pause na tela bloqueada): plugin `capacitor-music-controls` ou equivalente.

iOS, quando tiver um Mac: `npm i @capacitor/ios && npx cap add ios && npx cap open ios`, marcar *Background Modes → Audio* no Xcode.

---

## 8. Contar acessos — anônimos e logados

É o seu requisito central, então vale repetir a mecânica:

**Todo cliente tem um `deviceId` desde a primeira abertura**, mesmo sem login. Ele é gerado no aparelho, guardado permanentemente e enviado ao backend, que devolve um token. Quem faz login continua com o mesmo `deviceId`, só muda de `ANONYMOUS` para `REGISTERED`.

Resultado: você consegue responder, com uma consulta SQL, quantas pessoas usaram o app hoje, quantas delas têm conta, e por qual plataforma entraram. As queries prontas estão no fim da seção 5 do `API-CONTRACT.md`.

**Onde guardar o `deviceId`:**
| Plataforma | Onde | Cuidado |
|---|---|---|
| Web | `localStorage` | Some se o usuário limpar o navegador — é aceitável |
| Android/iOS (Capacitor) | `@capacitor/preferences` | Persiste entre atualizações |
| Extensão Chrome | `chrome.storage.local` | **Nunca** `localStorage` |

**Complemento com PostHog** (opcional mas recomendado): além do seu banco, mande os eventos para o PostHog identificando com o mesmo `deviceId`. Você ganha funil, retenção e mapa de uso sem construir painel nenhum. Grátis até 1 milhão de eventos/mês.

**LGPD:** `deviceId` anônimo é dado pessoal na leitura mais conservadora da lei. Coloque uma linha na política de privacidade dizendo que você gera um identificador aleatório para medir uso, sem cruzar com dados pessoais, e ofereça um botão "apagar meus dados" nas Configurações. É simples e te protege.

---

## 9. Prompts prontos

Use um por vez, na ordem. Anexe o print da tela correspondente quando indicado. Sempre comece uma conversa nova a cada prompt para não poluir o contexto.

---

### PROMPT 1 — Fundação do backend

```
Você é um desenvolvedor Java sênior. Crie a fundação de uma API REST em
Java 21 + Spring Boot 3.3 chamada "carrawave-app-api", para um app de rádio
online brasileiro.

Contexto: em anexo está o arquivo API-CONTRACT.md com o contrato completo
da API e o schema do PostgreSQL. Siga-o exatamente — não invente rotas,
campos ou nomes diferentes dos que estão lá.

Entregue nesta ordem:
1. pom.xml com as dependências: web, data-jpa, security, postgresql,
   flyway, validation, actuator, lombok, jjwt.
2. application.yml lendo TODA configuração sensível de variáveis de
   ambiente (DATABASE_URL, JWT_SECRET, CORS_ORIGINS). Nenhum segredo
   escrito no arquivo.
3. As entidades JPA de todas as tabelas do schema, com @Table/@Column
   batendo exatamente com os nomes em snake_case do SQL.
4. Os repositories Spring Data correspondentes.

Regras obrigatórias:
- IDs públicos são UUID; o bigserial interno NUNCA aparece na API.
- Todas as datas são Instant em UTC.
- Use records Java para os DTOs, nunca as entidades direto no controller.
- ddl-auto: validate. O schema vem do Flyway, não do Hibernate.

Não implemente ainda os controllers. Só a fundação.
```

---

### PROMPT 2 — Autenticação anônima e com login

```
Continuando o projeto carrawave-app-api. Agora implemente a autenticação.

O ponto central: TODO usuário tem identidade, mesmo sem fazer login.
Na primeira abertura, o cliente gera um deviceId (UUID) e chama
/auth/anonymous, recebendo um JWT com accountType=ANONYMOUS. Se ele fizer
login depois, os favoritos e o histórico do usuário anônimo são migrados
para a conta.

Implemente:
1. JwtService: gerar e validar access token (1h) e refresh token (60 dias,
   rotativo, hash salvo na tabela refresh_token).
2. JwtAuthenticationFilter + SecurityConfig (stateless, CORS lendo a
   variável de ambiente, rotas /auth/** públicas, o resto autenticado).
3. POST /auth/anonymous — IDEMPOTENTE: o mesmo deviceId sempre devolve o
   mesmo userId. Cria app_user (ANONYMOUS) + device + user_settings padrão
   na primeira vez; nas seguintes só atualiza last_seen_at.
4. POST /auth/register e POST /auth/login — com merge: se vier um
   Authorization Bearer de usuário anônimo no header, mova favorite e
   play_session do anônimo para a conta, marque o anônimo como fundido, e
   devolva no JSON quantos itens foram migrados.
5. POST /auth/refresh (rotação: invalida o refresh usado) e POST /auth/logout.

Senhas com BCrypt. Os formatos exatos de request e response estão na
seção 1.3 do API-CONTRACT.md — siga ao pé da letra.

Escreva testes de integração com Testcontainers para: anônimo idempotente,
merge ao logar, e refresh rotativo.
```

---

### PROMPT 3 — Catálogo e dados do usuário

```
Continuando o carrawave-app-api. Implemente os endpoints de catálogo e de
dados do usuário, conforme as seções 2 e 3 do API-CONTRACT.md.

Catálogo (somente leitura):
- GET /stations com filtros city, state, genre, q, onlyLive, sort, paginado.
- GET /stations/{id} com similares e programa atual.
- GET /home — resposta única agregando liveNow, seções e gêneros (para a
  home fazer UMA chamada só no cold start).
- GET /cities, GET /genres, GET /search.

Dados do usuário (funciona igual para ANONYMOUS e REGISTERED):
- GET/PATCH /me
- GET /me/favorites, PUT e DELETE /me/favorites/{stationId} (idempotentes)
- GET /me/history
- GET/PUT /me/settings

Detalhes que importam:
- O campo "favorited" de cada estação é calculado para o usuário do token.
- Cache de 5 minutos no catálogo com @Cacheable.
- anonymousLabel = "CW-" + os 8 primeiros caracteres do deviceId em maiúsculas.
- Paginação no formato padrão do Spring Data.
- Erros no formato único da seção 7 do contrato, com a mensagem já em
  português pronta para exibir — o frontend não monta texto de erro.

Popule V2__seed.sql com estas 14 emissoras reais:
Rio: JB FM 99.9, FM O Dia 100.5, Super Rádio Tupi 96.5, Melodia 97.5,
93 FM 93.3, Mix Rio FM 102.1, Band FM Rio 102.9.
SP: Alpha FM 101.7, Band FM 96.1, Antena 1 94.7, Jovem Pan FM 100.9,
Mix FM São Paulo 106.3, Nativa FM 95.3, Rádio Bandeirantes 107.3.
```

---

### PROMPT 4 — Telemetria de uso

```
Continuando o carrawave-app-api. Implemente a telemetria de reprodução
(seção 4 do API-CONTRACT.md). É daqui que saem as métricas de quantas
pessoas usam o app.

1. POST /playback/start — abre uma play_session, devolve sessionId.
2. POST /playback/{sessionId}/heartbeat — chamado a cada 60s, atualiza
   played_seconds.
3. POST /playback/{sessionId}/stop — fecha com motivo.
4. Job agendado (@Scheduled, a cada 5 min) que fecha sessões órfãs: sem
   heartbeat há mais de 5 minutos, marca end_reason = 'TIMEOUT'.

Crie também um endpoint interno protegido, GET /internal/metrics/daily,
que devolve, para uma data:
- usuários ativos distintos por account_type (ANONYMOUS vs REGISTERED)
- devices distintos por platform (ANDROID, IOS, WEB, CHROME_EXTENSION)
- total de sessões e horas de escuta
- as 10 rádios mais ouvidas

As queries SQL de referência estão no fim da seção 5 do contrato.
Use consultas agregadas no banco, não carregue entidades em memória.
```

---

### PROMPT 5 — Web app: fundação e tema

```
Você é um desenvolvedor frontend sênior especialista em React.
Crie a fundação do web app "Carra Wave" — um agregador de rádios online
brasileiras — em React 18 + Vite + TypeScript.

[ANEXE AQUI o print de Carra Wave - Web.dc.html]

A imagem em anexo é o design aprovado. Reproduza fielmente: sidebar fixa à
esquerda com navegação em pílulas e a lista de favoritas, área central com
busca e grade de cards quadrados, e barra de reprodução fixa na base.

Sistema visual, use exatamente estes valores como CSS custom properties
em :root e [data-theme="dark"]:

CLARO  --bg:#f5ead8  --surf:#fffaf1  --surf2:#ebddc5  --ink:#201e1d
       --ink60:rgba(32,30,29,.62)  --ink40:rgba(32,30,29,.42)
       --line:rgba(32,30,29,.14)   --accent:#c67139  --accent-ink:#8c491a
       --accent-soft:rgba(198,113,57,.13)  --accent-2:#7a8a5e  --onacc:#fffaf1
ESCURO --bg:#17120e  --surf:#241c15  --surf2:#32271d  --ink:#f7eede
       --ink60:rgba(247,238,222,.64) --ink40:rgba(247,238,222,.4)
       --line:rgba(247,238,222,.13)  --accent:#f6a06b  --accent-ink:#ffc6a5
       --accent-soft:rgba(246,160,107,.16) --accent-2:#aebf92 --onacc:#3a1f0e

Tipografia: Caprasimo (Google Fonts) só em títulos; Figtree 400-700 na
interface; IBM Plex Mono 500 maiúsculo com letter-spacing .12em em
etiquetas técnicas como "AO VIVO".
Forma: raio 16px em containers, 999px em TODOS os botões, chips e campos.
Nunca cantos vivos.

Entregue: projeto Vite configurado, theme.css com os tokens, roteamento
(Home, Explorar, Favoritos, Recentes, Rádio, Configurações), e o
componente StationArtwork que, quando a rádio não tem logo, desenha um
quadrado com gradiente e as iniciais em branco — os 8 gradientes são
escolhidos por hash(stationId) % 8:
0 linear-gradient(145deg,#f6a06b,#b2622d)
1 linear-gradient(145deg,#aebf92,#56633f)
2 linear-gradient(145deg,#ffc6a5,#d67f48)
3 linear-gradient(145deg,#c0b6a5,#5a5246)
4 linear-gradient(145deg,#d67f48,#643312)
5 linear-gradient(145deg,#ccdbb2,#728157)
6 linear-gradient(145deg,#f6a06b,#8c491a)
7 linear-gradient(145deg,#8fa073,#3d472b)

Ainda não conecte na API. Use dados fictícios por enquanto.
```

---

### PROMPT 6 — Web app: áudio e integração com a API

```
Continuando o carrawave-web. Agora conecte na API e faça o áudio funcionar.

[ANEXE o API-CONTRACT.md]

1. api/client.ts — fetch com interceptor que injeta o Bearer token e, ao
   receber 401 TOKEN_EXPIRED, chama /auth/refresh uma vez e repete a
   requisição original. A URL base vem de import.meta.env.VITE_API_URL,
   nunca escrita no código.

2. Bootstrap de identidade: ao abrir o app, se não houver deviceId no
   localStorage, gere um UUID v4, salve, e chame POST /auth/anonymous com
   platform "WEB". Guarde os tokens. O usuário navega sem nunca ver tela
   de login — o login é opcional e fica nas Configurações.

3. audio/AudioEngine.ts — um ÚNICO elemento <audio> criado FORA do React,
   como singleton. Isso é crítico: se o <audio> for montado dentro de um
   componente React, ele reinicia a cada render e o som corta. Use hls.js
   quando streamFormat for HLS e src direto quando for ICECAST/MP3.
   Exponha play(station), pause(), setVolume().

4. store/playerStore.ts com Zustand: rádio atual, tocando/pausado, volume,
   temporizador de sono. Os componentes leem daqui; só o AudioEngine toca
   no elemento de áudio.

5. Telemetria: ao dar play chame /playback/start; enquanto tocar, um
   heartbeat a cada 60s; ao parar ou trocar de rádio, /playback/stop com
   o motivo correto.

6. React Query para o catálogo, com staleTime de 5 minutos.

7. Estados de erro usando as telas do design: sem conexão (503) e erro de
   stream (422 STREAM_UNAVAILABLE). Mostre o campo "message" que vem da
   API — ele já chega em português.
```

---

### PROMPT 7 — Telas do mobile

```
Continuando o carrawave-web, que vira também o app mobile via Capacitor.

[ANEXE os prints de Carra Wave - App.dc.html, claro e escuro]

As imagens mostram as telas do aplicativo mobile já aprovadas. Implemente
o layout responsivo para telas abaixo de 768px reproduzindo exatamente:

- Splash com a marca e as ondas animadas.
- Onboarding de 3 passos com indicador de progresso em pílula.
- Login com e-mail, Google, Apple E um botão "Entrar sem login" com
  destaque igual — acesso sem conta é caminho de primeira classe, não
  letra miúda. Abaixo dele, o aviso de que um ID anônimo é gerado no
  aparelho apenas para medir uso.
- Home com saudação, busca, carrossel "Ao vivo agora", destaques por
  cidade, mais ouvidas e chips de gênero.
- Explorar com alternância grade/lista e filtros em chips.
- Detalhe da rádio com capa grande, ouvir agora, favoritar e similares.
- Player em tela cheia com capa, ondas animadas, controle central de
  82px, volume e temporizador de sono.
- Mini player fixo acima da navegação inferior, sempre visível quando há
  rádio tocando.
- Favoritos (com e sem itens), Recentes, Gêneros, Configurações,
  Sem conexão e Erro de stream.

Regras: mesmos tokens de cor da conversa anterior; alvo de toque nunca
menor que 44x44px; navegação inferior com 4 abas; tudo em português do
Brasil.
```

---

### PROMPT 8 — Empacotar como Android e iOS

```
Tenho um web app React + Vite pronto, chamado carrawave-web. Quero
transformá-lo em aplicativo Android (APK) e iOS usando Capacitor 6,
mantendo um único código-fonte.

Me dê o passo a passo completo e os arquivos:

1. Instalação e configuração do Capacitor (appId br.com.carrawave.app,
   appName "Carra Wave").
2. capacitor.config.ts adequado, incluindo splash screen e a cor de fundo
   #f5ead8 no claro / #17120e no escuro.
3. Trocar o armazenamento do deviceId e dos tokens de localStorage para
   @capacitor/preferences quando rodando em nativo, mantendo localStorage
   no navegador. Faça uma camada de storage que abstraia os dois.
4. Áudio em segundo plano no Android: o som PRECISA continuar quando o
   usuário sai do app ou bloqueia a tela. Configure foreground service do
   tipo mediaPlayback e os controles de mídia na notificação e na tela
   bloqueada (play, pause, nome da rádio).
5. Permissões e ajustes do AndroidManifest.xml.
6. Como gerar o APK assinado no Android Studio, criar o keystore e o que
   preciso guardar para conseguir publicar atualizações no futuro.
7. Os passos equivalentes para iOS (assumindo que eu terei um Mac
   depois), incluindo Background Modes → Audio.
8. Ícones e splash: liste os tamanhos necessários e como gerá-los a partir
   de um SVG único com @capacitor/assets.

Explique cada passo como se eu nunca tivesse publicado um app antes.
```

---

### PROMPT 9 — Admin web

```
Crie o painel administrativo "Carra Wave Admin" em React + Vite +
TypeScript, consumindo a carrawave-admin-api (seção 6 do API-CONTRACT.md,
em anexo).

Telas:
1. Login de operador.
2. Lista de emissoras com busca, filtro por cidade e gênero, e indicador
   de status do stream (verde/vermelho).
3. Formulário de emissora: nome, frequência, cidade, gêneros, URL do
   stream, formato, site, descrição, cor da capa, ativo. Com botão
   "Testar stream" que chama /stations/{id}/check-stream e mostra o
   resultado.
4. CRUD de cidades e gêneros.
5. Painel de métricas — o mais importante: usuários ativos no período
   separados entre ANÔNIMOS e COM LOGIN, dispositivos por plataforma
   (Android, iOS, Web, Extensão), total de sessões, horas de escuta, taxa
   de conversão de anônimo para conta, e ranking das rádios mais ouvidas.
   Use gráficos simples de barra e linha. A cor principal é #c67139 e a
   secundária #7a8a5e.

Mesmo sistema visual do app (tokens de cor da conversa do web app), mas
com densidade maior — é ferramenta de trabalho, não vitrine. Tabelas com
linhas de 48px, tipografia Figtree, títulos em Caprasimo.
```

---

### PROMPT 10 — Extensão do Chrome

```
Crie a extensão do Chrome "Carra Wave" em Manifest V3, reaproveitando os
componentes React do carrawave-web.

[ANEXE o print da seção 02 de Carra Wave - Web.dc.html]

A imagem mostra o popup aprovado: 360px de largura, cabeçalho com a marca
e o badge do ID, rádio tocando com capa de 64px, controles, aviso de
reprodução em segundo plano, e lista de acesso rápido às favoritas.

O ponto crítico da arquitetura: no MV3 o popup é DESTRUÍDO quando perde o
foco. Se o <audio> estiver no popup, o som morre ao clicar fora. Portanto:

1. O <audio> deve viver num offscreen document
   (chrome.offscreen.createDocument com reason AUDIO_PLAYBACK).
2. O popup apenas envia mensagens para o service worker, que comanda o
   offscreen document.
3. deviceId e tokens em chrome.storage.local — nunca localStorage.
4. O heartbeat de 60 segundos da telemetria usa chrome.alarms (mínimo de
   30s permitido), porque o service worker hiberna e setInterval não
   sobrevive.
5. Envie platform "CHROME_EXTENSION" no /auth/anonymous, para as métricas
   separarem a extensão do web app.
6. Ofereça também o modo Side Panel (chrome.sidePanel), que fica aberto e
   é melhor para ouvir rádio.

Entregue manifest.json, service worker, offscreen.html/ts, o popup em
React e as instruções para carregar em modo desenvolvedor e para publicar
na Chrome Web Store (taxa única de US$ 5).
```

---

### PROMPT 11 — Infraestrutura e publicação

```
Preciso colocar no ar, com custo zero, um sistema composto de:
- carrawave-app-api (Spring Boot, Java 21)
- carrawave-admin-api (Spring Boot, Java 21)
- carrawave-web (React + Vite)
- carrawave-admin (React + Vite)
- PostgreSQL

Me dê o passo a passo, do zero, assumindo que eu só tenho conta no GitHub:

1. Criar o banco no Neon e obter as duas connection strings com usuários
   de permissões diferentes (app-api não escreve no catálogo).
2. Dockerfile multi-stage para os projetos Spring Boot com Java 21.
3. Deploy dos dois backends no Railway, com as variáveis de ambiente e
   deploy automático a cada push.
4. Deploy dos dois frontends na Vercel com a variável VITE_API_URL.
5. Configurar CORS no Spring para aceitar o domínio da Vercel e a origem
   chrome-extension://.
6. Como evitar que o serviço "durma" no plano grátis, usando um ping
   gratuito a cada 10 minutos no /actuator/health.
7. GitHub Actions rodando os testes a cada push.
8. Depois, migrar de carrawave.vercel.app para um domínio .com.br
   registrado no registro.br, usando Cloudflare como DNS, sem downtime e
   sem reconstruir os apps.
9. O que monitorar de graça para saber que está tudo de pé.

Seja específico: nomes de variáveis, onde clicar, ordem exata.
```

---

## 10. Conferência antes de considerar pronto

**Funciona de verdade**
- [ ] Abri o app pela primeira vez e ouvi uma rádio sem criar conta
- [ ] Favoritei uma rádio como anônimo, fechei, reabri, e ela continua lá
- [ ] Fiz login depois e os favoritos anônimos vieram junto
- [ ] O som continua quando eu saio do app / bloqueio a tela
- [ ] O temporizador de sono realmente desliga o som
- [ ] Modo escuro em todas as telas, sem texto ilegível

**Os números aparecem**
- [ ] `select account_type, count(distinct device_id) ...` devolve dados
- [ ] Consigo ver acessos separados por Android, iOS, Web e Extensão
- [ ] Sessões órfãs são fechadas pelo job (não ficam abertas para sempre)

**Está seguro**
- [ ] Nenhum segredo commitado no GitHub
- [ ] O usuário de banco do app-api não consegue alterar o catálogo
- [ ] HTTPS em tudo, CORS restrito às origens conhecidas
- [ ] Rate limit ativo
- [ ] Política de privacidade publicada explicando o ID anônimo

**Está no ar**
- [ ] Backend não dorme (ou tem ping)
- [ ] APK instala num aparelho limpo
- [ ] Keystore guardado em dois lugares

---

## 11. Quando o grátis acabar

| Sinal | O que fazer | Custo |
|---|---|---|
| Banco perto de 0,5 GB | Neon Launch | US$ 19/mês |
| Backend passando do crédito | Railway Hobby | US$ 5/mês |
| Muitos ouvintes simultâneos | Cloudflare na frente do stream | Grátis |
| Quer domínio próprio | registro.br `.com.br` | ~R$ 40/ano |
| Publicar na Play Store | Taxa única Google | US$ 25 |
| Publicar na App Store | Apple Developer | US$ 99/ano |

Até uns **5 mil usuários ativos por mês**, dá para rodar tudo no gratuito.

---

## 12. O erro que mais custa caro

Reescrever o frontend três vezes — uma para web, uma para Android, uma para iOS. Não faça. **Um código React, empacotado pelo Capacitor.** Quando o web estiver bom, Android sai em um dia e iOS em outro. É por isso que a ordem da seção 4 começa pela web mesmo que seu objetivo principal seja o APK.
