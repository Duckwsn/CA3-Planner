# API Reference — CA3 Planner

Base URL (desenvolvimento): `http://localhost:3001/api`
Base URL (produção): `{same-origin}/api` — configurado via `VITE_API_URL=/api`

Autenticação via `Authorization: Bearer <token>` (exceto login/register).

---

## Índice

- [Autenticação](#autenticação)
- [Boards](#boards)
- [Tarefas](#tarefas)
- [Equipes](#equipes)
- [Comentários](#comentários)
- [Checklist](#checklist)
- [Anexos](#anexos)
- [Notificações](#notificações)
- [Health Check](#health-check)

---

## Autenticação

### `POST /auth/login`

Autenticar usuário e obter token JWT.

**Request:**
```json
{
  "email": "admin@escola.edu",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "Admin",
    "email": "admin@escola.edu",
    "role": "Administrador",
    "avatar": ""
  }
}
```

**Response (401):**
```json
{ "error": "Email ou senha inválidos" }
```

### `POST /auth/register`

**Request:**
```json
{
  "name": "Novo Usuário",
  "email": "novo@escola.edu",
  "password": "senha123"
}
```

**Response (201):** Mesmo formato do login.

### `GET /auth/me`

Retorna dados do usuário autenticado.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Admin",
  "email": "admin@escola.edu",
  "role": "Administrador",
  "avatar": ""
}
```

### `PATCH /auth/me/password`

Alterar a senha do usuário autenticado.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "senhaAtual": "123456",
  "novaSenha": "novaSenha123"
}
```

**Response (200):**
```json
{
  "mensagem": "Senha atualizada com sucesso"
}
```

**Response (401):**
```json
{
  "erro": "Senha atual incorreta"
}
```

---

## Boards

### `GET /boards`

Listar todos os boards do usuário.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "Matemática 3º Ano",
    "description": "Planejamento de aulas",
    "color": "#2563eb",
    "userId": "uuid",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "_count": { "tasks": 12 }
  }
]
```

### `POST /boards`

Criar novo board.

**Request:**
```json
{
  "title": "Novo Board",
  "description": "Descrição opcional",
  "color": "#2563eb"
}
```

**Response (201):** Objeto board criado.

### `GET /boards/:id`

Retorna board + tarefas com comentários, checklist e anexos.

**Response (200):**
```json
{
  "id": "uuid",
  "title": "Matemática 3º Ano",
  "description": "...",
  "color": "#2563eb",
  "tasks": [
    {
      "id": "uuid",
      "title": "Prova bimestral",
      "description": "...",
      "status": "doing",
      "priority": "high",
      "assignee": "Prof. Carlos",
      "dueDate": "2025-06-15",
      "createdAt": "...",
      "updatedAt": "...",
      "_count": { "comments": 3, "attachments": 1, "checklist": 5 }
    }
  ]
}
```

### `PUT /boards/:id`

Atualizar board.

**Request:** `{ "title"?: string, "description"?: string, "color"?: string }`

### `DELETE /boards/:id`

Excluir board e todas as tarefas associadas.

---

## Tarefas

### `GET /tasks`

Listar todas as tarefas de todos os boards do usuário.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "boardId": "uuid",
    "title": "Corrigir provas",
    "status": "doing",
    "priority": "high",
    "assignee": "Prof. Ana",
    "dueDate": "2025-06-20",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### `GET /tasks/board/:boardId`

Listar tarefas de um board específico.

### `POST /tasks`

Criar tarefa.

**Request:**
```json
{
  "boardId": "uuid",
  "title": "Nova tarefa",
  "description": "Detalhes",
  "status": "todo",
  "priority": "medium",
  "assignee": "Prof. Carlos",
  "dueDate": "2025-06-30"
}
```

**Response (201):** Objeto tarefa criado.

### `PUT /tasks/:id`

Atualizar tarefa. Mesmos campos do create.

### `PATCH /tasks/:id/move`

Mover tarefa entre colunas (drag-and-drop).

**Request:**
```json
{
  "status": "doing",
  "position": 2
}
```

**Response (200):** Tarefa atualizada.

### `DELETE /tasks/:id`

Excluir tarefa e seus relacionamentos (comentários, checklist, anexos).

---

## Equipes

### `GET /teams`

Listar todas as equipes com membros.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Professores de Matemática",
    "description": "Equipe do ensino médio",
    "members": [
      { "id": "uuid", "name": "Carlos", "email": "carlos@escola.edu", "role": "Professor" }
    ],
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### `POST /teams`

Criar equipe.

**Request:** `{ "name": "string", "description": "string" }`

### `PUT /teams/:id`

Atualizar equipe.

### `DELETE /teams/:id`

Excluir equipe e seus membros.

### `POST /teams/:id/members`

Adicionar membro.

**Request:** `{ "name": "string", "email": "string", "role": "string" }`

**Response (201):** Equipe atualizada com novo membro.

### `DELETE /teams/:id/members/:memberId`

Remover membro.

---

## Comentários

### `GET /comments/task/:taskId`

Listar comentários de uma tarefa.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "taskId": "uuid",
    "userId": "uuid",
    "content": "Texto do comentário",
    "createdAt": "...",
    "user": { "id": "uuid", "name": "Admin", "avatar": "" }
  }
]
```

### `POST /comments`

Criar comentário.

**Request:** `{ "taskId": "uuid", "content": "Texto do comentário" }`

**Response (201):** Comentário com dados do usuário.

---

## Checklist

### `GET /checklist/task/:taskId`

Listar itens do checklist de uma tarefa.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "taskId": "uuid",
    "text": "Preparar slides",
    "checked": false,
    "createdAt": "..."
  }
]
```

### `POST /checklist`

Criar item.

**Request:** `{ "taskId": "uuid", "text": "Preparar slides" }`

**Response (201):** Item criado.

### `PATCH /checklist/:id/toggle`

Alternar checked/unchecked.

**Response (200):** Item atualizado.

### `DELETE /checklist/:id`

Remover item.

---

## Anexos

### `GET /attachments/task/:taskId`

Listar anexos de uma tarefa.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "taskId": "uuid",
    "name": "plano_aula.pdf",
    "size": 204800,
    "type": "application/pdf",
    "url": "/uploads/plano_aula.pdf",
    "createdAt": "..."
  }
]
```

### `POST /attachments/upload`

Upload de arquivo (multipart/form-data).

**Request:** `file` (campo multipart) + `taskId` (campo texto)

**Response (201):** Objeto attachment criado.

### `DELETE /attachments/:id`

Remover anexo (arquivo + registro).

---

## Notificações

Requere token JWT no header `Authorization: Bearer <token>`.

### `GET /notifications`

Lista as notificações do usuário autenticado, ordenadas da mais recente para a mais antiga.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "type": "task_created",
    "title": "Nova tarefa",
    "message": "Uma nova tarefa foi atribuída a você",
    "link": "/boards/board-id",
    "read": false,
    "createdAt": "2025-07-08T12:00:00.000Z"
  }
]
```

**Tipos de notificação:**
| Type | Descrição |
|---|---|
| `task_created` | Tarefa criada no board |
| `task_updated` | Tarefa atualizada |
| `task_moved` | Tarefa movida entre colunas |
| `comment_created` | Novo comentário em uma tarefa |
| `member_added` | Membro adicionado a uma equipe |

### `GET /notifications/unread-count`

Retorna a quantidade de notificações não lidas.

**Response (200):**
```json
{
  "count": 3
}
```

### `PATCH /notifications/:id/read`

Marca uma notificação como lida.

**Response (200):**
```json
{
  "message": "Notificação marcada como lida"
}
```

### `POST /notifications/read-all`

Marca **todas** as notificações do usuário como lidas.

**Response (200):**
```json
{
  "count": 5,
  "message": "Notificações marcadas como lidas"
}
```

---

## Health Check

### `GET /api/health`

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-07-08T12:00:00.000Z"
}
```

---

## Códigos de erro

| Código | Significado |
|---|---|
| 400 | Dados inválidos ou requisição mal formatada |
| 401 | Token ausente, expirado ou inválido |
| 404 | Recurso não encontrado |
| 500 | Erro interno do servidor |

**Formato de erro:**
```json
{ "error": "Mensagem descritiva" }
```
