# Deploy Checklist — CA3 Planner

Checklist de implantação com status real do código versus configuração no Render.

> Legenda: [X] implementado/OK | [ ] pendente | [?] não verificado

---

## Sumário

- [Deploy Checklist — CA3 Planner](#deploy-checklist--ca3-planner)
  - [Sumário](#sumário)
  - [Pré-requisitos](#pré-requisitos)
  - [1. Banco de Dados (Neon)](#1-banco-de-dados-neon)
  - [2. Repositório GitHub](#2-repositório-github)
  - [3. Render Web Service](#3-render-web-service)
    - [Build e Start Command](#build-e-start-command)
    - [Variáveis de Ambiente](#variáveis-de-ambiente)
  - [4. Código-fonte (implementado localmente)](#4-código-fonte-implementado-localmente)
  - [5. Seed do Banco](#5-seed-do-banco)
  - [6. Verificação Pós-Deploy](#6-verificação-pós-deploy)
  - [Status Geral](#status-geral)

---

## Pré-requisitos

| Item | Status | Impacto |
|---|---|---|
| Conta GitHub com repositório (`Duckwsn/CA3-Planner`) | [X] | — |
| Conta Render | [X] | — |
| Conta Neon (PostgreSQL serverless) | [X] | — |

---

## 1. Banco de Dados (Neon)

| Item | Status | Impacto |
|---|---|---|
| Projeto Neon criado (região São Paulo) | [X] | — |
| String DATABASE_URL com `sslmode=require` | [X] | — |
| Código Prisma aponta para PostgreSQL (`server/prisma/schema.prisma:6`) | [X] | — |
| Schema com todos os modelos (User, Board, Task, Team, Comment, Notification, ChecklistItem, Attachment, Organization) | [X] | — |

---

## 2. Repositório GitHub

| Item | Status | Impacto |
|---|---|---|
| Repositório criado e conectado ao Render | [X] | — |
| **Últimas alterações commitadas e pusheadas** | [X] | Commit `53c18e6` para `main` ✅ |

**Arquivos commitados no último push:**

| Arquivo | Mudança |
|---|---|
| `render.yaml` | **Novo** — Infraestrutura como código (Build, Start, env vars) |
| `server/src/index.ts` | Seed automático, startup assíncrono |
| `server/src/db/seed.ts` | Novo — função seedDatabase reutilizável |
| `server/package.json` | Start script com `npx prisma db push` |
| `package.json` (raiz) | Start script com `npx prisma db push` |
| `docs/DEPLOY.md` | Novo — checklist com status e impacto |
| `docs/PRD.md` | Novo — Product Requirements Document |
| `docs/API.md` | Seções de notificações, health check, password |
| `docs/ARCHITECTURE.md` | Neon/PostgreSQL, deploy section, Notification |

---

## 3. Render Web Service

### Build e Start Command

| Item | Status | Impacto |
|---|---|---|
| `render.yaml` no repositório | [X] | Declaração IaC com Build, Start, env vars ✅ |
| Build Command (`render.yaml`) | [X] `npm install --include=dev && npm run build && cd server && npm install --include=dev && npm run build && npx prisma generate` | ✅ |
| Start Command (`render.yaml`) | [X] `npm start` | ✅ |
| Health Check Path (`render.yaml`) | [X] `/api/health` | ✅ |
| Build Command no dashboard Render | [?] | 🟡 **Verificar se dashboard reflete render.yaml ou precisa config manual** |
| Start Command no dashboard Render | [?] | 🟡 **Verificar no dashboard** |
| Auto-Deploy | [?] | 🟡 **Verificar no dashboard** |

### Variáveis de Ambiente

| Variável | Obrigatória | Status | Impacto |
|---|---|---|---|
| `DATABASE_URL` | ✅ Sim | [?] | 🟡 **Verificar no dashboard Render** |
| `JWT_SECRET` | ✅ Sim | [?] | 🟡 **Verificar no dashboard Render** |
| `CORS_ORIGIN` | ✅ Sim | [?] | 🔴 **CRÍTICO** — sem isso CORS bloqueia requisições |
| `NODE_ENV=production` | ✅ Sim | [?] | 🔴 **CRÍTICO** — sem `production` o servidor não serve frontend nem roda seed |
| `VITE_API_URL=/api` | ✅ Sim | [?] | 🔴 **CRÍTICO** — sem `/api` o frontend chama `localhost:3001` |
| `JWT_EXPIRES_IN` | ❌ Não | — | Opcional (default 7d) |
| `PORT` | ❌ Não | — | Render define automaticamente |

> 🔧 O `render.yaml` define `NODE_ENV=production` e `VITE_API_URL=/api` como valores fixos.
> `DATABASE_URL`, `JWT_SECRET` e `CORS_ORIGIN` estão marcados como `sync: false` — você precisa configurá-los manualmente no dashboard do Render.

---

## 4. Código-fonte (implementado localmente)

| Item | Status | Impacto |
|---|---|---|
| Build Command com `--include=dev` | [X] Documentado no DEPLOY.md | — |
| Start Command com `npx prisma db push` | [X] Em `server/package.json` e `package.json` raiz | — |
| Servidor com CORS dinâmico (`CORS_ORIGIN` env var) | [X] `server/src/index.ts:25` | — |
| Servidor com SPA fallback (`app.get('*', ...)`) | [X] `server/src/index.ts:48` | — |
| Servidor com health check (`/api/health`) | [X] `server/src/index.ts:31` | — |
| `httpClient.ts` usa `import.meta.env.VITE_API_URL` | [X] `src/core/api/httpClient.ts:3` | — |
| Seed automático no startup em produção | [X] `server/src/index.ts:56-62` | — |
| Helmet com `contentSecurityPolicy: false` | [X] `server/src/index.ts:23` | — |
| Morgan modo `combined` em produção | [X] `server/src/index.ts:28` | — |

---

## 5. Seed do Banco

| Item | Status | Impacto |
|---|---|---|
| Seed automático verifica banco vazio antes de popular | [X] `server/src/db/seed.ts` | — |
| Seed manual disponível (`server/src/seed.ts`) | [X] | — |
| Seed executado no Neon (banco populado) | [ ] | 🟡 **Necessário após deploy** |

---

## 6. Verificação Pós-Deploy

| Item | Status | Impacto |
|---|---|---|
| Health Check `/api/health` retorna 200 | [ ] | 🔴 **SERVIDOR NÃO RESPONDE** — retorna 404 |
| Login funcional (`admin@escola.edu` / `123456`) | [ ] | — |
| Cadastro de novo usuário | [ ] | — |
| Navegação entre páginas | [ ] | — |
| Notificações | [ ] | — |

---

## Status Geral

| Categoria | Concluído | Pendente | Impacto |
|---|---|---|---|---|
| Pré-requisitos | 3/3 | 0 | ✅ |
| Neon Database | 4/4 | 0 | ✅ |
| GitHub (commit/push) | 1/1 | 0 | ✅ |
| Render (comando/env) | 5/9 | 4 | 🟡 **Requer validação no dashboard** |
| Código-fonte | 9/9 | 0 | ✅ |
| Build local testado | ✅ | — | TypeScript + Vite compilam sem erros |
| Seed | 2/2 | 1 | 🟡 **Automaticamente executado no startup em produção** |
| Pós-deploy | 0/5 | 5 | 🔴 **Aguardando deploy** |

**Resumo: 24 itens OK, 10 pendentes.** O bloqueio principal agora é:

1. **Configurar env vars no dashboard Render** — `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `NODE_ENV`, `VITE_API_URL`
2. **Verificar Build/Start Command** — confirmar que o dashboard está usando os comandos do `render.yaml`
3. **Trigger deploy manual ou automático** — Render deve fazer deploy automático ao detectar push na `main`
