import { jsPDF } from 'jspdf'
import { applyPlugin } from 'jspdf-autotable'
applyPlugin(jsPDF)
import type { Board, Task, Team, User } from '../types'
import { getPriorityLabel, COLUMNS } from '../types/task.types'

/* ── Palette (minimal, BI-style) ── */
const C = {
  brand: '#1E40AF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  border: '#D1D5DB',
  zebra: '#F9FAFB',
  white: '#FFFFFF',
  progressTrack: '#D1D5DB',
  progressFill: '#1E40AF',
  priority: { low: '#22C55E', medium: '#F59E0B', high: '#F97316', urgent: '#EF4444' },
  status: { todo: '#6B7280', doing: '#3B82F6', review: '#A855F7', done: '#22C55E' },
  prioText: { low: '#16A34A', medium: '#D97706', high: '#EA580C', urgent: '#DC2626' },
  statusText: { todo: '#6B7280', doing: '#2563EB', review: '#7C3AED', done: '#16A34A' },
}

/* ── Layout (36px ≈ 9.5mm) ── */
const M = 9.5
const PW = 210
const CW = PW - M * 2

interface ReportData {
  boards: Board[]; tasks: Task[]; teams: Team[]; user: User | null
}

/* ── Helpers ── */
function hex(d: string): [number, number, number] {
  const c = d.replace('#', ''); return [parseInt(c[0] + c[1], 16), parseInt(c[2] + c[3], 16), parseInt(c[4] + c[5], 16)]
}
function fmtDate(d: Date) { return d.toLocaleDateString('pt-BR') }
function statusLabel(s: string) { return COLUMNS.find((c) => c.key === s)?.label ?? s }

function hLine(doc: jsPDF, y: number) {
  doc.setDrawColor(...hex(C.border)); doc.setLineWidth(0.3); doc.line(M, y, PW - M, y)
}

function colorDot(doc: jsPDF, x: number, y: number, fill: string, r = 1.5) {
  doc.setFillColor(...hex(fill)); doc.circle(x, y, r, 'F')
}

/* ── Metrics ── */
function compute(tasks: Task[]) {
  const total = tasks.length
  const done = tasks.filter((t) => t.status === 'done').length
  const completionRate = total ? Math.round((done / total) * 100) : 0
  const priorityDist: Record<string, number> = { low: 0, medium: 0, high: 0, urgent: 0 }
  tasks.forEach((t) => { priorityDist[t.priority] = (priorityDist[t.priority] ?? 0) + 1 })
  const statusDist = COLUMNS.map((c) => ({ label: c.label, key: c.key, count: tasks.filter((t) => t.status === c.key).length }))
  const am: Record<string, { total: number; done: number }> = {}
  tasks.forEach((t) => {
    const k = t.assignee || 'Sem responsável'
    if (!am[k]) am[k] = { total: 0, done: 0 }
    am[k].total++; if (t.status === 'done') am[k].done++
  })
  const assigneeDist = Object.entries(am).sort((a, b) => b[1].total - a[1].total)
  const totalMembers = assigneeDist.filter(([n]) => n !== 'Sem responsável').length
  return { total, done, completionRate, priorityDist, statusDist, assigneeDist, totalMembers }
}

function autoAnalysis(tasks: Task[], m: ReturnType<typeof compute>) {
  const { total, done, completionRate, priorityDist, statusDist, assigneeDist } = m
  const hp = Object.entries(priorityDist).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
  const topPrio = hp.length ? `${getPriorityLabel(hp[0][0] as any)} (${hp[0][1]})` : 'Nenhuma'
  const ts = [...statusDist].sort((a, b) => b.count - a.count)
  const topStatus = ts.length ? `${ts[0].label} (${ts[0].count})` : 'Nenhum'
  const mp = assigneeDist.length ? `${assigneeDist[0][0]} (${assigneeDist[0][1].done}/${assigneeDist[0][1].total})` : 'Nenhum'
  const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length
  const r: string[] = []
  r.push(`O sistema possui um total de ${total} atividades registradas.`)
  r.push(`A taxa geral de conclusão é de ${completionRate}%, com ${done} tarefas finalizadas.`)
  r.push(`A prioridade de maior ocorrência é ${topPrio}.`)
  r.push(`O status predominante entre as atividades é ${topStatus}.`)
  if (mp !== 'Nenhum') r.push(`O responsável com maior produtividade é ${mp}.`)
  if (tasks.some((t) => t.dueDate)) r.push(overdue > 0 ? `Há ${overdue} tarefas em atraso que necessitam de atenção.` : 'Não há tarefas em atraso no momento.')
  return r
}

/* ── Footer ── */
function footer(doc: jsPDF, page: number, total: number) {
  hLine(doc, 283)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...hex(C.textSecondary))
  doc.text('CA3 Planner', M, 288)
  doc.text(fmtDate(new Date()), PW / 2, 288, { align: 'center' })
  doc.text(`Página ${page} de ${total}`, PW - M, 288, { align: 'right' })
}

/* ─────────────────────────── COVER PAGE ─────────────────────────── */
function buildCover(doc: jsPDF, data: ReportData, m: ReturnType<typeof compute>) {
  // Line 1: system name + subtitle
  doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(...hex(C.brand))
  doc.text('CA3 Planner', M, 16)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...hex(C.textSecondary))
  doc.text('Sistema de Gestão Pedagógica', M + doc.getTextWidth('CA3 Planner') + 6, 16)

  // Line 2: page title
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(...hex(C.textPrimary))
  doc.text('Relatório Gerencial', M, 30)

  // Line 3: metadata
  const now = new Date()
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...hex(C.textSecondary))
  doc.text(`Data: ${fmtDate(now)}   |   Hora: ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}   |   Responsável: ${data.user?.name ?? 'Não informado'}`, M, 38)

  // Thin brand line
  doc.setDrawColor(...hex(C.brand)); doc.setLineWidth(0.5); doc.line(M, 42, PW - M, 42)
}

/* ────────────────────────── CONTENT PAGES ────────────────────────── */
function buildContent(doc: jsPDF, data: ReportData, m: ReturnType<typeof compute>) {
  const { total, done, completionRate, priorityDist, statusDist, assigneeDist, totalMembers } = m
  doc.addPage()
  let y = M + 4

  /* ═══ Resumo Geral (KPIs) — single occurrence ═══ */
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...hex(C.textPrimary))
  doc.text('Resumo Geral', M, y)
  hLine(doc, y + 2)
  y += 7

  const kpiW = (CW - 2) / 4
  const kpiY = y
  const kpis = [
    { label: 'QUADROS', value: String(data.boards.length) },
    { label: 'TAREFAS', value: String(m.total) },
    { label: '% CONCLUSÃO', value: `${completionRate}%`, progressPct: completionRate },
    { label: 'MEMBROS', value: String(totalMembers) },
  ]

  kpis.forEach((k, i) => {
    const x = M + i * (kpiW + 0.7)

    // vertical separator (except first)
    if (i > 0) {
      doc.setDrawColor(...hex(C.border)); doc.setLineWidth(0.3)
      doc.line(x - 0.3, kpiY - 4, x - 0.3, kpiY + 14)
    }

    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...hex(C.textSecondary))
    doc.text(k.label, x + kpiW / 2, kpiY, { align: 'center' })

    doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.setTextColor(...hex(C.brand))
    doc.text(k.value, x + kpiW / 2, kpiY + 11, { align: 'center' })

    // Thin progress bar for % conclusao
    if (k.progressPct !== undefined) {
      const barW = kpiW - 8; const barH = 1.2
      doc.setFillColor(...hex(C.progressTrack))
      doc.roundedRect(x + 4, kpiY + 14, barW, barH, 0.6, 0.6, 'F')
      if (k.progressPct > 0) {
        doc.setFillColor(...hex(C.progressFill))
        doc.roundedRect(x + 4, kpiY + 14, Math.max((k.progressPct / 100) * barW, 1), barH, 0.6, 0.6, 'F')
      }
    }
  })

  y = kpiY + 20

  /* ═══ Distribution side by side ═══ */
  y += 3
  const halfW = (CW - 4) / 2
  const distTitleY = y

  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...hex(C.textPrimary))
  doc.text('Distribuição por Prioridade', M, distTitleY)
  doc.text('Distribuição por Status', M + halfW + 4, distTitleY)
  hLine(doc, distTitleY + 2)
  const panelY = distTitleY + 7

  const prioItems = Object.entries(priorityDist)
    .filter(([, c]) => c > 0)
    .map(([key, count]) => ({ label: getPriorityLabel(key as any), count, color: (C.priority as any)[key] ?? C.textSecondary, key }))

  const statItems = statusDist
    .filter((s) => s.count > 0)
    .map((s) => ({ label: s.label, count: s.count, color: (C.status as any)[s.key] ?? C.textSecondary, key: s.key }))

  drawMiniTable(doc, panelY, prioItems, total, halfW, M)
  drawMiniTable(doc, panelY, statItems, total, halfW, M + halfW + 4)

  const ph = Math.max(prioItems.length, statItems.length) * 7 + 10
  y = panelY + ph + 5

  /* ═══ Tasks per Assignee ═══ */
  y = Math.max(y, panelY + ph + 5)
  y = pb(doc, y, 20 + assigneeDist.length * 7)

  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...hex(C.textPrimary))
  doc.text('Tarefas por Responsável', M, y)
  hLine(doc, y + 2)
  y += 7

  const aH = 7.5
  doc.setFillColor(...hex(C.zebra)); doc.rect(M, y, CW, aH, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...hex(C.textPrimary))
  const aX = [M + 3, M + 75, M + 115, M + 145]
  doc.text('RESPONSÁVEL', aX[0], y + 5.5); doc.text('TOTAL', aX[1], y + 5.5); doc.text('CONCLUÍDAS', aX[2], y + 5.5); doc.text('%', aX[3], y + 5.5)
  y += aH

  assigneeDist.forEach(([name, dist], idx) => {
    if (y > 272) { doc.addPage(); y = M + 5 }
    const pct = dist.total > 0 ? Math.round((dist.done / dist.total) * 100) : 0

    if (idx % 2 === 1) { doc.setFillColor(...hex(C.zebra)); doc.rect(M, y, CW, 7, 'F') }
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...hex(C.textPrimary))
    doc.text(name, aX[0], y + 5)
    doc.text(String(dist.total), aX[1], y + 5)
    doc.text(String(dist.done), aX[2], y + 5)
    doc.setFont('helvetica', 'bold')
    doc.text(`${pct}%`, aX[3], y + 5)
    hLine(doc, y + 7.5)
    y += 7.5
  })

  /* ═══ Detailed Task Table ═══ */
  y = pb(doc, y + 4, 18)
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...hex(C.textPrimary))
  doc.text('Detalhamento Completo das Tarefas', M, y)
  hLine(doc, y + 2)
  y += 7

  const body = data.tasks.map((t) => {
    const board = data.boards.find((b) => b.id === t.boardId)?.title ?? '-'
    const desc = t.description ? (t.description.length > 50 ? t.description.substring(0, 48) + '...' : t.description) : '-'
    return [board, t.title, desc, getPriorityLabel(t.priority as any), statusLabel(t.status), t.assignee || '-', fmtDate(new Date(t.createdAt)), t.dueDate ? fmtDate(new Date(t.dueDate)) : '-', t.priority, t.status]
  })

  const head = [['Quadro', 'Título', 'Descrição', 'Prioridade', 'Status', 'Resp.', 'Criação', 'Data Limite']]

  ;(doc as any).autoTable({
    startY: y,
    head,
    body: body.map((r) => r.slice(0, 8)),
    theme: 'plain',
    tableLineColor: hex(C.border),
    tableLineWidth: 0.2,
    headStyles: {
      fillColor: hex(C.zebra), textColor: hex(C.textPrimary), fontStyle: 'bold', fontSize: 7.5,
      halign: 'left', cellPadding: { top: 1.5, bottom: 1.5, left: 2, right: 2 },
    },
    bodyStyles: { fontSize: 7, textColor: hex(C.textPrimary), cellPadding: { top: 1.5, bottom: 1.5, left: 2, right: 2 } },
    alternateRowStyles: { fillColor: hex(C.zebra) },
    columnStyles: {
      0: { cellWidth: 22 }, 1: { cellWidth: 26 }, 2: { cellWidth: 46 },
      3: { cellWidth: 16 }, 4: { cellWidth: 16 },
      5: { cellWidth: 22 }, 6: { cellWidth: 20 }, 7: { cellWidth: 20 },
    },
    margin: { left: M, right: M },
    didParseCell: (data: any) => {
      if (data.column.index === 3) {
        const raw = body[data.row.index][8]
        const map: Record<string, string> = C.prioText
        data.cell.styles.textColor = hex((map as any)[raw] ?? C.textPrimary)
      }
      if (data.column.index === 4) {
        const raw = body[data.row.index][9]
        const map: Record<string, string> = C.statusText
        data.cell.styles.textColor = hex((map as any)[raw] ?? C.textPrimary)
      }
    },
  })

  /* ═══ Auto Analysis ═══ */
  const lines = autoAnalysis(data.tasks, m)
  const fy = (doc as any).lastAutoTable.finalY + 6
  let ay = fy
  if (ay > 270) { doc.addPage(); ay = M + 5 }

  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...hex(C.textPrimary))
  doc.text('Análise Automática', M, ay)
  hLine(doc, ay + 2)
  ay += 7

  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...hex(C.textPrimary))
  lines.forEach((line) => {
    if (ay > 280) { doc.addPage(); ay = M + 5 }
    doc.text(' - ' + line, M, ay)
    ay += 6
  })
}

function drawMiniTable(doc: jsPDF, y: number, items: { label: string; count: number; color: string }[], total: number, w: number, x: number) {
  const th = 7
  doc.setFillColor(...hex(C.zebra)); doc.rect(x, y, w, th, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...hex(C.textPrimary))
  doc.text('Item', x + 2, y + 5); doc.text('Qtd', x + w - 22, y + 5); doc.text('%', x + w - 6, y + 5, { align: 'center' })
  let ry = y + th

  items.forEach((it) => {
    const pct = total > 0 ? ((it.count / total) * 100).toFixed(1) : '0.0'
    colorDot(doc, x + 4, ry + 4, it.color, 1.8)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...hex(C.textPrimary))
    doc.text(it.label, x + 9, ry + 4.5)
    doc.setFont('helvetica', 'bold')
    doc.text(String(it.count), x + w - 22, ry + 4.5)
    doc.text(`${pct}%`, x + w - 6, ry + 4.5, { align: 'center' })
    hLine(doc, ry + 7)
    ry += 7.5
  })
}

function pb(doc: jsPDF, y: number, need: number): number {
  if (y + need > 280) { doc.addPage(); return M + 5 }
  return y
}

/* ─────────────────────────── EXPORT ─────────────────────────── */
export async function exportReport(data: ReportData): Promise<void> {
  const doc = new jsPDF('p', 'mm', 'a4')
  const m = compute(data.tasks)
  buildCover(doc, data, m)
  buildContent(doc, data, m)

  const total = doc.internal.getNumberOfPages()
  for (let i = 1; i <= total; i++) {
    doc.setPage(i)
    if (i > 1) footer(doc, i, total)
  }

  doc.save(`relatorio-gerencial-${new Date().toISOString().substring(0, 10)}.pdf`)
}
