# Log de Atualizações

## 2026-07-31 — Equipes integradas a contas reais + proteção de quadros

### Adicionado
- Endpoint `GET /users`: lista as contas da organização (id, nome, email, cargo) para seleção de membros.
- Relação `TeamMember.userId` → `User`: membros de equipe agora referenciam contas reais cadastradas.
- Tela de Equipes: "Adicionar Membro" passou a usar seletor de contas reais (nome · email), em vez de campos de texto livre.

### Alterado
- `addMember` (`POST /teams/:id/members`) agora exige `userId` de uma conta da organização e preenche nome/email/cargo a partir dela.
- `listAssignableMembers` passou a retornar apenas contas reais — nomes de membros sem conta não aparecem mais como responsável em tarefas.
- `Board.userId` tornou-se opcional com `onDelete: SetNull` — excluir uma conta não apaga mais os quadros dela (evita perda de dados ao remover contas placeholder no banco).

### Arquivos alterados
- server/prisma/schema.prisma
- server/src/controllers/user-controller.ts (novo)
- server/src/routes/users.ts (novo)
- server/src/index.ts
- server/src/controllers/team-controller.ts
- src/services/TeamService.ts
- src/stores/domain/teamStore.ts
- src/modules/teams/TeamsPage.tsx
- src/types/team.types.ts
- src/types/board.types.ts

### Observações
- Membros antigos sem conta (ex.: dados do seed) permanecem visíveis nas equipes, mas não são mais exibidos como responsável.
- Mudança de schema aplicada via `prisma db push` no deploy.

---

## 2026-07-31 — Correção: kanban não atualizava ao arquivar + `listAll` ignorava arquivadas

### Corrigido
- `archiveTask` no `taskStore.ts` passou a **remover** a tarefa do estado ao arquivar (antes mantinha a tarefa com `archived: true` no array, fazendo o kanban continuar exibindo-a até recarregar a página).
- Filtro defensivo `!archived` em `boardTasks` no `BoardDetailsPage.tsx` (protege contra estado obsoleto persistido no localStorage).
- `listAll` (`GET /tasks`) passou a excluir tarefas arquivadas — Dashboard, Relatórios e Calendário não contam mais tarefas arquivadas.

### Arquivos alterados
- src/stores/domain/taskStore.ts
- src/modules/board-details/BoardDetailsPage.tsx
- server/src/controllers/task-controller.ts

---

## 2026-07-31 — Arquivamento de Tarefas: retorno + exclusão permanente

### Adicionado
- Endpoint `PATCH /tasks/:id/unarchive` para retornar uma tarefa arquivada.
- Método `TaskService.unarchive()` no frontend.
- Modal de detalhes na tela de Tarefas Arquivadas (`ArchivedTasksPage.tsx`), aberto ao clicar em uma tarefa, com botões "Retornar tarefa" e "Excluir permanentemente" (com confirmação).
- Job agendado `purge-archived-tasks.ts`: exclui permanentemente tarefas arquivadas há mais de 30 dias.

### Arquivos alterados
- server/src/controllers/task-controller.ts
- server/src/routes/tasks.ts
- server/src/jobs/purge-archived-tasks.ts (novo)
- server/src/index.ts
- src/services/TaskService.ts
- src/modules/archived-tasks/ArchivedTasksPage.tsx

### Observações
- Ao retornar, a tarefa mantém status "Concluído" e ganha uma nova janela (conforme o prazo configurado no job de arquivamento) antes de voltar a ser arquivada automaticamente.
