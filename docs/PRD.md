# PRD — CA3 Planner

**Product Requirements Document**

Sistema de Gestão Pedagógica — Planejamento, acompanhamento de tarefas e relatórios para coordenadores e professores.

---

## Sumário

- [PRD — CA3 Planner](#prd--ca3-planner)
  - [Sumário](#sumário)
  - [1. Visão do Produto](#1-visão-do-produto)
  - [2. Stack Tecnológica](#2-stack-tecnológica)
  - [3. Sprints](#3-sprints)
    - [[X] Sprint 1 — Infraestrutura e Setup](#x-sprint-1--infraestrutura-e-setup)
    - [[X] Sprint 2 — Autenticação](#x-sprint-2--autenticação)
    - [[X] Sprint 3 — Boards e Tarefas](#x-sprint-3--boards-e-tarefas)
    - [[X] Sprint 4 — Equipes e Membros](#x-sprint-4--equipes-e-membros)
    - [[X] Sprint 5 — Funcionalidades de Tarefa](#x-sprint-5--funcionalidades-de-tarefa)
    - [[X] Sprint 6 — Design System e Componentes](#x-sprint-6--design-system-e-componentes)
    - [[X] Sprint 7 — Notificações](#x-sprint-7--notificações)
    - [[X] Sprint 8 — Relatórios e Exportação PDF](#x-sprint-8--relatórios-e-exportação-pdf)
    - [[X] Sprint 9 — Deploy e Migração para Nuvem](#x-sprint-9--deploy-e-migração-para-nuvem)
    - [[X] Sprint 10 — Seed Automático e Startup Resiliente](#x-sprint-10--seed-automático-e-startup-resiliente)
  - [4. Plano de Implementação — Próximas Sprints](#4-plano-de-implementação--próximas-sprints)
    - [[X] Sprint 10 — Seed Automático e Startup Resiliente](#x-sprint-10--seed-automático-e-startup-resiliente)
    - [[X] Sprint 11 — Documentação e Finalização de Deploy](#x-sprint-11--documentação-e-finalização-de-deploy)
    - [[X] Sprint 12 — Backlog de Melhorias Futuras](#x-sprint-12--backlog-de-melhorias-futuras)
  - [5. Arquitetura](#5-arquitetura)
  - [6. Modelo de Dados](#6-modelo-de-dados)
  - [7. Rotas da Aplicação](#7-rotas-da-aplicação)
  - [8. Variáveis de Ambiente](#8-variáveis-de-ambiente)

---

## 1. Visão do Produto

O CA3 Planner é uma aplicação web voltada ao ambiente educacional que permite:

- **Gerenciar** boards (quadros) de disciplinas com tarefas organizadas por status e prioridade
- **Acompanhar** o progresso de atividades pedagógicas em tempo real
- **Colaborar** entre coordenadores e professores via comentários e checklists
- **Relatar** métricas e dados gerenciais com exportação em PDF profissional
- **Notificar** membros da equipe sobre alterações em tarefas e boards

**Público-alvo:** Coordenadores pedagógicos, professores, gestores escolares.

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| Frontend | React + TypeScript | 19.2 + 6.0 |
| Build | Vite | 8.1 |
| Estilos | Tailwind CSS | 4.3 |
| Estado | Zustand | 5.0 |
| Backend | Express + TypeScript | 4.21 + 5.7 |
| ORM | Prisma | 5.22 |
| Banco | PostgreSQL (Neon) | - |
| Auth | JWT (jsonwebtoken + bcryptjs) | - |
| PDF | jsPDF + jspdf-autotable | 4.2 + 5.0 |
| Deploy | Render | - |

---

## 3. Sprints

### [X] Sprint 1 — Infraestrutura e Setup

**Objetivo:** Inicializar o projeto com as ferramentas e estrutura de diretórios.

**Entregas:**
- Setup do Vite + React + TypeScript + Tailwind v4
- Estrutura de diretórios: `src/app/`, `src/core/`, `src/shared/`, `src/modules/`, `src/stores/`, `src/services/`, `src/hooks/`, `src/types/`
- Server Express com TypeScript em `server/`
- Prisma ORM com SQLite (`server/prisma/schema.prisma`)
- Configuração de rotas (`tsconfig.json` com project references)
- Design tokens via CSS custom properties (`tokens.css`)
- Integração Tailwind + Vite (`@tailwindcss/vite`)

---

### [X] Sprint 2 — Autenticação

**Objetivo:** Implementar cadastro, login e gerenciamento de sessão.

**Entregas:**
- Backend:
  - Model `User` no Prisma (id, name, email, password, role, avatar, organizationId)
  - `POST /api/auth/register` — cadastro com bcrypt + JWT
  - `POST /api/auth/login` — login com validação
  - `GET /api/auth/me` — dados do usuário autenticado
  - `PATCH /api/auth/me/password` — alteração de senha
  - Middleware `authenticate` (extração e verificação JWT)
  - Middleware `error-handler` (tratamento centralizado de erros)
- Frontend:
  - `authStore` (Zustand + persist) com token e dados do usuário
  - `LoginPage` com validação de formulário
  - `RegisterPage` com cadastro
  - Interceptor Axios para token JWT
  - Guarda de rota `PrivateGuard` com redirect para `/login`
  - `httpClient.ts` com helpers: `apiGet`, `apiPost`, `apiPut`, `apiPatch`, `apiDelete`

---

### [X] Sprint 3 — Boards e Tarefas

**Objetivo:** CRUD de boards (quadros) e tarefas com drag-and-drop.

**Entregas:**
- Backend:
  - Model `Board` (title, description, color, userId, organizationId)
  - Model `Task` (boardId, title, description, status, priority, assignee, dueDate)
  - `GET /boards`, `POST /boards`, `GET /boards/:id`, `PUT /boards/:id`, `DELETE /boards/:id`
  - `GET /tasks`, `GET /tasks/board/:boardId`, `POST /tasks`, `PUT /tasks/:id`, `PATCH /tasks/:id/move`, `DELETE /tasks/:id`
- Frontend:
  - `BoardsPage` — grid de boards com criação inline
  - `BoardDetailsPage` — Kanban com 4 colunas (Todo, Doing, Review, Done)
  - Drag-and-drop com `@hello-pangea/dnd`
  - `BoardService`, `TaskService`
  - `boardStore`, `taskStore` (Zustand com persist)
  - Hooks: `useBoards`, `useTasks`, `useBoard`, `useTaskDetail`
  - Drawer lateral com detalhe da tarefa

---

### [X] Sprint 4 — Equipes e Membros

**Objetivo:** Gerenciar equipes pedagógicas e seus membros.

**Entregas:**
- Backend:
  - Model `Team` (name, description, organizationId)
  - Model `TeamMember` (name, email, role)
  - CRUD completo: `GET /teams`, `POST /teams`, `PUT /teams/:id`, `DELETE /teams/:id`
  - Gerenciamento de membros: `POST /teams/:id/members`, `DELETE /teams/:id/members/:memberId`
  - Notificação ao adicionar membro (`notifyOrganizationMembers`)
- Frontend:
  - `TeamsPage` — listagem com cards de equipe expansíveis
  - Modal de criação/edição de equipe
  - Modal de gerenciamento de membros
  - `teamStore` + `teamService`

---

### [X] Sprint 5 — Funcionalidades de Tarefa

**Objetivo:** Comentários, checklist e anexos em tarefas.

**Entregas:**
- Backend:
  - Model `Comment` (taskId, userId, content)
  - Model `ChecklistItem` (taskId, text, checked)
  - Model `Attachment` (taskId, userId, name, size, type, url)
  - CRUD de comentários, checklists e anexos
  - Upload de arquivos com Multer (local + Cloudinary opcional)
  - Notificação ao criar comentário
- Frontend:
  - Abas no Drawer de tarefa: Comentários, Checklist, Anexos
  - Comentários com nome/avatar do autor e timestamp
  - Checklist com toggle checked/unchecked
  - Upload e remoção de anexos

---

### [X] Sprint 6 — Design System e Componentes

**Objetivo:** Componentes reutilizáveis e identidade visual consistente.

**Entregas:**
- `tokens.css` — cores, tipografia, sombras, radius, z-index, animações
- Componentes: `Button`, `Card` (CardHeader, CardBody, CardFooter), `Badge`, `Modal`, `Drawer`, `Sidebar`, `Header`, `Toast`, `Avatar`, `KpiCard`, `ProgressBar` (simples + stacked), `PageHeader`, `LoadingState` (skeleton, card, table), `EmptyState`, `ErrorState`, `Input`, `Select`, `Table`, `Tabs`, `Tooltip`
- `MainLayout` com sidebar + header + conteúdo
- Toast system (auto-dismiss 4s)
- Paleta Navy/Blue + Gold accent

---

### [X] Sprint 7 — Notificações

**Objetivo:** Sistema de notificações em tempo real para membros da organização.

**Entregas:**
- Backend:
  - Model `Notification` (userId, type, title, message, link, read, createdAt)
  - Relacionamento `User.notifications[]`
  - Helper `notifyOrganizationMembers()` — notifica todos da organização exceto o autor
  - Controller: `list`, `markRead`, `markAllRead`, `unreadCount`
  - Routes: `GET /api/notifications`, `PATCH /:id/read`, `POST /read-all`, `GET /unread-count`
  - Disparos em: `task.create`, `task.update`, `task.move`, `comment.create`, `team.addMember`
- Frontend:
  - `notificationStore` com consumo da API real via fetch()
  - `useNotificationPoll` — polling a cada 30s apenas quando autenticado
  - `NotificationsDropdown` no Header com ícones por tipo, link de navegação
  - Tipos: `task_created`, `task_updated`, `task_moved`, `comment_created`, `member_added`

---

### [X] Sprint 8 — Relatórios e Exportação PDF

**Objetivo:** Gerar relatórios gerenciais em PDF com visual profissional.

**Entregas:**
- Dependências: `jspdf@4.2.1`, `jspdf-autotable@5.0.8`
- `ReportExporter.ts` — Serviço de geração de PDF:
  - Capa com nome do sistema, título, data, responsável
  - KPIs: quadros, tarefas, % conclusão, membros (com barra de progresso)
  - Distribuição por prioridade e status (tabela + bolinhas coloridas)
  - Tabela de tarefas por responsável
  - Detalhamento completo com cores de prioridade/status
  - Análise automática em texto
  - Footer com número de páginas
- `ReportsPage` — botão "Exportar PDF" com loading/erro
- Correções aplicadas: encoding UTF-8, column widths, cores via `didParseCell`, paginação, remoção de redundâncias
- Redesign minimalista BI-style (paleta #1E40AF, layout 9.5mm margens)

---

### [X] Sprint 9 — Deploy e Migração para Nuvem

**Objetivo:** Publicar a aplicação em produção com banco PostgreSQL remoto.

**Entregas:**
- Configuração de conta Neon (PostgreSQL serverless)
- String de conexão com SSL obrigatório
- Ajustes no servidor para produção:
  - CORS dinâmico via `CORS_ORIGIN` env var
  - Servir frontend buildado via Express em produção (`express.static`)
  - Fallback SPA para rotas client-side (`app.get('*', ...)`)
  - Helmet com `contentSecurityPolicy: false` para assets Vite
  - Morgan em modo `combined` para produção
- Correções de 33 erros de build TypeScript:
  - `useBoards.ts`: `s.createBoard` → `s.addBoard`
  - `useTasks.ts`: `s.createTask` → `s.addTask`
  - `LoadingState`/`EmptyState`: adicionado `message` prop
  - `KpiCard.types.ts`: criado arquivo de tipos
  - `Modal`: guard `first`/`last` undefined
  - `Tooltip`: `useRef` com valor inicial
  - `ReportExporter.ts`: 20 erros (optional chaining, `getNumberOfPages`, unused vars, `as const`)
- `httpClient.ts`: `BASE_URL` agora com `import.meta.env.VITE_API_URL` + fallback local
- Scripts `build:server`, `build:all`, `start` no `package.json` raiz
- Variáveis de ambiente documentadas
- Deploy funcional em `https://ca3-planner-1.onrender.com`

---

## 4. Plano de Implementação — Próximas Sprints

### [X] Sprint 10 — Seed Automático e Startup Resiliente

**Objetivo:** Eliminar comandos manuais para popular o banco em produção.

**Entregas:**
- `server/src/db/seed.ts` — Função `seedDatabase(prisma)` que verifica se banco está vazio antes de popular com organização, admin, boards, tasks e teams
- `server/src/index.ts` — Seed automático executado no startup em produção via `startup()`, sem duplicação de dados
- `server/package.json` — Start script: `npx prisma db push && node dist/index.js`
- `package.json` (raiz) — Start script: `cd server && npx prisma db push && node dist/index.js`
- Backend e frontend compilados e validados (`tsc -b`, `vite build`, `server tsc`)

---

### [X] Sprint 11 — Documentação e Finalização de Deploy

**Objetivo:** Documentar o projeto e garantir deploy estável.

**Entregas:**
- `docs/DEPLOY.md` — Guia completo de deploy com pré-requisitos, configuração do Render, Neon, seed, troubleshooting
- `docs/API.md` — Atualizado com `VITE_API_URL`, `PATCH /auth/me/password`, seção de Notificações, health check corrigido
- `docs/ARCHITECTURE.md` — Atualizado com Neon/PostgreSQL, Notification model, `VITE_API_URL`, deploy section, design decisions revisadas
- Sprints 10 e 11 marcadas como `[X]` no PRD

---

### [X] Sprint 12 — Backlog de Melhorias Futuras

**Objetivo:** Catalogar funcionalidades sugeridas para versões futuras.

**Tarefas documentadas no backlog:**

| ID | Feature | Prioridade | Esforço |
|---|---|---|---|
| 12.1 | Upload de avatar do usuário | Média | 2 dias |
| 12.2 | Filtros e busca global | Alta | 3 dias |
| 12.3 | Calendário de tarefas | Média | 3 dias |
| 12.4 | Modo escuro | Baixa | 2 dias |
| 12.5 | Gerenciamento de organização | Alta | 5 dias |
| 12.6 | Testes automatizados | Alta | 5 dias |
| 12.7 | Responsividade mobile avançada | Média | 4 dias |
| 12.8 | Performance | Média | 3 dias |

**Detalhamento:**

**12.1** Upload de avatar do usuário
- Endpoint `PATCH /auth/me/avatar` com upload Multer
- Preview no componente Avatar e sidebar

**12.2** Filtros e busca global
- Barra de busca no Header pesquisando boards e tarefas
- Filtros por prioridade, status, responsável, data

**12.3** Calendário de tarefas
- `CalendarPage` já existe (esqueleto)
- Integrar tarefas com datas (react-calendar ou similar)

**12.4** Modo escuro
- Toggle no Settings (claro/escuro)
- Conjunto de tokens CSS para tema escuro

**12.5** Gerenciamento de organização
- Múltiplas organizações com admin global
- Convite de membros por email

**12.6** Testes automatizados
- Vitest para frontend (testes de componente + hook)
- Supertest + Jest para backend (testes de endpoint)
- CI no GitHub Actions

**12.7** Responsividade mobile avançada
- Sidebar como drawer em mobile
- Kanban adaptável para touch
- Cards e tabelas responsivos

**12.8** Performance
- Code-splitting adicional por rota
- Lazy loading de componentes pesados (jsPDF, html2canvas)
- Otimização de queries Prisma (select específico, include)

---

## 5. Arquitetura

```
┌──────────────────────────────────────────────────────┐
│                    Frontend (SPA)                     │
│  React 19 · TypeScript 6 · Vite 8 · Tailwind v4     │
│  Zustand 5 · React Router 7 · Axios · Lucide         │
├──────────────────────────────────────────────────────┤
│               HTTP (Axios) · /api/*                  │
├──────────────────────────────────────────────────────┤
│                    Backend (API)                      │
│  Express 4 · TypeScript · Prisma 5 · JWT · Multer    │
├──────────────────────────────────────────────────────┤
│              PostgreSQL (Neon) · Uploads              │
└──────────────────────────────────────────────────────┘
```

### Frontend — Camadas

```
src/
├── app/           → App, Router, guards
├── core/          → httpClient, erros, storage
├── shared/        → Componentes, layouts, estilos
├── modules/       → Páginas por funcionalidade
├── stores/        → Estado global (Zustand)
├── services/      → Chamadas de API
├── hooks/         → Lógica reutilizável
└── types/         → Tipos TypeScript
```

### Backend — Camadas

```
server/
├── src/
│   ├── index.ts           → Express app setup
│   ├── db/seed.ts         → Seed automático (Sprint 10)
│   ├── seed.ts            → Seed manual legado
│   ├── routes/            → Definições de rotas
│   ├── controllers/       → Lógica dos endpoints
│   ├── middleware/         → Auth (JWT), error-handler
│   └── lib/
│       ├── prisma.ts      → PrismaClient singleton
│       └── notify.ts      → Helper de notificações
└── prisma/
    └── schema.prisma      → Modelo de dados
```

---

## 6. Modelo de Dados

```prisma
Organization  1──N User
User          1──N Board
User          1──N Notification
Board         1──N Task
Task          1──N Comment
Task          1──N Attachment
Task          1──N ChecklistItem
Team          1──N TeamMember
```

### Entidades

| Entidade | Campos principais |
|---|---|
| **User** | id, name, email (unique), password (bcrypt), role, avatar, organizationId |
| **Organization** | id, name |
| **Board** | id, title, description, color, userId (FK), organizationId (FK) |
| **Task** | id, boardId (FK), title, description, status (enum), priority (enum), assignee, dueDate, position |
| **Comment** | id, taskId (FK), userId (FK), content |
| **ChecklistItem** | id, taskId (FK), text, checked |
| **Attachment** | id, taskId (FK), userId (FK), name, size, type, url |
| **Team** | id, name, description, organizationId (FK) |
| **TeamMember** | id, teamId (FK), name, email, role |
| **Notification** | id, userId (FK), type (enum), title, message, link, read, createdAt |

---

## 7. Rotas da Aplicação

### Frontend

| Rota | Página | Acesso |
|---|---|---|
| `/login` | LoginPage | Público |
| `/register` | RegisterPage | Público |
| `/` | Redirect → /dashboard | Privado |
| `/dashboard` | DashboardPage | Privado |
| `/boards` | BoardsPage | Privado |
| `/boards/:id` | BoardDetailsPage | Privado |
| `/calendar` | CalendarPage | Privado |
| `/teams` | TeamsPage | Privado |
| `/reports` | ReportsPage | Privado |
| `/settings` | SettingsPage | Privado |
| `*` | NotFoundPage | Privado |

### Backend (API)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cadastro |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Dados do usuário |
| PATCH | `/api/auth/me/password` | Alterar senha |
| GET | `/api/boards` | Listar boards |
| POST | `/api/boards` | Criar board |
| GET | `/api/boards/:id` | Board + tarefas |
| PUT | `/api/boards/:id` | Atualizar board |
| DELETE | `/api/boards/:id` | Excluir board |
| GET | `/api/tasks` | Listar tarefas |
| GET | `/api/tasks/board/:boardId` | Tarefas de um board |
| POST | `/api/tasks` | Criar tarefa |
| PUT | `/api/tasks/:id` | Atualizar tarefa |
| PATCH | `/api/tasks/:id/move` | Mover tarefa |
| DELETE | `/api/tasks/:id` | Excluir tarefa |
| GET | `/api/teams` | Listar equipes |
| POST | `/api/teams` | Criar equipe |
| PUT | `/api/teams/:id` | Atualizar equipe |
| DELETE | `/api/teams/:id` | Excluir equipe |
| POST | `/api/teams/:id/members` | Adicionar membro |
| DELETE | `/api/teams/:id/members/:memberId` | Remover membro |
| GET | `/api/comments/task/:taskId` | Listar comentários |
| POST | `/api/comments` | Criar comentário |
| GET | `/api/checklist/task/:taskId` | Listar checklist |
| POST | `/api/checklist` | Criar item |
| PATCH | `/api/checklist/:id/toggle` | Alternar item |
| DELETE | `/api/checklist/:id` | Remover item |
| GET | `/api/attachments/task/:taskId` | Listar anexos |
| POST | `/api/attachments/upload` | Upload anexo |
| DELETE | `/api/attachments/:id` | Remover anexo |
| GET | `/api/notifications` | Listar notificações |
| PATCH | `/api/notifications/:id/read` | Marcar lida |
| POST | `/api/notifications/read-all` | Marcar todas lidas |
| GET | `/api/notifications/unread-count` | Contagem não lidas |
| GET | `/api/health` | Health check |

---

## 8. Variáveis de Ambiente

### Server (`server/`)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `PORT` | Não (default 3001) | Porta do servidor |
| `DATABASE_URL` | Sim | URL de conexão PostgreSQL (Neon) |
| `JWT_SECRET` | Sim | Chave secreta para assinar tokens JWT |
| `JWT_EXPIRES_IN` | Não (default 7d) | Tempo de expiração do token |
| `CORS_ORIGIN` | Sim (produção) | URL do frontend para CORS |
| `NODE_ENV` | Sim (produção) | `production` ou `development` |
| `CLOUDINARY_CLOUD_NAME` | Não | Cloud name para upload de arquivos |
| `CLOUDINARY_API_KEY` | Não | API key Cloudinary |
| `CLOUDINARY_API_SECRET` | Não | API secret Cloudinary |

### Frontend (build-time)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_API_URL` | Sim (produção) | URL base da API (`/api` no Render) |

### Render

| Parâmetro | Valor |
|---|---|
| Build Command | `npm install --include=dev && npm run build && cd server && npm install --include=dev && npm run build && npx prisma generate` |
| Start Command | `npm start` |
| Node Version | 24.x (padrão) |
| Health Check Path | `/api/health` |
