# CA3 Planner — Proposta de Novo Layout (Design System v2)

> Documento gerado a partir da análise dos 6 frames da cena **"Pt? Explore"** (Moonchild MCP) e do `DESIGN-SYSTEM.md` atual. Propõe a evolução do design system para a v2 — **"Foco Claro"** — com tokens revisados, nova arquitetura de layout e biblioteca de componentes ampliada.
>
> A seção [15. Rastreabilidade](#15-rastreabilidade-moonchild-mcp--contribuições-e-traceability) documenta, frame a frame, quais contribuições vieram do Moonchild e onde foram aplicadas.

---

## Índice

- [1. Análise do design system atual](#1-análise-do-design-system-atual)
- [2. Princípios da nova direção](#2-princípios-da-nova-direção)
- [3. Tokens de cor](#3-tokens-de-cor)
- [4. Tipografia](#4-tipografia)
- [5. Espaçamento](#5-espaçamento)
- [6. Border Radius](#6-border-radius)
- [7. Sombras / Elevação](#7-sombras--elevação)
- [8. Grid e breakpoints](#8-grid-e-breakpoints)
- [9. Z-index e animações](#9-z-index-e-animações)
- [10. Componentes](#10-componentes)
- [11. Arquitetura de layout](#11-arquitetura-de-layout)
- [12. Acessibilidade](#12-acessibilidade)
- [13. Mapeamento v1 → v2](#13-mapeamento-v1--v2)
- [14. Checklist de implementação](#14-checklist-de-implementação)
- [15. Rastreabilidade Moonchild MCP](#15-rastreabilidade-moonchild-mcp--contribuições-e-traceability)

---

## 1. Análise do design system atual

### 1.1 O que foi analisado

Fontes de dados utilizadas via Moonchild MCP:

| Fonte | Conteúdo |
|---|---|
| Frame `DS — Cores & Tipografia` | Paletas Navy/Amber, cores semânticas, escala tipográfica Inter |
| Frame `DS — Espaçamentos & Grid` | Tokens de espaçamento (base 4px), radius, sombras, grid 12/8/4 |
| Frame `DS — Componentes` | Botões, badges, cards, forms, sidebar nav |
| Frame `Dashboard` | Aplicação real dos tokens em layout de app |
| Frame `Landing Page - Hero` | Navbar escura, hero 2 colunas, mockup de dashboard, CTAs |
| Frame `Landing Page - Funcionalidades` | Feature cards (4 col), seção "Como funciona" (3 passos) |
| `docs/DESIGN-SYSTEM.md` | Documentação do sistema implementado (tokens.css + Tailwind) |

Todos os 6 frames foram exportados via `moonchild_frame_get_export` (HTML renderizado + Google Fonts) e tiveram seus tokens/estilos extraídos. As 3 screenshots também foram solicitadas via `moonchild_frame_get_screenshot`, mas este modelo não suporta entrada de imagem — a análise foi feita integralmente sobre o HTML exportado.

### 1.2 Identidade atual

- **Fonte:** Inter (300–900), única família.
- **Primária:** Navy (`#0f1f3d` → `#d0d9ee`), usada em sidebar, textos e destaques.
- **Acento:** Amber em **três variações convivendo**: `#f59e0b` (frames DS), `#F5A623` (landing + dashboard) e `#ECB646` (DESIGN-SYSTEM.md). Escala `#d97706` → `#fffbeb` nos frames DS.
- **Semânticas:** success `#16a34a`, warning `#f59e0b`, danger `#dc2626`, info `#2563eb`, neutral `#6b7280`.
- **Layout:** `--bg #ffffff`, `--bg-subtle #f8f9fc`, `--border #e5e9f2`, textos `#0f1f3d / #6b7280 / #9ca3af`.
- **Escala tipográfica:** Display 48 · H1 36 · H2 28 · H3 22 · Body 16 · Small 14 · Label 12 (DS) + Headline hero `clamp(34–52px)/900` e títulos de seção `clamp(26–38px)/800` (landing).
- **Espaçamento:** 9 tokens múltiplos de 4 (4→96px), nomes `xs/sm/sm+/md/lg/xl/2xl/3xl/4xl`.
- **Radius:** `sm 4 · md 8 · lg 12 · xl 16 · 2xl 24 · full 9999`.
- **Sombras:** 4 níveis tintadas de navy (SM 1px → XL 20px); mockup do hero usa `0 30px 80px rgba(0,0,0,.4)`.
- **Grid:** App Desktop 12 col (1440 max, gutter 24, margin 80) · Tablet 8 col (768, gutter 16, margin 32) · Mobile 4 col (430, gutter 12, margin 16). Landing usa container `1400px`/gutter 48 e quebras em `1100px`/`768px`.
- **Componentes:** Button (5 variantes × 3 tamanhos), Badge (6), Cards (Stat/Feature/Task), Inputs (default/focus/error/select/search/checkbox/radio), Sidebar nav (default/hover/active), + landing: Navbar, Hero, FeatureCard, Steps ("Como funciona"), mockup de dashboard.

### 1.3 Pontos fortes (manter)

1. **Família única (Inter)** — consistência e performance.
2. **Contraste navy/amber** — identidade forte e reconhecível.
3. **Base de espaçamento 4px** — escala previsível e alinhada.
4. **Grid responsivo documentado** — 12/8/4 com gutter e margin explícitos.
5. **Estados de componente documentados** (default/hover/active/focus/error).

### 1.4 Oportunidades de melhoria (endereçar na v2)

| # | Problema observado | Impacto |
|---|---|---|
| 1 | **Três ambers de marca**: `#f59e0b` (frames DS) vs `#F5A623` (landing/dashboard) vs `#ECB646` (DESIGN-SYSTEM.md). Mesmo a "cor da marca" não tem um único hex. | Inconsistência de identidade visual |
| 2 | **Conflito entre docs**: `DESIGN-SYSTEM.md` usa primária azul (`#3A58A9`/gold `#ECB646`) e os frames usam navy/amber. Implementação ≠ design. | Divergência de implementação |
| 3 | **`--amber` = `--warning`** = `#f59e0b`: o acento da marca também é cor semântica de status. Amarelo de CTA pode ser lido como aviso. | Confusão semântica |
| 4 | **Contraste de foco**: focus ring usa amber (`#f59e0b`) sobre fundos claros — relação ~1.7:1, falha WCAG AA. | Acessibilidade |
| 5 | **Tipografia de dados**: dashboards usam valores numéricos (números grandes) sem estilo dedicado (tabular-nums, face mono p/ IDs). | Legibilidade de dados |
| 6 | **Sombras com navy forte** em elevation alta geram "cinza sujo"; elevation deveria usar preto neutro + tint sutil. | Poluição visual |
| 7 | **Sidebar escura fixa em 240px** sem variante colapsada de ícone puro no mobile (oculta em <768px). | UX mobile |
| 8 | **Ausência de componentes comuns**: Tabs, Table, Pagination, Empty State, Tooltip, Skeleton. | Velocidade de produto |
| 9 | **Nomes de tokens mistos** (`--navy-*`, `--amber-*`, `--text-*`, `--space-*`, `--radius-*`). Sem escopo por família semântica. | Manutenção |

---

## 2. Princípios da nova direção

**Nome da v2: "Foco Claro"** — mesma identidade navy/amber, mas com hierarquia mais limpa, contraste confiável e tokens semanticamente nomeados.

1. **Semântica sobre cor**: tokens de *função* (`--color-primary`, `--color-accent`, `--color-danger`) e não de *tonalidade* (`--navy`, `--amber`). A escala crua fica reservada a `*--scale-*`.
2. **Um acento, um significado**: amber vira cor exclusiva de marca/CTA. Status passam a usar cores distintas (verde/azul/vermelho), nunca o âmbar puro.
3. **Contraste AA em tudo**: foco, texto sobre cor e combinações de badge verificadas.
4. **Tipografia de dados**: `tabular-nums` + face mono dedicada para números, prazos e IDs.
5. **Elevação controlada**: 4 níveis com preto neutro + tint primária sutil; sombras maiores mais difusas.
6. **Layout responsivo por colapso**: sidebar colapsável (ícone puro) e dashboard em densidade controlada.

---

## 3. Tokens de cor

### 3.1 Escala primária (azul-índigo profundo)

Substitui `--navy-*`. Mais frio e mais escuro para o contraste de texto.

| Token | Hex | Uso |
|---|---|---|
| `--scale-primary-950` | `#0b1220` | Fundo sidebar, overlay escuro |
| `--scale-primary-900` | `#0f1f3d` | Navegação, títulos |
| `--scale-primary-800` | `#16294e` | Sidebar hover |
| `--scale-primary-700` | `#1e3666` | Bordas ativas |
| `--scale-primary-600` | `#27438a` | Links, hover |
| `--scale-primary-500` | `#3154a8` | Ações secundárias |
| `--scale-primary-400` | `#4f6fc4` | Ícones |
| `--scale-primary-300` | `#7d94d8` | Borda leve |
| `--scale-primary-200` | `#aebee9` | Background hover |
| `--scale-primary-100` | `#d8e1f5` | Background leve |
| `--scale-primary-50`  | `#f0f3fb` | Background muito leve |

### 3.2 Escala de acento (âmbar — apenas marca/CTA)

| Token | Hex | Uso |
|---|---|---|
| `--scale-accent-600` | `#b45309` | Hover de CTA, texto sobre acento |
| `--scale-accent-500` | `#f59e0b` | **BRAND** · CTA primária |
| `--scale-accent-400` | `#fbbf24` | Item ativo sidebar |
| `--scale-accent-300` | `#fcd34d` | Destaque suave |
| `--scale-accent-200` | `#fde68a` | Badge pendente (fundo) |
| `--scale-accent-100` | `#fef3c7` | Background hover brand |
| `--scale-accent-50`  | `#fffbeb` | Fundo de ícone brand |

### 3.3 Cores semânticas (status) — desacopladas do acento

| Token | Hex | Uso |
|---|---|---|
| `--color-success` | `#16a34a` | Concluído, ok |
| `--color-success-bg` | `#dcfce7` | Badge sucesso |
| `--color-warning` | `#ea580c` | Atenção (laranja, **não** âmbar) |
| `--color-warning-bg` | `#ffedd5` | Badge alerta |
| `--color-danger` | `#dc2626` | Erro, exclusão |
| `--color-danger-bg` | `#fee2e2` | Badge perigo |
| `--color-info` | `#2563eb` | Informação |
| `--color-info-bg` | `#dbeafe` | Badge info |
| `--color-neutral` | `#6b7280` | Neutro |
| `--color-neutral-bg` | `#f3f4f6` | Badge neutro |

### 3.4 Cores de layout

| Token | Hex | Uso |
|---|---|---|
| `--color-bg` | `#ffffff` | Superfícies |
| `--color-bg-subtle` | `#f7f8fb` | Seções alternadas |
| `--color-bg-page` | `#f4f6fa` | Fundo de página de app |
| `--color-border` | `#e5e9f0` | Bordas de card/input |
| `--color-border-strong` | `#cdd4e0` | Divisões hierárquicas |
| `--color-text-primary` | `#0f1f3d` | Texto principal |
| `--color-text-secondary` | `#5b6472` | Texto secundário (mais escuro que `#6b7280` p/ AA) |
| `--color-text-muted` | `#8491a5` | Texto desabilitado |
| `--color-text-on-accent` | `#0f1f3d` | Texto sobre acento |
| `--color-text-on-dark` | `#ffffff` | Texto sobre primária escura |

### 3.5 Grays neutros (slate)

| Token | Hex |
|---|---|
| `--gray-50` | `#f9fafb` |
| `--gray-100` | `#f3f4f6` |
| `--gray-200` | `#e5e7eb` |
| `--gray-300` | `#d1d5db` |
| `--gray-400` | `#9ca3af` |
| `--gray-500` | `#6b7280` |
| `--gray-600` | `#4b5563` |
| `--gray-700` | `#374151` |
| `--gray-800` | `#1f2937` |
| `--gray-900` | `#111827` |

### 3.6 Tokens extraídos dos frames de landing (v1 → v2)

Tokens que existem na landing e no dashboard e não estavam nos frames DS:

| v1 (landing/dashboard) | Hex | v2 |
|---|---|---|
| `--amber` (landing/dashboard) | `#F5A623` | → `--scale-accent-500` (padronizado em `#f59e0b`) |
| `--amber-bright` | `#FACC15` | → `--scale-accent-400` (hover de CTA) |
| `--navy-light` | `#162847` | → `--scale-primary-800` |
| `--navy-mid` | `#1a2f52` | → `--scale-primary-700` |
| `--gray-light` | `#cbd5e1` | → `--gray-300` (texto claro sobre navy) |
| `--gray-muted` | `#94a3b8` | → `--gray-400` (subtexto sobre navy) |
| `--green` | `#22c55e` | → `--color-success` (variante mais clara p/ ícones) |
| `--bg-soft` | `#f5f6f8` | → `--color-bg-page` |

**Decisão v2:** a marca passa a ter **um único amber** (`#f59e0b`), substituindo `#F5A623` e `#ECB646`. `#FACC15` vira o hover brand (`--scale-accent-400`).

---

## 4. Tipografia

### 4.1 Fontes

| Token | Valor |
|---|---|
| `--font-primary` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| `--font-mono` | `'JetBrains Mono', 'SFMono-Regular', Consolas, monospace` |

**Números de dados:** usar `font-variant-numeric: tabular-nums` em toda estatística, valor de card e prazo.

### 4.2 Escala tipográfica (unificada v1 → v2)

| Token | Size | Weight | Line-height | Letter-spacing | Uso |
|---|---|---|---|---|---|
| `--text-display` | 48px | 700 | 1.05 | -1px | Hero / landing |
| `--text-h1` | 36px | 700 | 1.1 | -0.5px | Título de página |
| `--text-h2` | 28px | 600 | 1.15 | -0.3px | Título de seção |
| `--text-h3` | 22px | 600 | 1.2 | -0.2px | Título de card |
| `--text-h4` | 18px | 600 | 1.3 | 0 | Subtítulo de card |
| `--text-body` | 16px | 400 | 1.6 | 0 | Parágrafo |
| `--text-small` | 14px | 400 | 1.5 | 0 | Texto auxiliar |
| `--text-label` | 12px | 500 | 1.4 | +0.1em | Label uppercase |
| `--text-caption` | 11px | 500 | 1.4 | +0.04em | Metadata |
| `--text-number` | 34px | 800 | 1 | -1px | Valor de stat (tabular-nums) |

### 4.3 Tipografia da landing (extraída dos frames)

Padrões presentes apenas nos frames de landing e incorporados à v2:

| Token | Spec | Uso |
|---|---|---|
| `--text-hero-headline` | `clamp(34px, 3.5vw, 52px)` · 900 · lh 1.12 · ls -1px | Título do hero (sobre navy) |
| `--text-section-headline` | `clamp(26px, 2.5vw, 38px)` · 800 · lh 1.2 · ls -0.5px | Título de seção (Funcionalidades / Como funciona) |
| `--text-hero-label` | 11.5px · 700 · uppercase · ls +1.5px · amber | Eyebrow acima do título |
| `--text-step-number` | 60px · 800 · amber · `tabular-nums` | Numeração "01/02/03" em Como funciona |
| `--text-feature-title` | 17px · 700 | Título de feature card |
| `--text-feature-desc` | 14.5px · 400 · lh 1.65 · `--color-text-secondary` | Descrição de feature card |

### 4.4 Pesos

`400 regular · 500 medium · 600 semibold · 700 bold · 800 extrabold`

---

## 5. Espaçamento

Mesma base 4px (mantida), com **nomes numéricos** alinhados ao Tailwind e renomeação das antigas:

| v2 Token | Valor | v1 (frames) | Uso |
|---|---|---|---|
| `--space-1` | 4px | xs | Icon gap |
| `--space-2` | 8px | sm | Gap entre ícone/texto |
| `--space-3` | 12px | sm+ | Input padding compacto |
| `--space-4` | 16px | md | Padding padrão |
| `--space-6` | 24px | lg | Gutter de grid / gap de seção |
| `--space-8` | 32px | xl | Margem de tablet |
| `--space-12` | 48px | 2xl | Padding de seção |
| `--space-16` | 64px | 3xl | Bloco de seção grande |
| `--space-20` | 80px | — | Margem desktop do grid |
| `--space-24` | 96px | 4xl | Padding de hero |

Regra: `space(n) = n × 4px`. Todo espaçamento usa a escala — nunca valores soltos.

---

## 6. Border Radius

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | 4px | Input, checkbox |
| `--radius-md` | 8px | Button, badge, select |
| `--radius-lg` | 12px | Card, stat, dropdown |
| `--radius-xl` | 16px | Modal, drawer |
| `--radius-2xl` | 24px | Sidebar collapsed, pill de página |
| `--radius-full` | 9999px | Avatar, toggle, tag |

---

## 7. Sombras / Elevação

Preto neutro com tint primária mínima; elevações altas mais difusas.

| Token | Valor | Uso |
|---|---|---|
| `--shadow-xs` | `0 1px 2px rgba(15,31,61,0.04)` | Divisão sutil |
| `--shadow-sm` | `0 1px 3px rgba(15,31,61,0.06), 0 1px 2px rgba(15,31,61,0.04)` | Card leve |
| `--shadow-md` | `0 4px 12px rgba(15,31,61,0.10), 0 2px 4px rgba(15,31,61,0.05)` | Stat card, dropdown |
| `--shadow-lg` | `0 10px 28px rgba(15,31,61,0.13), 0 4px 10px rgba(15,31,61,0.06)` | Modal, popover |
| `--shadow-xl` | `0 20px 48px rgba(15,31,61,0.16), 0 8px 18px rgba(15,31,61,0.08)` | Hero mockup |

---

## 8. Grid e breakpoints

### 8.1 Breakpoints

| Token | Largura | Uso |
|---|---|---|
| `--bp-sm` | 640px | Mobile landscape |
| `--bp-md` | 768px | Tablet portrait |
| `--bp-lg` | 1024px | Tablet landscape / desktop pequeno |
| `--bp-xl` | 1280px | Desktop |
| `--bp-2xl` | 1536px | Desktop largo |

### 8.2 Grid por viewport (mantido da v1)

| Viewport | Colunas | Gutter | Margin | Max-content |
|---|---|---|---|---|
| Desktop ≥1025px | 12 | 24px | 80px | 1440px |
| Tablet 769–1024px | 8 | 16px | 32px | — |
| Mobile ≤768px | 4 | 12px | 16px | — |

### 8.3 Layout de app (novo)

- **Sidebar colapsável:** 240px expandida → 72px colapsada (ícone + tooltip). No mobile (<768px) vira drawer sobreposto.
- **Topbar fixa:** 64px, sticky, com título + busca + notificações + avatar.
- **Área de conteúdo:** `padding: 32px 36px` (desktop), `20px 16px` (mobile).
- **Densidade:** cards de métrica em grid `repeat(4, 1fr)` → `repeat(2, 1fr)` no tablet → `repeat(2, 1fr)` gap reduzido no mobile.

### 8.4 Layout da landing (extraído dos frames)

| Elemento | Spec (frames) |
|---|---|
| Container | `max-width: 1400px`, `padding: 0 48px` (mobile: `0 20px`) |
| Navbar | Navy (`--navy`), sticky `top:0`, altura `68px` (mobile `60px`), links com `gap: 36px`, CTAs `Entrar` (outline branco) + `Criar conta` (amber) |
| Hero | Fundo navy, `min-height: calc(100vh - 68px)`, grid 2 col `1fr 1fr` com `gap: 60px`; colapsa p/ 1 col em `≤1100px` |
| Feature cards | Grid `repeat(4, 1fr)` `gap: 24px` → 2 col em `≤1100px` → 1 col em `≤768px` |
| Steps ("Como funciona") | Grid `repeat(3, 1fr)` + conector tracejado (`2px dashed #d1d5db`); colapsa p/ 1 col em `≤768px` |
| Quebras | `≤1100px` (hero/features) · `≤768px` (navbar sem links, tudo empilhado) |

Estas quebras passam a compor os tokens de breakpoint da v2: `1100px` entra como `--bp-1100` (hero/landing) além da escala da seção 8.1.

---

## 9. Z-index e animações

### 9.1 Z-index

| Token | Valor | Uso |
|---|---|---|
| `--z-base` | 1 | Conteúdo |
| `--z-dropdown` | 100 | Menus, selects |
| `--z-sticky` | 200 | Topbar, sidebar |
| `--z-overlay` | 300 | Backdrop |
| `--z-modal` | 400 | Modal, drawer |
| `--z-toast` | 500 | Toast |
| `--z-tooltip` | 600 | Tooltip |

### 9.2 Animações

| Token | Valor |
|---|---|
| `--duration-fast` | 150ms |
| `--duration-normal` | 250ms |
| `--duration-slow` | 350ms |
| `--easing-default` | ease-in-out |

**Focus ring (corrigido p/ AA):** `outline: 2px solid var(--color-info); outline-offset: 2px` sobre fundos claros; sobre acento usar `--scale-primary-900`.

---

## 10. Componentes

### 10.1 Mantidos (refinados)

| Componente | Mudança |
|---|---|
| **Button** | Focus ring azul; `danger` ganha `--color-danger-bg` sutil; `primary` segue amber brand |
| **Badge** | Status com cores desacopladas do acento (sucesso verde, alerta laranja, urgente vermelho, média azul, baixa azul-claro, pendente âmbar-claro) |
| **StatCard** | Número em `--text-number` com `tabular-nums`; trend mantém verde/vermelho |
| **FeatureCard** | Ícone em box amber brand com texto navy |
| **TaskCard** | Progresso em amber; meta com face mono p/ datas |
| **Input / Select** | Focus ring azul; borda de erro vermelha; altura 40px padrão |
| **Checkbox / Radio** | Checkbox cheio navy; radio navy; indeterminate navy-claro |
| **Sidebar nav** | 3 estados documentados; item ativo amber; colapso 72px |
| **Card** | Radius `lg`, borda `--color-border`, hover `--shadow-md` |

### 10.2 Novos componentes

| Componente | Spec básico |
|---|---|
| **Tabs** | Rótulo 14/600; underline 2px primária no ativo; divider `--color-border` |
| **Table** | Header `--text-label` muted; linha hover `--color-bg-subtle`; separador `--color-border` |
| **Pagination** | Botões 32×32, radius `md`; ativo preenchido primária; desabilitado muted |
| **Tooltip** | Fundo `--scale-primary-950`, texto branco, radius `md`, `--z-tooltip` |
| **Empty State** | Ilustração 96px muted, título H3, descrição `--text-small`, CTA ghost |
| **Skeleton** | `--color-bg-subtle` com pulse 1.2s; usado em loading |
| **ProgressBar** | Track `--gray-200`, fill acento; 4px altura |
| **Dropdown menu** | Card branco, `--shadow-lg`, radius `lg`, item hover `--color-bg-subtle` |
| **Avatar** | `radius-full`; cores hash: rosa `#d6336c`, laranja `#e8952d`, azul `#4361ee`, verde `#2fa84f` |

### 10.3 Componentes da landing (novos — extraídos dos frames)

| Componente | Spec (frames de landing) |
|---|---|
| **Navbar** | Navy, sticky, 68px, logo 38×38 amber radius 8 + nome 17/700; links gap 36; hover opacity 0.9→1 |
| **Navbar CTA — outline branco** | Borda `1.5px rgba(255,255,255,.7)`, radius 8, padding 9×24, hover borda branca + bg `rgba(255,255,255,.06)` |
| **Navbar CTA — amber** | Bg `#F5A623`, texto navy 700, hover `#FACC15` + shadow `0 4px 14px rgba(245,166,35,.35)` |
| **Hero** | Fundo navy; eyebrow amber (dash 28×2 + texto 11.5/700/uppercase); headline `clamp(34–52px)/900` branco; subtitle 16 `#cbd5e1` lh 1.65; CTAs 14×28 radius 10; footnote `#94a3b8` 13px |
| **Mockup de dashboard** | Card branco radius 16, shadow `0 30px 80px rgba(0,0,0,.4)`; titlebar `#f0f2f5` com traffic-lights (#ff5f57/#febc2e/#28c840); stats 3 col; progress bar 4px `#3b82f6` |
| **FeatureCard (landing)** | Radius 14, padding 32×28×36, ícone 56×56 radius 12 bg `rgba(245,166,35,.12)` + ícone amber 22px; hover `translateY(-4px)` + shadow `0 12px 32px rgba(0,0,0,.08)` |
| **Steps / "Como funciona"** | Número 60px 800 amber `tabular-nums`; círculo 76px branco borda `#e2e8f0` shadow leve; conector tracejado entre colunas |
| **Eyebrow de seção** | 11.5px · 700 · uppercase · ls +2px · amber, centralizado |

### 10.4 Convenção de nomenclatura

```
[componente]--[variante|estado]  ex.: button--primary, badge--success, nav-item--active
```

---

## 11. Arquitetura de layout

### 11.1 Estrutura da aplicação

```
┌─────────────────────────────────────────────────────┐
│  Topbar 64px (sticky) — título · busca · notif · av │
├──────────┬──────────────────────────────────────────┤
│ Sidebar  │  Content-area                            │
│ 240/72px │  padding 32×36                          │
│ (dark)   │  ┌────────────────────────────────────┐  │
│          │  │ Stats row   (4 → 2 col responsive) │  │
│          │  ├────────────────────────────────────┤  │
│          │  │ Panels row  (2 → 1 col)            │  │
│          │  ├────────────────────────────────────┤  │
│          │  │ Panels row  (2 → 1 col)            │  │
│          │  └────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────┘
```

### 11.2 Responsivo

| Breakpoint | Sidebar | Stats | Panels | Padding conteúdo |
|---|---|---|---|---|
| ≥1200px | 240px | 4 col | 2 col | 32×36px |
| 769–1200px | 240px | 2 col | 2 col | 28×28px |
| 769–1024px | 240px | 2 col | 1 col | 24×24px |
| ≤768px | drawer | 2 col | 1 col | 20×16px |

### 11.3 Arquitetura da landing (extraída dos frames)

```
┌────────────────────────────────────────────┐
│  Navbar (navy, sticky, 68px)               │
│  logo · links (gap 36) · [Entrar][Criar]   │
├────────────────────────────────────────────┤
│  HERO (navy) — 2 col:                      │
│  │ eyebrow amber · headline clamp 34–52px  │
│  │ subtitle · CTAs · footnote  │  Mockup   │
│  │ (dashboard card 580px max)  │  (shadow  │
│  │                             │  30×80)   │
├────────────────────────────────────────────┤
│  FUNCIONALIDADES (branco, 90–100px v)      │
│  headline 26–38px · feature cards 4 col    │
├────────────────────────────────────────────┤
│  COMO FUNCIONA (#f5f6f8, 3 passos)         │
│  número 60px amber · círculo 76px ·        │
│  conector tracejado                        │
└────────────────────────────────────────────┘
```

Responsivo: hero 2→1 col em `≤1100px`; features 4→2→1 col; navbar esconde links em `≤768px`.

---

## 12. Acessibilidade

1. **Contraste AA (4.5:1)** para texto em todas as combinações de tokens.
2. **Focus visível** em todos os componentes interativos (2px + offset, cor azul-info).
3. **Alvo de toque mínimo 40×40px** em botões e itens de navegação.
4. **`tabular-nums`** em dados numéricos.
5. **Estados de erro** com texto + ícone (não só cor).
6. **Reduced motion**: respeitar `prefers-reduced-motion` (desativar hover lift e pulse).

---

## 13. Mapeamento v1 → v2

### 13.1 Cores

| v1 (frames) | v2 | v1 (DESIGN-SYSTEM.md) |
|---|---|---|
| `--navy-900` | `--scale-primary-900` / `--color-text-primary` | `--color-primary-900 #192856` |
| `--navy-700` | `--scale-primary-700` | `--color-primary-700 #2C458C` |
| `--navy-500` | `--scale-primary-500` | `--color-primary-500 #4B6CC4` |
| `--amber-500` | `--scale-accent-500` / `--color-brand` | `--color-gold-500 #ECB646` |
| `--amber-400` | `--scale-accent-400` | `--color-sidebar-item-active-bg #F5A623` |
| `--success #16a34a` | `--color-success` | `--color-success-500 #22C55E` |
| `--danger #dc2626` | `--color-danger` | `--color-danger-500 #EF4444` |
| `--info #2563eb` | `--color-info` | `--color-info-500 #3B82F6` |
| `--neutral #6b7280` | `--color-neutral` | `--gray-500` |
| `--text-secondary #6b7280` | `--color-text-secondary #5b6472` | `--color-text-secondary #6B7280` |

### 13.2 Outros

| Domínio | v1 | v2 |
|---|---|---|
| Font | Inter | Inter + JetBrains Mono (dados) |
| Escala tipográfica | 7 passos | 11 passos + 6 tokens de landing |
| Espaçamento | `xs…4xl` | `--space-1…24` |
| Sombras | 4 níveis | 5 níveis (acrescenta `xs`) |
| Z-index | — | 7 níveis documentados |
| Grid app | 12/8/4 col | mantido + sidebar colapsável |
| Grid landing | — | container 1400px, quebras 1100/768 |
| Componentes | 8 (DS) | 17 app + 7 landing (Navbar, Hero, Mockup, FeatureCard, Steps, Eyebrow, CTA-extra) |

---

## 14. Checklist de implementação

- [ ] Substituir `:root` em `src/shared/styles/tokens.css` pelos tokens v2
- [ ] Atualizar `@theme` em `src/index.css` (Tailwind) com os novos nomes
- [ ] Unificar o amber da marca em `#f59e0b` (remover `#F5A623` e `#ECB646`)
- [ ] Corrigir focus ring de amber → azul-info em todos os componentes
- [ ] Desacoplar `--color-warning` de `#f59e0b` → `#ea580c`
- [ ] Adicionar `font-variant-numeric: tabular-nums` nos valores de KPI e step-number
- [ ] Criar sidebar colapsável (240px ↔ 72px) e drawer no mobile
- [ ] Implementar novos componentes de app: Tabs, Table, Pagination, Tooltip, Empty State, Skeleton, Dropdown
- [ ] Implementar componentes de landing: Navbar, Hero, Mockup, FeatureCard, Steps, Eyebrow, CTAs
- [ ] Adicionar breakpoints de landing (`--bp-1100`) e container 1400px
- [ ] Revisar contraste das combinações de badge (AA)
- [ ] Atualizar `docs/DESIGN-SYSTEM.md` para refletir a v2
- [ ] Padronizar nomes de tokens por família semântica (remover `--navy-*` / `--amber-*`)

---

## 15. Rastreabilidade Moonchild MCP — contribuições e traceability

Todas as fontes primárias foram obtidas via MCP (`moonchild_scene_get` → `moonchild_frame_get_export`). Nenhuma seção abaixo vem do `DESIGN-SYSTEM.md` (repo); quando algo também existe na doc do repo, a coluna "Origem" indica ambas.

### 15.1 Chamadas MCP realizadas

| Chamada | Retorno |
|---|---|
| `moonchild_scene_get` (ffa7e7ed…) | Scene "Pt? Explore" + 6 frames com títulos/posições/tamanhos |
| `moonchild_frame_get_export` × 6 | HTML renderizado, CSS e Google Fonts de todos os frames |
| `moonchild_frame_get_screenshot` × 3 | PNGs (não legíveis por este modelo — análise via HTML) |
| `moonchild_organization_list` / `moonchild_design_system_list` | Vazios (sem org/DS cadastrados) — base para detectar que não há DS vinculado aos frames |

### 15.2 Frame → contribuição → seção do documento

| Frame | Contribuição extraída | Seção aplicada |
|---|---|---|
| **DS — Cores & Tipografia** | Paleta navy `#0f1f3d…#d0d9ee`, amber `#d97706…#fffbeb`, semânticas (success/warning/danger/info/neutral), escala tipográfica Inter (Display 48 → Label 12), brand amber `#f59e0b` | 1.2 · 3.1 · 3.2 · 3.3 · 4.2 · 13.1 |
| **DS — Espaçamentos & Grid** | Tokens de espaço `xs…4xl` (base 4px), radius `sm…full`, 4 sombras tintadas de navy (CSS completo), grid 12/8/4 com gutter/margin/max-width | 1.2 · 5 · 6 · 7 · 8.2 · 13.2 |
| **DS — Componentes** | Variantes/tamanhos de botão, badges de prioridade (hex exatos), Stat/Feature/Task cards, inputs com estados, sidebar nav default/hover/active com rgba e tokens `--nav-*` | 1.2 · 10.1 · 10.4 |
| **Dashboard** | Layout real do app: sidebar 240px, topbar 64px, stats 4 col, painéis 2 col, `--amber #F5A623`, `--green #22c55e`, responsivo 1200/900/768 | 1.2 · 8.3 · 11.1 · 11.2 · 3.6 |
| **Landing Page - Hero** | Navbar sticky navy 68px, hero 2 col, eyebrow amber, headline `clamp(34–52px)/900`, CTAs (outline branco / amber), mockup de dashboard com shadow `0 30px 80px`, tokens `--navy-light/-mid/--amber-bright` | 4.3 · 8.4 · 10.3 · 11.3 · 3.6 |
| **Landing Page - Funcionalidades** | Feature cards 4 col (ícone 56×56 amber 12%, hover -4px), seção "Como funciona" com steps (número 60px 800 `tabular-nums`, círculo 76px, conector tracejado), `--bg-soft #f5f6f8`, quebras 1100/768 | 4.3 · 8.4 · 10.3 · 11.3 · 3.6 |

### 15.3 Descobertas que só foram possíveis pelo MCP

1. **Três ambers de marca** (`#f59e0b` vs `#F5A623` vs `#ECB646`) — só detectável confrontando os 6 frames entre si.
2. **Âmbar duplicado como status** (`--amber-500` = BRAND e `--warning`) — evidente nos `:root` dos frames DS e Dashboard.
3. **Specs exatas de badges de prioridade** — hexes de urgente/alta/média/baixa/concluída/pendente nos frames DS.
4. **Grid responsivo com valores precisos** e **sombras com CSS completo** — não documentados no repo.
5. **Métricas do layout de app real** (sidebar/topbar/stats) — só no frame Dashboard.
6. **Padrões de landing completos** (navbar, hero, mockup, steps) — ausentes do repo.

### 15.4 Limitações da análise MCP

- O MCP Moonchild é **somente leitura** (get/list/search) — não há ferramenta de criação/edição de design system, por isso a entrega é este documento de proposta.
- `moonchild_organization_list` e `moonchild_design_system_list` retornaram vazio: não existem organizações/DS registrados no ambiente consultado.
- Screenshots foram baixadas mas não puderam ser analisadas (modelo sem suporte a imagem); toda extração foi feita sobre o HTML exportado, que já embute os valores exatos de tokens e estilos.
