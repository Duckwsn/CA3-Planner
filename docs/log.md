# Log de Atualizações

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
