import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { Pencil, Trash2, ArrowLeft, Plus, Send, Check, X } from 'lucide-react'
import { Button } from '../../shared/components/Button'
import { ErrorState } from '../../shared/components/ErrorState'
import { LoadingState } from '../../shared/components/LoadingState'
import { Modal } from '../../shared/components/Modal'
import { Drawer } from '../../shared/components/Drawer'
import { Input } from '../../shared/components/Input'
import { Textarea } from '../../shared/components/Textarea'
import { Select } from '../../shared/components/Select'
import { Badge } from '../../shared/components/Badge'
import { KanbanColumn } from '../../shared/components/KanbanColumn'
import { useBoardStore } from '../../stores/domain/boardStore'
import { useTaskStore } from '../../stores/domain/taskStore'
import { useCommentStore } from '../../stores/domain/commentStore'
import { useChecklistStore } from '../../stores/domain/checklistStore'
import { useAttachmentStore } from '../../stores/domain/attachmentStore'
import { COLUMNS, getPriorityLabel, getPriorityVariant } from '../../types/task.types'
import { formatDate, formatDateTime } from '../../utils/formatDate'
import type { BoardFormData, Task, TaskFormData, TaskPriority, TaskStatus } from '../../types'

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
]

export default function BoardDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { selectedBoard, error, loadBoard, updateBoard, deleteBoard } = useBoardStore()
  const { tasks, loading: tasksLoading, loadTasks, addTask, updateTask, deleteTask, moveTask, setSelectedTask } = useTaskStore()
  const { loadComments, addComment, getTaskComments } = useCommentStore()
  const { loadItems, addItem, toggleItem, removeItem, getTaskItems } = useChecklistStore()
  const { loadAttachments } = useAttachmentStore()

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [form, setForm] = useState<BoardFormData>({ title: '', description: '', color: '#2563eb' })

  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [taskForm, setTaskForm] = useState<TaskFormData>({ title: '', description: '', priority: 'medium', assignee: '', dueDate: '' })

  const [detailTask, setDetailTask] = useState<Task | null>(null)
  const [editTaskOpen, setEditTaskOpen] = useState(false)
  const [editTaskForm, setEditTaskForm] = useState<TaskFormData>({ title: '', description: '', priority: 'medium', assignee: '', dueDate: '' })
  const [deleteTaskConfirm, setDeleteTaskConfirm] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [checklistText, setChecklistText] = useState('')

  useEffect(() => {
    if (id) {
      loadBoard(id)
      loadTasks(id)
    }
  }, [id, loadBoard, loadTasks])

  useEffect(() => {
    if (selectedBoard) {
      setForm({ title: selectedBoard.title, description: selectedBoard.description, color: selectedBoard.color })
    }
  }, [selectedBoard])

  useEffect(() => {
    if (detailTask) {
      loadComments(detailTask.id)
      loadItems(detailTask.id)
      loadAttachments(detailTask.id)
    }
  }, [detailTask, loadComments, loadItems, loadAttachments])

  async function handleDragEnd(result: DropResult) {
    if (!result.destination || !id) return
    const newStatus = result.destination.droppableId as TaskStatus
    const taskId = result.draggableId
    await moveTask(taskId, newStatus)
    setSelectedTask(detailTask)
  }

  async function handleEditBoard() {
    if (id && form.title.trim()) {
      await updateBoard(id, form)
      setEditModalOpen(false)
    }
  }

  async function handleDeleteBoard() {
    if (id) {
      await deleteBoard(id)
      navigate('/boards')
    }
  }

  function openCreateTask() {
    setTaskForm({ title: '', description: '', priority: 'medium', assignee: '', dueDate: '' })
    setCreateTaskOpen(true)
  }

  async function handleCreateTask() {
    if (!id || !taskForm.title.trim()) return
    await addTask({ ...taskForm, boardId: id })
    setCreateTaskOpen(false)
  }

  function openDetail(task: Task) {
    setDetailTask(task)
    setSelectedTask(task)
  }

  function closeDetail() {
    setDetailTask(null)
    setSelectedTask(null)
    setEditTaskOpen(false)
    setDeleteTaskConfirm(false)
    setCommentText('')
    setChecklistText('')
  }

  function openEditTask() {
    if (!detailTask) return
    setEditTaskForm({
      title: detailTask.title,
      description: detailTask.description,
      priority: detailTask.priority,
      assignee: detailTask.assignee,
      dueDate: detailTask.dueDate,
    })
    setEditTaskOpen(true)
  }

  async function handleEditTask() {
    if (!detailTask || !editTaskForm.title.trim()) return
    await updateTask(detailTask.id, editTaskForm)
    setDetailTask({ ...detailTask, ...editTaskForm })
    setEditTaskOpen(false)
  }

  async function handleDeleteTask() {
    if (!detailTask) return
    await deleteTask(detailTask.id)
    closeDetail()
  }

  async function handleAddComment() {
    if (!detailTask || !commentText.trim()) return
    await addComment({ taskId: detailTask.id, content: commentText })
    setCommentText('')
  }

  async function handleAddChecklist() {
    if (!detailTask || !checklistText.trim()) return
    await addItem({ taskId: detailTask.id, text: checklistText })
    setChecklistText('')
  }

  if (error) return <ErrorState title="Erro" description={error} onRetry={() => id && loadBoard(id)} />
  if (!selectedBoard) return <LoadingState message="Carregando board..." />

  const boardTasks = id ? tasks.filter((t) => t.boardId === id) : []
  const taskComments = detailTask ? getTaskComments(detailTask.id) : []
  const taskChecklist = detailTask ? getTaskItems(detailTask.id) : []

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" iconLeft={<ArrowLeft size={16} />} onClick={() => navigate('/boards')}>
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-size-h4 font-semibold text-[var(--gray-900)]">{selectedBoard.title}</h1>
          {selectedBoard.description && (
            <p className="text-size-body-small text-[var(--gray-500)]">{selectedBoard.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" iconLeft={<Pencil size={14} />} onClick={() => setEditModalOpen(true)}>
            Editar
          </Button>
          <Button variant="ghost" size="sm" iconLeft={<Trash2 size={14} />} onClick={() => setDeleteConfirm(true)}>
            Excluir
          </Button>
        </div>
      </div>

      {tasksLoading ? (
        <LoadingState message="Carregando tarefas..." />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.key}
                columnId={col.key}
                title={col.label}
                tasks={boardTasks.filter((t) => t.status === col.key)}
                onAddTask={openCreateTask}
                onTaskClick={(taskId) => {
                  const task = boardTasks.find((t) => t.id === taskId)
                  if (task) openDetail(task)
                }}
                onTaskEdit={(taskId) => {
                  const task = boardTasks.find((t) => t.id === taskId)
                  if (task) { openDetail(task); openEditTask() }
                }}
                onTaskDelete={(taskId) => {
                  const task = boardTasks.find((t) => t.id === taskId)
                  if (task) { openDetail(task); setDeleteTaskConfirm(true) }
                }}
              />
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Create Task Modal */}
      <Modal open={createTaskOpen} onClose={() => setCreateTaskOpen(false)} title="Nova Tarefa">
        <div className="space-y-4">
          <Input label="Título" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Digite o título da tarefa" autoFocus />
          <Textarea label="Descrição" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Descrição opcional" />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Prioridade" value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as TaskPriority })} options={PRIORITIES} />
            <Input label="Responsável" value={taskForm.assignee} onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })} placeholder="Nome do responsável" />
          </div>
          <Input label="Data de Entrega" type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
        </div>
        <div className="flex justify-end gap-3 mt-6" slot="footer">
          <Button variant="ghost" size="md" onClick={() => setCreateTaskOpen(false)}>Cancelar</Button>
          <Button variant="primary" size="md" onClick={handleCreateTask} disabled={!taskForm.title.trim()}>Criar</Button>
        </div>
      </Modal>

      {/* Task Detail Drawer */}
      <Drawer open={!!detailTask} onClose={closeDetail} title={detailTask?.title ?? ''}>
        {detailTask && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={getPriorityVariant(detailTask.priority)}>{getPriorityLabel(detailTask.priority)}</Badge>
              <Badge variant={detailTask.status === 'done' ? 'success' : 'default'}>
                {COLUMNS.find((c) => c.key === detailTask.status)?.label}
              </Badge>
            </div>

            {detailTask.description && (
              <p className="text-size-body-small text-[var(--gray-600)]">{detailTask.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 text-size-body-small">
              {detailTask.assignee && (
                <div><span className="text-[var(--gray-400)]">Responsável:</span> <span className="text-[var(--gray-700)] font-medium">{detailTask.assignee}</span></div>
              )}
              {detailTask.dueDate && (
                <div><span className="text-[var(--gray-400)]">Entrega:</span> <span className="text-[var(--gray-700)] font-medium">{formatDate(detailTask.dueDate)}</span></div>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" size="sm" iconLeft={<Pencil size={14} />} onClick={openEditTask}>Editar</Button>
              <Button variant="danger" size="sm" iconLeft={<Trash2 size={14} />} onClick={() => setDeleteTaskConfirm(true)}>Excluir</Button>
            </div>

            {/* Checklist */}
            <div>
              <h4 className="text-size-body-small font-semibold text-[var(--gray-900)] mb-3">Checklist</h4>
              <div className="space-y-2 mb-3">
                {taskChecklist.length === 0 && (
                  <p className="text-size-caption text-[var(--gray-400)]">Nenhum item</p>
                )}
                {taskChecklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 group">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`w-5 h-5 rounded-[var(--radius-sm)] border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors ${item.checked ? 'bg-[var(--color-success-600)] border-[var(--color-success-600)]' : 'border-[var(--gray-300)] hover:border-[var(--color-primary-600)]'}`}
                    >
                      {item.checked && <Check size={12} className="text-white" />}
                    </button>
                    <span className={`flex-1 text-size-body-small ${item.checked ? 'line-through text-[var(--gray-400)]' : 'text-[var(--gray-700)]'}`}>{item.text}</span>
                    <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 text-[var(--gray-400)] hover:text-[var(--color-danger-600)] cursor-pointer transition-all">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={checklistText}
                  onChange={(e) => setChecklistText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddChecklist() }}
                  placeholder="Adicionar item..."
                  className="flex-1 h-9 px-3 rounded-[var(--radius-md)] border border-[var(--gray-300)] text-size-body-small focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-900)]"
                />
                <Button variant="primary" size="sm" onClick={handleAddChecklist} disabled={!checklistText.trim()}><Plus size={14} /></Button>
              </div>
            </div>

            {/* Comments */}
            <div>
              <h4 className="text-size-body-small font-semibold text-[var(--gray-900)] mb-3">Comentários</h4>
              <div className="space-y-3 mb-3">
                {taskComments.length === 0 && (
                  <p className="text-size-caption text-[var(--gray-400)]">Nenhum comentário</p>
                )}
                {taskComments.map((comment) => (
                  <div key={comment.id} className="p-3 rounded-[var(--radius-md)] bg-[var(--gray-50)]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-size-caption font-medium text-[var(--gray-700)]">{comment.user?.name ?? 'Usuário'}</span>
                      <span className="text-size-caption text-[var(--gray-400)]">{formatDateTime(comment.createdAt)}</span>
                    </div>
                    <p className="text-size-body-small text-[var(--gray-600)]">{comment.content}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment() }}
                  placeholder="Adicionar comentário..."
                  className="flex-1 h-9 px-3 rounded-[var(--radius-md)] border border-[var(--gray-300)] text-size-body-small focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-900)]"
                />
                <Button variant="primary" size="sm" onClick={handleAddComment} disabled={!commentText.trim()} iconLeft={<Send size={14} />}>Enviar</Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Edit Task Modal */}
      <Modal open={editTaskOpen} onClose={() => setEditTaskOpen(false)} title="Editar Tarefa">
        <div className="space-y-4">
          <Input label="Título" value={editTaskForm.title} onChange={(e) => setEditTaskForm({ ...editTaskForm, title: e.target.value })} autoFocus />
          <Textarea label="Descrição" value={editTaskForm.description} onChange={(e) => setEditTaskForm({ ...editTaskForm, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Prioridade" value={editTaskForm.priority} onChange={(e) => setEditTaskForm({ ...editTaskForm, priority: e.target.value as TaskPriority })} options={PRIORITIES} />
            <Input label="Responsável" value={editTaskForm.assignee} onChange={(e) => setEditTaskForm({ ...editTaskForm, assignee: e.target.value })} />
          </div>
          <Input label="Data de Entrega" type="date" value={editTaskForm.dueDate} onChange={(e) => setEditTaskForm({ ...editTaskForm, dueDate: e.target.value })} />
        </div>
        <div className="flex justify-end gap-3 mt-6" slot="footer">
          <Button variant="ghost" size="md" onClick={() => setEditTaskOpen(false)}>Cancelar</Button>
          <Button variant="primary" size="md" onClick={handleEditTask} disabled={!editTaskForm.title.trim()}>Salvar</Button>
        </div>
      </Modal>

      {/* Delete Task Confirm */}
      <Modal open={deleteTaskConfirm} onClose={() => setDeleteTaskConfirm(false)} title="Excluir Tarefa" size="sm">
        <p className="text-size-body-small text-[var(--gray-600)]">Tem certeza que deseja excluir esta tarefa?</p>
        <div className="flex justify-end gap-3 mt-6" slot="footer">
          <Button variant="ghost" size="md" onClick={() => setDeleteTaskConfirm(false)}>Cancelar</Button>
          <Button variant="danger" size="md" onClick={handleDeleteTask}>Excluir</Button>
        </div>
      </Modal>

      {/* Edit Board Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Editar Board">
        <div className="space-y-4">
          <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea label="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="flex justify-end gap-3 mt-6" slot="footer">
          <Button variant="ghost" size="md" onClick={() => setEditModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" size="md" onClick={handleEditBoard}>Salvar</Button>
        </div>
      </Modal>

      {/* Delete Board Confirm */}
      <Modal open={deleteConfirm} onClose={() => setDeleteConfirm(false)} title="Excluir Board" size="sm">
        <p className="text-size-body-small text-[var(--gray-600)]">Tem certeza que deseja excluir este board? Todas as tarefas serão removidas.</p>
        <div className="flex justify-end gap-3 mt-6" slot="footer">
          <Button variant="ghost" size="md" onClick={() => setDeleteConfirm(false)}>Cancelar</Button>
          <Button variant="danger" size="md" onClick={handleDeleteBoard}>Excluir</Button>
        </div>
      </Modal>
    </div>
  )
}
