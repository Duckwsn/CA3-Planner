# Deploy Checklist — CA3 Planner

Checklist de implantação com status real do código versus configuração no Render.

> Legenda: [X] implementado/OK | [ ] pendente

---

## Pré-requisitos

| Item | Status |
|---|---|
| Conta GitHub com repositório (`Duckwsn/CA3-Planner`) | [X] |
| Conta Render | [X] |
| Conta Neon (PostgreSQL serverless) | [X] |

---

## 1. Banco de Dados (Neon)

| Item | Status |
|---|---|
| Projeto Neon criado | [X] |
| String DATABASE_URL com `sslmode=require` | [X] |
| Código Prisma aponta para PostgreSQL (`server/prisma/schema.prisma:6`) | [X] |
| Schema com todos os modelos (User, Board, Task, Team, Comment, Notification, ChecklistItem, Attachment, Organization) | [X] |

---

## 2. Repositório GitHub

| Item | Status |
|---|---|
| Repositório criado e conectado ao Render | [X] |
| Últimas alterações commitadas e pusheadas | [X] `21b5f8e` |

**Arquivos commitados:**

- `render.yaml` — Infraestrutura como código
- `server/src/index.ts` — Seed automático, startup assíncrono
- `server/src/db/seed.ts` — Função seedDatabase reutilizável
- `server/package.json` — Start script com `npx prisma db push`
- `package.json` (raiz) — Start script com `npx prisma db push`
- `docs/DEPLOY.md` — Este checklist
- `docs/PRD.md` — Product Requirements Document
- `docs/API.md` — Seções de notificações, health check, password
- `docs/ARCHITECTURE.md` — Neon/PostgreSQL, deploy section, Notification

---

## 3. Render Web Service

### Build e Start Command

| Item | Status |
|---|---|
| Build Command | [X] Funcionando |
| Start Command | [X] Funcionando |
| Health Check Path: `/api/health` | [X] Retorna 200 |

### Variáveis de Ambiente

| Variável | Status |
|---|---|
| `DATABASE_URL` | [X] Configurada |
| `JWT_SECRET` | [X] Configurada |
| `CORS_ORIGIN` | [X] Configurada |
| `NODE_ENV=production` | [X] Configurada |
| `VITE_API_URL=/api` | [X] Configurada |

---

## 4. Código-fonte

| Item | Arquivo | Status |
|---|---|---|
| Build Command com `--include=dev` | DEPLOY.md | [X] |
| Start Command com `npx prisma db push` | `server/package.json`, `package.json` | [X] |
| CORS dinâmico (`CORS_ORIGIN` env var) | `server/src/index.ts:25` | [X] |
| SPA fallback (`app.get('*', ...)`) | `server/src/index.ts:48` | [X] |
| Health check (`/api/health`) | `server/src/index.ts:31` | [X] |
| `httpClient.ts` usa `import.meta.env.VITE_API_URL` | `src/core/api/httpClient.ts:3` | [X] |
| Seed automático no startup em produção | `server/src/index.ts:56-62` | [X] |
| Helmet `contentSecurityPolicy: false` | `server/src/index.ts:23` | [X] |
| Morgan modo `combined` em produção | `server/src/index.ts:28` | [X] |
| Build local testado | TypeScript + Vite compilam sem erros | [X] |

---

## 5. Seed do Banco

| Item | Status |
|---|---|
| Seed automático verifica banco vazio antes de popular | [X] |
| Seed manual disponível (`server/src/seed.ts`) | [X] |
| Seed executado no Neon | [X] Populado automaticamente no startup |

---

## 6. Verificação Pós-Deploy

| Item | Status |
|---|---|
| Health Check `/api/health` | 🟢 `200 OK` — `{"status":"ok","timestamp":"..."}` |
| Login `admin@escola.edu` / `123456` | 🟢 Token JWT + dados do usuário retornados |
| Cadastro novo usuário | 🟢 Registro funcionou |
| Navegação (SPA fallback) | 🟢 Frontend servido no `/` |
| Notificações | [?] Não testado |

---

## Status Geral

| Categoria | Status |
|---|---|
| Pré-requisitos | ✅ |
| Neon Database | ✅ |
| GitHub commit/push | ✅ |
| Render (comando + env) | ✅ |
| Código-fonte | ✅ |
| Build local | ✅ |
| Seed | ✅ |
| Pós-deploy | 🟢 4/5 testados |

**Deploy concluído com sucesso!** O serviço está rodando em `https://ca3-planner-go98.onrender.com`.
