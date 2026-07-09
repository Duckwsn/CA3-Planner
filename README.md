# CA3 Planner

Sistema web de gerenciamento pedagógico com quadro Kanban, calendário, equipes e relatórios.

**Stack:** React 19 · TypeScript 6 · Vite 8 · Tailwind CSS v4 · Zustand 5 · React Router 7 · Express 4 · Prisma 5 · SQLite

---

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Setup rápido](#setup-rápido)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Design System](#design-system)
- [API](#api)
- [Comandos úteis](#comandos-úteis)
- [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

- Node.js 20+
- npm 10+

## Setup rápido

```bash
# 1. Instalar dependências do frontend
npm install

# 2. Instalar dependências do backend
cd server
npm install
cd ..

# 3. Configurar variáveis de ambiente
copy server\.env.example server\.env
```

Edite `server/.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua-chave-secreta-aqui"
PORT=3001
```

```bash
# 4. Inicializar banco de dados e seed
cd server
npx prisma generate
npx prisma db push
npx tsx src/seed.ts
cd ..

# 5. Iniciar backend (terminal 1)
cd server
npm run dev

# 6. Iniciar frontend (terminal 2)
npm run dev
```

Acessar: [http://localhost:5173](http://localhost:5173)

**Credenciais de demonstração:**
- Email: `admin@escola.edu`
- Senha: `123456`

---

## Estrutura do projeto

```
planner/
├── src/                          # Frontend (React + Vite)
│   ├── app/                      # App root, rotas
│   ├── core/                     # Core: httpClient, errors, storage
│   ├── hooks/                    # Custom hooks reutilizáveis
│   ├── modules/                  # Páginas por funcionalidade
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── boards/
│   │   ├── board-details/        # Kanban drag-and-drop
│   │   ├── calendar/
│   │   ├── teams/
│   │   ├── reports/
│   │   ├── settings/
│   │   └── not-found/
│   ├── services/                 # Serviços de API
│   ├── shared/
│   │   ├── components/           # 30+ componentes reutilizáveis
│   │   ├── layouts/              # MainLayout (sidebar + header)
│   │   └── styles/               # tokens.css (design system)
│   ├── stores/
│   │   ├── core/                 # Stores globais (auth, ui)
│   │   └── domain/               # Stores de domínio (board, task, team...)
│   └── types/                    # Tipos TypeScript
│
├── server/                       # Backend (Express + Prisma + SQLite)
│   ├── prisma/
│   │   ├── schema.prisma         # Modelo de dados
│   │   └── dev.db                # Banco SQLite
│   └── src/
│       ├── index.ts              # Entry point
│       ├── seed.ts               # Dados iniciais
│       ├── controllers/
│       ├── routes/
│       ├── middleware/            # JWT auth, error handler
│       └── lib/                  # Prisma client
│
├── docs/                         # Documentação
├── public/
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Arquitetura

### Frontend (SPA)

```
BrowserRouter
└── ErrorBoundary
    ├── /login → LoginPage (sem layout)
    └── PrivateGuard
        └── AppLayout
            ├── Sidebar (navegação)
            ├── Header (busca, notificações, usuário)
            └── <Outlet />
                ├── /dashboard   → DashboardPage
                ├── /boards      → BoardsPage
                ├── /boards/:id  → BoardDetailsPage (Kanban)
                ├── /calendar    → CalendarPage
                ├── /teams       → TeamsPage
                ├── /reports     → ReportsPage
                ├── /settings    → SettingsPage
                └── *            → NotFoundPage
```

**Fluxo de dados:** Componentes → Hooks → Stores (Zustand) → Services → HttpClient (Axios) → API REST

### Backend (Express + Prisma)

```
Express Router
└── /api
    ├── /auth          → login, register, me
    ├── /boards        → CRUD boards
    ├── /tasks         → CRUD tasks + listAll
    ├── /teams         → CRUD teams + members
    ├── /comments      → CRUD comments
    ├── /checklist     → CRUD checklist items
    ├── /attachments   → upload/download attachments
    └── /health        → health check
```

### Modelo de dados

```
User (1)──→ Board (N)──→ Task (N)──→ Comment (N)
                              ├──→ ChecklistItem (N)
                              └──→ Attachment (N)

Team (1)──→ TeamMember (N)
```

---

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Autenticação JWT** | Login/registro com token persistido em localStorage |
| **Quadros Kanban** | CRUD de boards, drag-and-drop entre 4 colunas (A Fazer, Fazendo, Revisão, Concluído) |
| **Tarefas** | CRUD completo, prioridade (Baixa/Média/Alta/Urgente), responsável, data de entrega |
| **Detalhe da tarefa** | Drawer lateral com comentários, checklist e anexos |
| **Calendário** | Visão mensal com tarefas por dia, indicadores visuais |
| **Equipes** | CRUD de equipes, gerenciamento de membros |
| **Dashboard** | KPIs (quadros, tarefas, conclusão, atrasos), gráficos de progresso |
| **Relatórios** | Distribuição por prioridade/status/responsável, barras empilhadas |
| **Notificações** | Toast de feedback + dropdown de notificações |
| **Design responsivo** | Sidebar colapsável, grid adaptável |
| **Tema consistente** | Design system completo com CSS custom properties |

---

## Design System

O design system está definido em `src/shared/styles/tokens.css` como CSS custom properties.

### Cores

| Token | Valor | Uso |
|---|---|---|
| `--color-sidebar-bg` | `#1B2452` | Fundo da sidebar |
| `--color-sidebar-item-active-bg` | `#F5A623` | Item ativo na sidebar |
| `--color-bg-page` | `#F7F8FC` | Fundo da página |
| `--color-primary-500` | `#4B6CC4` | Ações primárias |
| `--color-gold-500` | `#ECB646` | Acento secundário |
| `--color-success-500` | `#22C55E` | Sucesso |
| `--color-warning-500` | `#F59E0B` | Atenção |
| `--color-danger-500` | `#EF4444` | Erro/perigo |

### Tipografia

- **Fonte primária:** Inter (sans-serif)
- **Fonte secundária:** Poppins
- **Escala:** `display-large` (64px) → `caption` (12px), cada um com line-height

### Componentes

30+ componentes compartilhados em `src/shared/components/`:

| Componente | Descrição |
|---|---|
| `Button` | Variantes primary/secondary/ghost/danger/success, sizes sm/md/lg, loading |
| `Card` | Container com padding, hover, border configuráveis |
| `Modal` | Overlay com backdrop blur, foco preso, fechar com Escape |
| `Drawer` | Painel lateral deslizante com backdrop |
| `Badge` | Variantes default/success/warning/danger/info/urgent/high/medium |
| `KpiCard` | Card de métrica com ícone, valor e variação |
| `KanbanCard` | Card de tarefa arrastável com badge de prioridade |
| `KanbanColumn` | Coluna soltável com contagem e botão adicionar |
| `ProgressBar` | Barra de progresso simples e empilhada |
| `Avatar` | Avatares com iniciais e cores por hash |
| `Sidebar` | Navegação colapsável com logo, links e área do usuário |
| `Header` | Topo com busca, notificações e menu do usuário |
| `Toast` | Notificações auto-dismissíveis (4s) |
| `Table` | Tabela ordenável com estados vazio/carregando |
| `Input` | Input com label, erro e texto de apoio |
| `Select` | Select estilizado nativo |
| `Tabs` | Navegação por abas |
| `Pagination` | Paginação de resultados |

---

## API

### Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/register` | Registro |
| `GET` | `/api/auth/me` | Dados do usuário logado |
| `GET` | `/api/boards` | Listar boards |
| `POST` | `/api/boards` | Criar board |
| `GET` | `/api/boards/:id` | Board por ID |
| `PUT` | `/api/boards/:id` | Atualizar board |
| `DELETE` | `/api/boards/:id` | Excluir board |
| `GET` | `/api/tasks` | Listar todas as tarefas |
| `GET` | `/api/tasks/board/:boardId` | Tarefas de um board |
| `POST` | `/api/tasks` | Criar tarefa |
| `PUT` | `/api/tasks/:id` | Atualizar tarefa |
| `PATCH` | `/api/tasks/:id/move` | Mover tarefa (coluna) |
| `DELETE` | `/api/tasks/:id` | Excluir tarefa |
| `GET` | `/api/teams` | Listar equipes |
| `POST` | `/api/teams` | Criar equipe |
| `GET` | `/api/comments/task/:taskId` | Comentários de uma tarefa |
| `GET` | `/api/checklist/task/:taskId` | Checklist de uma tarefa |
| `GET` | `/api/attachments/task/:taskId` | Anexos de uma tarefa |

Documentação completa em [docs/API.md](docs/API.md).

---

## Comandos úteis

```bash
# Frontend
npm run dev          # Servidor de desenvolvimento (Vite)
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Oxlint

# Backend
cd server
npm run dev          # Servidor com hot-reload (tsx watch)
npm run build        # Compilar TypeScript
npm start            # Iniciar produção
npx prisma studio    # Interface do banco
npx prisma db push   # Sincronizar schema
npx tsx src/seed.ts  # Popular dados iniciais
```

---

## Troubleshooting

### Banco não encontrado
```bash
cd server
npx prisma generate
npx prisma db push
```

### Erro de token inválido
Limpar localStorage no navegador e fazer login novamente.

### Porta ocupada
O backend usa 3001, frontend usa 5173. Verificar se as portas estão livres.

### Dependências desatualizadas
```bash
npm install
cd server && npm install
```

---

## Licença

Projeto interno - CA3 Educação
