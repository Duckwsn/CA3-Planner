# Arquitetura — CA3 Planner

## Visão geral

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

---

## Frontend

### Camadas

```
src/
├── app/           → Configuração raiz (App, Router)
├── core/          → Infraestrutura (HTTP, erros, storage)
├── shared/        → Reutilizável (componentes, layouts, estilos)
├── modules/       → Páginas por funcionalidade
├── stores/        → Estado global (Zustand)
├── services/      → Chamadas de API
├── hooks/         → Lógica reutilizável
└── types/         → Tipos TypeScript
```

### Fluxo de dados

```
Página (componente)
  │
  ├── Hook (useBoards, useTasks, etc.)
  │     └── Store (Zustand + persist)
  │           └── Service (BoardService, TaskService, etc.)
  │                 └── httpClient (Axios)
  │                       └── API REST (Express)
  │
  └── Componentes compartilhados (Button, Card, Modal, etc.)
        └── tokens.css (design system)
```

### Stores (Zustand)

Todas as stores usam `create()` do Zustand v5. Stores de domínio usam `persist` middleware para localStorage.

**Stores core:**
- `authStore` — Token, usuário logado, login/logout
- `uiStore` — Sidebar, modais, toasts, tema
- `permissionStore` — Permissões baseadas em papel

**Stores de domínio:**
- `boardStore` — CRUD de boards
- `taskStore` — CRUD de tarefas + listAll
- `teamStore` — CRUD de equipes + membros
- `commentStore` — Comentários por tarefa
- `checklistStore` — Itens de checklist
- `attachmentStore` — Anexos
- `notificationStore` — Notificações
- `userStore` — Dados do usuário

Cada store expõe selectores individuais para evitar re-renderizações desnecessárias:

```typescript
const tasks = useTaskStore((s) => s.tasks)
const loading = useTaskStore((s) => s.loading)
const loadAllTasks = useTaskStore((s) => s.loadAllTasks)
```

### HttpClient (`src/core/api/httpClient.ts`)

Axios instance configurada com:
- `baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api'`
- Em produção: `VITE_API_URL=/api` (mesmo domínio do servidor)
- Em desenvolvimento: `http://localhost:3001/api`
- Interceptor de request: injeta token JWT do localStorage
- Interceptor de response: redireciona para `/login` em 401
- Helpers: `apiGet`, `apiPost`, `apiPut`, `apiPatch`, `apiDelete`

### Rotas (`src/app/routes.tsx`)

Todas as páginas são lazy-loaded com `React.lazy()` e `Suspense`:

```
/login            → LoginPage          (pública)
/                 → redirect /dashboard (privada)
/dashboard        → DashboardPage       (privada)
/boards           → BoardsPage          (privada)
/boards/:id       → BoardDetailsPage    (privada)
/calendar         → CalendarPage        (privada)
/teams            → TeamsPage           (privada)
/reports          → ReportsPage         (privada)
/settings         → SettingsPage        (privada)
*                 → NotFoundPage        (privada)
```

O guard `PrivateGuard` verifica `isAuthenticated` da `authStore` e redireciona para `/login` se não autenticado.

---

## Backend

### Camadas

```
server/
├── src/
│   ├── index.ts           → Express app setup + seed automático
│   ├── db/seed.ts         → Seed automático (popula banco se vazio)
│   ├── seed.ts            → Seed manual legado
│   ├── routes/            → Definições de rotas
│   ├── controllers/       → Lógica dos endpoints
│   ├── middleware/         → auth (JWT), error-handler
│   └── lib/
│       ├── prisma.ts      → PrismaClient singleton
│       └── notify.ts      → Helper de notificações
│
└── prisma/
    └── schema.prisma      → Modelo de dados
```

### Middleware de autenticação

Extração do token JWT do header `Authorization: Bearer <token>` e verificação com `jsonwebtoken`. O `req.userId` fica disponível nos controllers.

### Error Handler

`middleware/error-handler.ts` captura erros e retorna:
```json
{ "error": "Mensagem descritiva" }
```

Com status code apropriado (400, 401, 404, 500).

---

## Modelo de dados

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

**Organization:** id, name
**User:** id, name, email (unique), password (bcrypt), role, avatar, organizationId (FK)
**Board:** id, title, description, color, userId (FK), organizationId (FK)
**Task:** id, boardId (FK), title, description, status (enum), priority (enum), assignee, dueDate, position
**Team:** id, name, description, organizationId (FK)
**TeamMember:** id, teamId (FK), name, email, role
**ChecklistItem:** id, taskId (FK), text, checked
**Comment:** id, taskId (FK), userId (FK), content
**Attachment:** id, taskId (FK), userId (FK), name, size, type, url
**Notification:** id, userId (FK), type (enum), title, message, link, read, createdAt

---

## Design decisions

### Por que Zustand e não Redux?

- Menos boilerplate
- Suporte nativo a TypeScript
- `persist` middleware para localStorage
- Selectores individuais evitam re-renderizações
- API simples e intuitiva

### Por que PostgreSQL (Neon)?

- Banco relacional completo (relacionamentos, enums, constraints)
- Serverless — sem necessidade de gerenciar servidor
- Plano gratuito generoso (10GB, 100 conexões simultâneas)
- SSL obrigatório — seguro por padrão
- Totalmente compatível com Prisma ORM
- Migração simples do SQLite para PostgreSQL via `prisma db push`

### Por que Tailwind v4?

- Bundle menor (purge nativo)
- Performance melhor (JIT engine)
- `@theme` block para integrar com design system via CSS custom properties
- Zero runtime CSS-in-JS

### Por que @hello-pangea/dnd?

- Fork mantido do react-beautiful-dnd
- Suporte a React 18+
- API idêntica e familiar
- Manutenção ativa

---

## Deploy

A aplicação é implantada como um único **Web Service** no Render. O servidor Express serve tanto a API quanto os arquivos estáticos do frontend (em produção).

### Fluxo de build

1. `npm install --include=dev` — dependências do frontend
2. `npm run build` — compila frontend (`tsc -b && vite build`) → `dist/`
3. `cd server && npm install --include=dev` — dependências do backend
4. `npm run build` — compila backend (`tsc`) → `server/dist/`
5. `npx prisma generate` — gera Prisma Client

### Fluxo de start

1. `npx prisma db push` — sincroniza schema no PostgreSQL (Neon)
2. `node server/dist/index.js` — inicia Express na porta `$PORT`

### Seed automático

Na primeira execução em produção, o servidor verifica se o banco está vazio e popula automaticamente com:
- Organização **CA3 Educ**
- Usuário **admin@escola.edu** / **123456**
- Boards, tarefas e equipes de demonstração

### Variáveis de ambiente essenciais

| Variável | Valor (exemplo) |
|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET` | `745296` |
| `CORS_ORIGIN` | `https://ca3-planner.onrender.com` |
| `NODE_ENV` | `production` |
| `VITE_API_URL` | `/api` |

Consulte `docs/DEPLOY.md` para o guia completo de implantação.
