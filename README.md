# Carra Wave

Agregador de rádios brasileiras — ouça, ao vivo, as suas rádios favoritas em um só lugar. *Sua sintonia, em qualquer lugar.*

Monorepo com backend, web app e (em breve) app Android.

## Estrutura do projeto

```
carra-wave/
├── carrawave-app-api/    # Backend — Java 21 + Spring Boot 3.3 + PostgreSQL
├── carrawave-web/        # Web app — React 18 + Vite + TypeScript
├── design/                # Mockups de referência (.dc.html) usados no layout
├── API-CONTRACT.md        # Contrato de API, schema do banco, regras de token — fonte da verdade do backend
└── MANUAL-CARRA-WAVE.md   # Manual completo de construção do projeto, do zero ao ar
```

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Java 21, Spring Boot 3.3, Spring Security (JWT), Flyway, PostgreSQL |
| Web | React 18, Vite, TypeScript, Zustand, hls.js |
| Áudio | `<audio>` nativo para streams ICECAST/MP3, `hls.js` (carregado sob demanda) para HLS |
| Autenticação | JWT próprio, com suporte a usuário anônimo e registrado (com migração automática de favoritos/histórico ao logar) |

## Como rodar localmente

### Pré-requisitos

- Java 21 e Maven
- Node.js 18+
- PostgreSQL rodando localmente (banco `carrawave`)

### Backend

1. Crie `carrawave-app-api/src/main/resources/application-local.yml` com a sua conexão do Postgres, o segredo do JWT e as origens de CORS (veja as chaves esperadas em `application.yml`) — esse arquivo **nunca** vai para o Git.
2. Rode:

   ```bash
   cd carrawave-app-api
   ./run.sh      # Linux/Mac
   # ou
   ./run.ps1     # Windows PowerShell
   ```

   O Flyway cria o schema e popula os dados iniciais (cidades, gêneros e emissoras) automaticamente na primeira execução.
3. O backend fica em `http://localhost:8080`. Health check: `http://localhost:8080/actuator/health`.

### Web

```bash
cd carrawave-web
npm install
cp .env.example .env.local   # ajuste VITE_API_URL se necessário
npm run dev
```

Acesse `http://localhost:5173`.

## Segurança

- Senhas com BCrypt (custo 12).
- JWT de acesso de curta duração + refresh token, ambos assinados com segredo próprio por ambiente (nunca commitado).
- Rate limiting em `/api/v1/**` (janela fixa por IP), mais restritivo em `/api/v1/auth/**`.
- Headers de segurança (CSP, HSTS, X-Content-Type-Options, Referrer-Policy) e CORS restrito às origens configuradas.
- Nenhuma credencial, segredo ou dado sensível vai para o repositório — tudo via variável de ambiente ou arquivo `*-local.yml` no `.gitignore`.

## Documentação

- [`API-CONTRACT.md`](./API-CONTRACT.md) — todos os endpoints, schema do banco e regras de autenticação.
- [`MANUAL-CARRA-WAVE.md`](./MANUAL-CARRA-WAVE.md) — manual completo do projeto, decisões de arquitetura e roteiro de construção.
