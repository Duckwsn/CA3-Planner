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
| **Últimas alterações commitadas e pusheadas** | [ ] | 🔴 **IMPEDE O DEPLOY** |

**Arquivos pendentes de commit:**

| Arquivo | Mudança |
|---|---|
| `server/src/index.ts` | Seed automático, startup assíncrono |
| `server/src/db/seed.ts` | Novo — função seedDatabase reutilizável |
| `server/package.json` | Start script com `npx prisma db push` |
| `package.json` (raiz) | Start script com `npx prisma db push` |
| `src/core/api/httpClient.ts` | BASE_URL com `import.meta.env.VITE_API_URL` |
| `src/shared/components/KpiCard/KpiCard.types.ts` | Novo — tipos do KpiCard |
| `docs/PRD.md` | Novo — Product Requirements Document |
| `docs/DEPLOY.md` | Novo — este documento |
| `docs/API.md` | Seções de notificações, health check, password |
| `docs/ARCHITECTURE.md` | Neon/PostgreSQL, deploy section, Notification |

---

## 3. Render Web Service

### Build e Start Command

| Item | Status | Impacto |
|---|---|---|
| Tipo: Web Service | [?] | — |
| Root Directory: `.` (raiz) | [?] | — |
| Runtime: Node | [?] | — |
| Build Command configurado (`npm install --include=dev && npm run build && cd server && npm install --include=dev && npm run build && npx prisma generate`) | [?] | 🟡 **Verificar no dashboard** |
| Start Command configurado (`npm start`) | [?] | 🟡 **Verificar no dashboard** |
| Health Check Path: `/api/health` | [?] | 🟡 **Verificar no dashboard** |

### Variáveis de Ambiente

| Variável | Obrigatória | Status | Impacto |
|---|---|---|---|
| `DATABASE_URL` | ✅ Sim | [?] | 🟡 **Verificar se é a string do Neon** |
| `JWT_SECRET` | ✅ Sim | [?] | 🟡 **Verificar se é `745296`** |
| `CORS_ORIGIN` | ✅ Sim | [?] | 🔴 **CRÍTICO** — sem isso CORS bloqueia requisições |
| `NODE_ENV` | ✅ Sim | [?] | 🔴 **CRÍTICO** — sem `production` o servidor não serve frontend nem roda seed |
| `VITE_API_URL` | ✅ Sim | [?] | 🔴 **CRÍTICO** — sem `/api` o frontend chama `localhost:3001` |
| `JWT_EXPIRES_IN` | ❌ Não | — | Opcional (default 7d) |
| `PORT` | ❌ Não | — | Render define automaticamente |

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
|---|---|---|---|
| Pré-requisitos | 3/3 | 0 | ✅ |
| Neon Database | 4/4 | 0 | ✅ |
| GitHub (commit/push) | 0/1 | 1 | 🔴 **IMPEDE DEPLOY** |
| Render (comando/env) | 0/7 | 7 | 🔴 **CRÍTICO** |
| Código-fonte | 9/9 | 0 | ✅ |
| Seed | 2/2 | 1 | 🟡 |
| Pós-deploy | 0/5 | 5 | 🔴 |

**Resumo:** 18 itens OK, 14 pendentes. O bloqueio principal é:
1. **Commit/push** — código novo não está no GitHub
2. **Env vars no Render** — `VITE_API_URL`, `CORS_ORIGIN`, `NODE_ENV` precisam ser validadas
3. **Build/Start Command no dashboard** — precisam estar conforme documentado
