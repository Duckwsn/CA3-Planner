# Design System — CA3 Planner

O design system é definido como CSS custom properties em `src/shared/styles/tokens.css` e mapeado para o Tailwind via `@theme` em `src/index.css`.

---

## Índice

- [Cores](#cores)
- [Tipografia](#tipografia)
- [Espaçamento](#espaçamento)
- [Border Radius](#border-radius)
- [Sombras](#sombras)
- [Z-Index](#z-index)
- [Animações](#animações)
- [Componentes](#componentes)

---

## Cores

### Paleta primária (Navy/Blue)

| Token | Hex | Uso |
|---|---|---|
| `--color-primary-900` | `#192856` | Texto, hover states |
| `--color-primary-800` | `#22356F` | Títulos |
| `--color-primary-700` | `#2C458C` | Links |
| `--color-primary-600` | `#3A58A9` | Ações, bordas ativas |
| `--color-primary-500` | `#4B6CC4` | Primary color base |
| `--color-primary-400` | `#6B8AD4` | Hover claro |
| `--color-primary-300` | `#8EA8E2` | Background hover |
| `--color-primary-200` | `#B4C6EE` | Borda leve |
| `--color-primary-100` | `#DAE3F7` | Background leve |
| `--color-primary-50` | `#F0F4FB` | Background muito leve |

### Paleta de acento (Gold)

| Token | Hex | Uso |
|---|---|---|
| `--color-gold-500` | `#ECB646` | Acentos, highlights |
| `--color-gold-100` | `#FDF2CE` | Background de hoje no calendário |
| `--color-gold-50` | `#FEFAEF` | Background hover |

### Cores semânticas

| Token | Hex | Uso |
|---|---|---|
| `--color-success-500` | `#22C55E` | Sucesso, concluído |
| `--color-warning-500` | `#F59E0B` | Atenção, revisão |
| `--color-danger-500` | `#EF4444` | Erro, exclusão |
| `--color-info-500` | `#3B82F6` | Informação |

Cada cor semântica tem escala 50-900.

### Cores de layout

| Token | Hex | Uso |
|---|---|---|
| `--color-sidebar-bg` | `#1B2452` | Fundo da sidebar |
| `--color-sidebar-item-active-bg` | `#F5A623` | Item ativo na sidebar |
| `--color-sidebar-item-active-text` | `#1B2452` | Texto do item ativo |
| `--color-sidebar-item-inactive` | `#E4E7F1` | Texto do item inativo |
| `--color-sidebar-logo-bg` | `#F5A623` | Fundo do logo |
| `--color-bg-page` | `#F7F8FC` | Fundo da página |
| `--color-bg-surface` | `#FFFFFF` | Fundo de superfícies (cards, modais) |
| `--color-card-border` | `#E5E7EB` | Borda de cards |
| `--color-text-primary` | `#1F2330` | Texto principal |
| `--color-text-secondary` | `#6B7280` | Texto secundário |
| `--color-progress-track` | `#E5E7EB` | Fundo da barra de progresso |
| `--color-progress-fill` | `#4F5FE0` | Preenchimento da barra |

### Cores de badge

| Token | Uso |
|---|---|
| `--color-badge-urgent-bg` + `--color-badge-urgent-text` | Prioridade Urgente (rosa) |
| `--color-badge-high-bg` + `--color-badge-high-text` | Prioridade Alta (âmbar) |
| `--color-badge-medium-bg` + `--color-badge-medium-text` | Prioridade Média (azul) |

### Cores de avatar

| Token | Uso |
|---|---|
| `--color-avatar-1` | Rosa (D6336C) |
| `--color-avatar-2` | Laranja (E8952D) |
| `--color-avatar-3` | Azul (4361EE) |
| `--color-avatar-logged` | Verde (2FA84F) |

### Gray scale

| Token | Hex |
|---|---|
| `--gray-50` | `#F9FAFB` |
| `--gray-100` | `#F3F4F6` |
| `--gray-200` | `#E5E7EB` |
| `--gray-300` | `#D1D5DB` |
| `--gray-400` | `#9CA3AF` |
| `--gray-500` | `#6B7280` |
| `--gray-600` | `#4B5563` |
| `--gray-700` | `#374151` |
| `--gray-800` | `#1F2937` |
| `--gray-900` | `#111827` |

---

## Tipografia

### Fontes

| Token | Valor |
|---|---|
| `--font-primary` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| `--font-secondary` | `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |

### Pesos

| Token | Valor |
|---|---|
| `--font-weight-regular` | `400` |
| `--font-weight-medium` | `500` |
| `--font-weight-semibold` | `600` |
| `--font-weight-bold` | `700` |

### Escala tipográfica

| Token | Size | Line-height | Uso típico |
|---|---|---|---|
| `--text-display-large` | 64px | 72px | Hero sections |
| `--text-display-medium` | 56px | 64px | Page titles grandes |
| `--text-h1` | 48px | 56px | Título de seção |
| `--text-h2` | 40px | 48px | Título de página |
| `--text-h3` | 32px | 40px | Título de card |
| `--text-h4` | 24px | 32px | Subtítulo |
| `--text-h5` | 20px | 28px | Título de seção pequena |
| `--text-h6` | 18px | 24px | Título de card pequeno |
| `--text-body-large` | 18px | 28px | Parágrafo grande |
| `--text-body` | 16px | 24px | Parágrafo padrão |
| `--text-body-small` | 14px | 20px | Texto auxiliar |
| `--text-caption` | 12px | 16px | Labels, badges |

---

## Espaçamento

| Token | Valor |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |
| `--space-20` | 80px |
| `--space-24` | 96px |

---

## Border Radius

| Token | Valor |
|---|---|
| `--radius-xs` | 4px |
| `--radius-sm` | 6px |
| `--radius-md` | 10px |
| `--radius-lg` | 12px |
| `--radius-xl` | 20px |
| `--radius-2xl` | 24px |
| `--radius-full` | 9999px |

---

## Sombras

| Token | Valor |
|---|---|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.08)` |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.10)` |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` |
| `--shadow-xl` | `0 16px 40px rgba(0,0,0,0.16)` |

---

## Z-Index

| Token | Valor | Uso |
|---|---|---|
| `--z-base` | 1 | Elementos base |
| `--z-dropdown` | 100 | Dropdowns e menus |
| `--z-sticky` | 200 | Header fixo |
| `--z-overlay` | 300 | Backdrops |
| `--z-modal` | 400 | Modais |
| `--z-toast` | 500 | Toasts |
| `--z-tooltip` | 600 | Tooltips |

---

## Animações

| Token | Valor |
|---|---|
| `--duration-fast` | 150ms |
| `--duration-normal` | 250ms |
| `--duration-slow` | 350ms |
| `--easing-default` | ease-in-out |

**Classe utilitária:** `animate-scale-up` aplica scale(0.95 → 1) + opacity(0 → 1) em 250ms.

---

## Componentes

### Card (`src/shared/components/Card/`)

Container de conteúdo com variantes de padding e comportamento.

**Props:**
- `padding`: `'none' | 'sm' | 'md' | 'lg'` (default `'lg'`)
- `hover`: boolean — ativa sombra no hover
- `border`: boolean — adiciona borda sutil

**Subcomponentes:** `CardHeader`, `CardBody`, `CardFooter`

### Button (`src/shared/components/Button/`)

**Variantes:** `primary` | `secondary` | `ghost` | `danger` | `success`
**Sizes:** `sm` | `md` | `lg`
**Props adicionais:** `loading`, `fullWidth`, `iconLeft`, `iconRight`

### Badge (`src/shared/components/Badge/`)

**Variantes:** `default` | `success` | `warning` | `danger` | `info` | `neutral` | `urgent` | `high` | `medium`

Mapeamento de prioridade:
- `low` → `info`
- `medium` → `medium`
- `high` → `high`
- `urgent` → `urgent`

### KpiCard (`src/shared/components/KpiCard/`)

Card de métrica com ícone em box colorido, título em uppercase, valor em h4 bold e variação opcional.

### ProgressBar (`src/shared/components/ProgressBar/`)

**`<ProgressBar>`** — Barra linear simples.
**`<StackedProgressBar>`** — Barra com segmentos empilhados.

Ambos usam `--color-progress-track` e `--color-progress-fill` como tokens padrão.

### Modal (`src/shared/components/Modal/`)

Overlay com backdrop blur, `Escape` para fechar, focus trap.

**Sizes:** `sm` | `md` (default) | `lg`

### Drawer (`src/shared/components/Drawer/`)

Painel lateral direito com backdrop. Usado no detalhe de tarefas (BoardDetailsPage).

### Sidebar (`src/shared/components/Sidebar/`)

Navegação colapsável com:
- Logo CA3 (ícone School + texto)
- 6 links de navegação com ícones Lucide
- Indicador de item ativo (gold #F5A623)
- Avatar do usuário + nome + email
- Botão de logout
- Botão toggle collapse

### Header (`src/shared/components/Header/`)

Barra superior com:
- Botão de menu mobile
- Campo de busca (toggle)
- Dropdown de notificações
- Avatar do usuário com menu dropdown (Configurações, Sair)

### Toast (`src/shared/components/Toast/`)

Notificações auto-dismissíveis após 4 segundos.

**Tipos:** `success` | `error` | `warning` | `info`

### Avatar (`src/shared/components/Avatar/`)

Avatar com iniciais e cor hash-based. Suporta imagem (src) ou fallback com iniciais.

**Sizes:** `sm` | `md` | `lg`
