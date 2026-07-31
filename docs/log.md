# Log de Atualizações

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
- Ao retornar, a tarefa mantém status "Concluído" e ganha uma nova janela de 15 dias antes de voltar a ser arquivada automaticamente.
