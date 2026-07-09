# Arquitetura — CA3 Planner

## Visão geral

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (SPA)                    │
│  React 19 · TypeScript 6 · Vite 8 · Tailwind v4    │
│  Zustand 5 · React Router 7 · Axios · Lucide        │
├─────────────────────────────────────────────────────┤
│               HTTP (Axios) · localhost:3001          │
├─────────────────────────────────────────────────────┤
│                    Backend (API)                     │
│  Express 4 · TypeScript · Prisma 5 · JWT · Multer   │
├─────────────────────────────────────────────────────┤
│              SQLite (dev.db) · Uploads               │
└─────────────────────────────────────────────────────┘
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
- `baseURL: http://localhost:3001/api`
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
│   ├── index.ts           → Express app setup
│   ├── seed.ts            → Dados de demonstração
│   ├── routes/            → Definições de rotas
│   ├── controllers/       → Lógica dos endpoints
│   ├── middleware/         → auth (JWT), error-handler
│   └── lib/
│       └── prisma.ts      → PrismaClient singleton
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
User      1──N Board
Board     1──N Task
Task      1──N Comment
Task      1──N Attachment
Task      1──N ChecklistItem
Team      1──N TeamMember
```

**User:** id, name, email (unique), password (bcrypt), role, avatar
**Board:** id, title, description, color, userId (FK)
**Task:** id, boardId (FK), title, description, status, priority, assignee, dueDate
**Team:** id, name, description
**TeamMember:** id, teamId (FK), name, email, role
**ChecklistItem:** id, taskId (FK), text, checked
**Comment:** id, taskId (FK), userId (FK), content
**Attachment:** id, taskId (FK), userId (FK), name, size, type, url

---

## Design decisions

### Por que Zustand e não Redux?

- Menos boilerplate
- Suporte nativo a TypeScript
- `persist` middleware para localStorage
- Selectores individuais evitam re-renderizações
- API simples e intuitiva

### Por que SQLite?

- Zero configuração para desenvolvimento
- Arquivo único (`dev.db`)
- Fácil versionamento e reset
- Prisma abstrai a complexidade

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
