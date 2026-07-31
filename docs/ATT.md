# Plano de Atualização — Arquivamento de Tarefas (Retorno + Exclusão Permanente)

**Sistema:** CA3 Planner (frontend React + TS + Vite + Tailwind + Zustand; backend Express + Prisma + PostgreSQL)
**Contexto:** o arquivamento automático de tarefas concluídas (item 3 do plano de atualização anterior) já está implementado — schema, job agendado (`server/src/jobs/archive-completed-tasks.ts`), endpoint `PATCH /tasks/:id/archive`, `GET /tasks/archived` e a tela `ArchivedTasksPage.tsx` já existem no código enviado.
**Escopo deste plano:** três evoluções sobre o que já existe — (A) retornar uma tarefa arquivada, (B) exclusão permanente manual, (C) exclusão permanente automática após 1 mês — mais o registro dessas mudanças em `docs/log.md`.

⚠️ **Achado importante durante a análise, fora do escopo pedido, mas relevante:** o job de arquivamento automático em `archive-completed-tasks.ts` está arquivando tarefas após **2 dias** (`TWO_DAYS_MS`), e não após 15 dias como definido no plano original. Sinalizo aqui como correção opcional (Item D), já que este plano mexe no mesmo diretório de jobs.

---

## 1. Diagnóstico do estado atual

Em `src/modules/archived-tasks/ArchivedTasksPage.tsx`, cada tarefa arquivada é renderizada como uma linha estática, **sem `onClick`** e sem nenhuma ação disponível. Não existe hoje:
- Endpoint de "desarquivar"/retornar no backend (`TaskService.ts` só tem `archive()`).
- Modal de detalhe para a tarefa arquivada.
- Botão de retorno.
- Qualquer rotina de exclusão permanente (nem manual, nem automática) — as tarefas ficam com `archived = true` para sempre, o que é a preocupação de crescimento de dados que você levantou.

O endpoint de exclusão em si já existe e pode ser reaproveitado (`DELETE /tasks/:id`, controller `remove`, já usado por `TaskService.remove()` no fluxo de tarefas ativas).

---

## 2. Item A — Método de retornar tarefa (desarquivar)

### Backend
Nova função em `server/src/controllers/task-controller.ts`, ao lado de `archive()`:
```ts
export async function unarchive(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    const task = await prisma.task.findUnique({
      where: { id },
      include: { board: { select: { organizationId: true } } },
    })
    if (!task || task.board.organizationId !== req.organizationId) {
      res.status(404).json({ error: 'Tarefa não encontrada' })
      return
    }
    const updated = await prisma.task.update({
      where: { id },
      // reseta completedAt para agora: a tarefa volta a ficar visível no quadro
      // e ganha uma nova janela antes de ser arquivada de novo
      data: { archived: false, archivedAt: null, completedAt: new Date() },
    })
    res.json(updated)
  } catch (err) {
    console.error('[TASKS_UNARCHIVE]', err)
    res.status(500).json({ error: 'Erro ao retornar tarefa' })
  }
}
```

Nova rota em `server/src/routes/tasks.ts` (ao lado da rota de archive):
```diff
 import { listAll, listByBoard, create, update, move, remove, archive, listArchived } from '../controllers/task-controller'
+import { listAll, listByBoard, create, update, move, remove, archive, unarchive, listArchived } from '../controllers/task-controller'
 ...
 taskRouter.patch('/:id/archive', archive)
+taskRouter.patch('/:id/unarchive', unarchive)
```

### Frontend
Em `src/services/TaskService.ts`, ao lado de `archive`:
```diff
   async archive(id: string): Promise<Task> {
     return apiPatch<Task>(`/tasks/${id}/archive`, {})
   },
+  async unarchive(id: string): Promise<Task> {
+    return apiPatch<Task>(`/tasks/${id}/unarchive`, {})
+  },
```

**Observação sobre o que "retornar" significa aqui:** a tarefa volta a aparecer no quadro ainda com `status = "done"` (coluna "Concluído"), com um novo prazo de 15 dias antes de ser arquivada de novo — ela não volta para "A Fazer". Se preferir que o retorno também reabra o trabalho (status "A Fazer"), avise que ajusto o `data` do `unarchive` para incluir `status: 'todo'`.

### Critério de aceite
- Existe um jeito de tirar uma tarefa do estado "arquivada" e ela volta a aparecer normalmente no quadro de origem, na coluna "Concluído", com uma nova janela de 15 dias.

---

## 3. Item B — Modal de detalhes ao clicar na tarefa arquivada (retornar + excluir)

O projeto já tem um componente `Modal` reutilizável (`src/shared/components/Modal`), usado do mesmo jeito em `BoardDetailsPage.tsx`. Seguimos o mesmo padrão em `ArchivedTasksPage.tsx`, já reunindo os botões de **retornar** e **excluir permanentemente** no mesmo modal.

### Alterações em `src/modules/archived-tasks/ArchivedTasksPage.tsx`

**1. Importações e estado:**
```diff
 import { Button } from '../../shared/components/Button'
+import { Modal } from '../../shared/components/Modal'
 import { LoadingState } from '../../shared/components/LoadingState'
 import { ErrorState } from '../../shared/components/ErrorState'
 import { Badge } from '../../shared/components/Badge'
 import { getPriorityLabel, getPriorityVariant } from '../../types/task.types'
 import { apiGet } from '../../core/api/httpClient'
+import { TaskService } from '../../services/TaskService'
 import type { Task } from '../../types'
 ...
   const [tasks, setTasks] = useState<ArchivedTask[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)
+  const [selectedTask, setSelectedTask] = useState<ArchivedTask | null>(null)
+  const [restoring, setRestoring] = useState(false)
+  const [deleting, setDeleting] = useState(false)
+  const [confirmDelete, setConfirmDelete] = useState(false)
```

**2. Tornar a linha clicável:**
```diff
-              {catTasks.map((t) => (
-                <div key={t.id} className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--gray-50)] border border-[var(--gray-200)]">
+              {catTasks.map((t) => (
+                <div
+                  key={t.id}
+                  onClick={() => setSelectedTask(t)}
+                  className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--gray-50)] border border-[var(--gray-200)] cursor-pointer hover:border-[var(--gray-300)] transition-colors"
+                >
```

**3. Funções de retornar e excluir (removem o item da lista local após sucesso):**
```ts
async function handleRestore(taskId: string) {
  setRestoring(true)
  try {
    await TaskService.unarchive(taskId)
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    setSelectedTask(null)
  } catch {
    setError('Erro ao retornar a tarefa')
  } finally {
    setRestoring(false)
  }
}

async function handleDelete(taskId: string) {
  setDeleting(true)
  try {
    await TaskService.remove(taskId)
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    setSelectedTask(null)
    setConfirmDelete(false)
  } catch {
    setError('Erro ao excluir a tarefa')
  } finally {
    setDeleting(false)
  }
}
```

**4. Modal de detalhes, com os dois botões no footer (adicionar no final do JSX, antes do fechamento do componente):**
```tsx
<Modal
  open={!!selectedTask}
  onClose={() => setSelectedTask(null)}
  title={selectedTask?.title ?? ''}
  size="md"
  footer={
    <div className="flex justify-between items-center w-full">
      <Button variant="danger" onClick={() => setConfirmDelete(true)}>
        Excluir permanentemente
      </Button>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => setSelectedTask(null)}>
          Fechar
        </Button>
        <Button
          variant="primary"
          loading={restoring}
          onClick={() => selectedTask && handleRestore(selectedTask.id)}
        >
          Retornar tarefa
        </Button>
      </div>
    </div>
  }
>
  {selectedTask && (
    <div className="space-y-3 text-size-body-small">
      <div className="flex items-center gap-2">
        <Badge variant={getPriorityVariant(selectedTask.priority)}>
          {getPriorityLabel(selectedTask.priority)}
        </Badge>
        <span className="text-[var(--gray-500)]">{selectedTask.board.title}</span>
      </div>
      {selectedTask.description && (
        <p className="text-[var(--gray-700)] whitespace-pre-wrap">{selectedTask.description}</p>
      )}
      <div className="grid grid-cols-2 gap-2 text-[var(--gray-500)] pt-2 border-t border-[var(--gray-200)]">
        <span>Responsável: {selectedTask.assignee || '—'}</span>
        <span>Prazo: {selectedTask.dueDate || '—'}</span>
        <span>
          Concluída em:{' '}
          {selectedTask.completedAt ? new Date(selectedTask.completedAt).toLocaleDateString('pt-BR') : '—'}
        </span>
        <span>
          Arquivada em:{' '}
          {selectedTask.archivedAt ? new Date(selectedTask.archivedAt).toLocaleDateString('pt-BR') : '—'}
        </span>
      </div>
    </div>
  )}
</Modal>
```

**5. Modal de confirmação antes de excluir (ação destrutiva e irreversível):**
```tsx
<Modal
  open={confirmDelete}
  onClose={() => setConfirmDelete(false)}
  title="Excluir tarefa permanentemente?"
  size="sm"
  footer={
    <div className="flex justify-end gap-2">
      <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
        Cancelar
      </Button>
      <Button
        variant="danger"
        loading={deleting}
        onClick={() => selectedTask && handleDelete(selectedTask.id)}
      >
        Excluir definitivamente
      </Button>
    </div>
  }
>
  <p className="text-size-body-small text-[var(--gray-700)]">
    Esta ação não pode ser desfeita. A tarefa "{selectedTask?.title}" será excluída permanentemente.
  </p>
</Modal>
```

> Confirme as props exatas do `Button` (`loading`, variantes `"primary"`, `"ghost"`, `"danger"`) e do `Modal` (`footer`, `size`) contra os arquivos reais em `src/shared/components/`. Se a variante `"danger"` não existir no `Button`, usar a mais próxima disponível (ex.: `"secondary"` com classe de cor vermelha) ou criá-la no componente.

### Critério de aceite
- Clicar em qualquer tarefa arquivada abre um modal com título, descrição, prioridade, quadro, responsável, prazo, data de conclusão e data de arquivamento.
- O botão "Retornar tarefa" desarquiva a tarefa e a remove da lista de arquivadas na tela, sem recarregar a página.
- O botão "Excluir permanentemente" pede confirmação antes de excluir; após confirmar, a tarefa é removida do banco e some da lista na tela.

---

## 4. Item C — Job de exclusão permanente automática após 1 mês

### Diagnóstico
Não existe hoje nenhuma rotina que remova tarefas arquivadas do banco — elas ficam para sempre, o que tende a pesar o sistema com o tempo, como você apontou.

### Solução proposta
Criar um segundo job agendado, separado do de arquivamento (mantém responsabilidades isoladas e facilita ajustar os prazos de cada um de forma independente no futuro).

**Novo arquivo `server/src/jobs/purge-archived-tasks.ts`:**
```ts
import cron from 'node-cron'
import { prisma } from '../lib/prisma'

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

export async function purgeOldArchivedTasks() {
  const cutoff = new Date(Date.now() - THIRTY_DAYS_MS)
  const result = await prisma.task.deleteMany({
    where: { archived: true, archivedAt: { lte: cutoff } },
  })
  if (result.count > 0) console.log(`[PURGE_JOB] ${result.count} tarefa(s) excluída(s) permanentemente.`)
}

export function startPurgeJob() {
  // roda 1x/dia às 04:00 (depois do job de arquivamento, que roda às 03:00)
  cron.schedule('0 4 * * *', purgeOldArchivedTasks)
  // fallback na subida do servidor, pelo mesmo motivo do job de arquivamento
  // (plano free do Render pode deixar o serviço "dormindo")
  purgeOldArchivedTasks()
}
```

**Registrar em `server/src/index.ts`:**
```diff
 import { startArchiveJob } from './jobs/archive-completed-tasks'
+import { startPurgeJob } from './jobs/purge-archived-tasks'
 ...
   startArchiveJob()
+  startPurgeJob()
```

### Critério de aceite
- Uma tarefa arquivada há mais de 30 dias é excluída permanentemente do banco na próxima execução do job, sem ação manual.
- O job de exclusão roda de forma independente do job de arquivamento (horários diferentes).

---

## 5. Item D — Correção opcional do prazo de arquivamento (2 dias → 15 dias)

Como estamos mexendo no diretório `server/src/jobs/`, deixo pronta a correção do prazo encontrado divergente do plano original, caso não tenha sido intencional:
```diff
-const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000
+const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000
 ...
-  const cutoff = new Date(Date.now() - TWO_DAYS_MS)
+  const cutoff = new Date(Date.now() - FIFTEEN_DAYS_MS)
```
(em `server/src/jobs/archive-completed-tasks.ts`) — aplicar apenas mediante confirmação sua.

---

## 6. Atualizar o `docs/log.md`

Adicionar uma única entrada no topo de `docs/log.md` cobrindo os três itens implementados nesta rodada:
```markdown
## [Data da implementação] — Arquivamento de Tarefas: retorno + exclusão permanente

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
- (se aplicável) Corrigido o prazo do job de arquivamento automático de 2 dias para 15 dias, conforme especificação original.
```

Se já existir um `docs/log.md`, a entrada deve ser **adicionada no topo** (mais recente primeiro), sem apagar entradas anteriores.

---

## 7. Resumo de arquivos impactados

| Arquivo | Alteração |
|---|---|
| `server/src/controllers/task-controller.ts` | nova função `unarchive` |
| `server/src/routes/tasks.ts` | nova rota `PATCH /:id/unarchive` |
| `server/src/jobs/purge-archived-tasks.ts` (novo) | job diário de exclusão permanente após 30 dias |
| `server/src/jobs/archive-completed-tasks.ts` | correção opcional do prazo (2 dias → 15 dias) |
| `server/src/index.ts` | inicia o novo job de exclusão |
| `src/services/TaskService.ts` | novo método `unarchive` |
| `src/modules/archived-tasks/ArchivedTasksPage.tsx` | modal de detalhes com botões de retornar e excluir |
| `docs/log.md` (novo ou atualizado) | registro do que foi feito |

## 8. Riscos e observações gerais
- Exclusão é destrutiva e não pode ser desfeita — por isso a confirmação antes de excluir manualmente é importante; o job automático, por rodar sozinho, não tem confirmação, então vale garantir que o prazo de 30 dias é confortável antes de subir para produção.
- Teste sugerido: arquivar uma tarefa, alterar manualmente `archivedAt` no banco para uma data 31+ dias atrás (via `psql` ou Prisma Studio) e rodar `purgeOldArchivedTasks()` manualmente para confirmar que ela é excluída.
- Confirmar se o comportamento de "retornar mantém status Concluído" atende à expectativa, ou se preferem que o retorno reabra a tarefa como "A Fazer".
- Confirmar se a correção do prazo de 15 dias (Item D) deve ser aplicada nesta mesma rodada.