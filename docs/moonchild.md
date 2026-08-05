# Moonchild — Matéria-Prima Bruta

> Registro fiel de **todos os dados brutos** repassados pelo Moonchild MCP na análise da cena **"Pt? Explore"** (`ffa7e7ed-0106-4164-aedc-e11a013b5033`). Este documento é a **fonte de entrada** — contém apenas o que o Moonchild expôs (valores, estilos, estrutura dos frames), **sem** decisões de design, interpretações ou criação da v2 (isso vive em `novolayout.md`).

---

## 1. Metadados da cena e frames

### 1.1 Chamadas MCP realizadas

| Chamada | Argumento | Retorno |
|---|---|---|
| `moonchild_organization_list` | — | `organizations: []` (nenhuma organização) |
| `moonchild_design_system_list` | — | `designSystems: []` (nenhum design system registrado) |
| `moonchild_scene_list` | — | 1 scene: "Pt? Explore" |
| `moonchild_scene_get` | `ffa7e7ed-0106-4164-aedc-e11a013b5033` | 6 frames (ver abaixo) |
| `moonchild_frame_get` × 3 | ids dos frames DS | Metadados + `designSystem: null` + `hasScreenshot: true` |
| `moonchild_frame_get_export` × 6 | ids de todos os frames | HTML renderizado completo, `fonts` (Google Fonts), `images: []` |
| `moonchild_frame_get_screenshot` × 3 | ids dos frames DS | PNG (não legível por este modelo) |

**Fato bruto:** nenhum frame tem design system vinculado (`designSystem: null`). Nenhum dos 6 frames possui imagens externas (`images: []`) — tudo é HTML/CSS embutido.

### 1.2 Scene

```json
{
  "id": "ffa7e7ed-0106-4164-aedc-e11a013b5033",
  "title": "Pt? Explore",
  "createdAt": "2026-08-05T12:13:58.476Z",
  "updatedAt": "2026-08-05T13:46:06.271Z",
  "publiclyReadable": false
}
```

### 1.3 Frames (posição, tamanho, id)

| # | Título | ID | x | y | w | h |
|---|---|---|---|---|---|---|
| 1 | Landing Page - Hero | `2bb2a354-57a2-4e12-b67b-82344210b849` | 200 | 0 | 1728 | 1117 |
| 2 | Landing Page - Funcionalidades | `98c31d64-129d-4847-bff8-0065e052c2c7` | 1978 | 0 | 1728 | 1117 |
| 3 | Dashboard | `a09f9dd2-b998-41f9-b9af-3a7c89ef2dae` | 3756 | 0 | 1728 | 1117 |
| 4 | DS — Cores & Tipografia | `8ab33da8-2bd6-4084-b4e5-68edc9757b58` | 200 | 1167 | 1728 | 1117 |
| 5 | DS — Espaçamentos & Grid | `e023b7ef-7e70-4a6f-9b3b-993ecd9eefb0` | 1978 | 1167 | 1728 | 1117 |
| 6 | DS — Componentes | `9dc589a9-f6db-4167-b45a-1e7d1300cebd` | 3756 | 1167 | 1728 | 1117 |

**Tamanho padrão de todos os frames:** `1728 × 1117`.

### 1.4 Fontes (identica em todos os frames)

```html
https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap
```

- Família: **Inter** (únicos pesos declarados: 300–900)
- `lang="pt-BR"` em todos os frames

---

## 2. Frame 4 — DS · Cores & Tipografia (`8ab33da8…`)

### 2.1 Bloco `:root` bruto

```css
--navy-900: #0f1f3d;
--navy-700: #1a2f5a;
--navy-500: #1e3a7a;
--navy-300: #2d5299;
--navy-100: #d0d9ee;
--amber-600: #d97706;
--amber-500: #f59e0b;
--amber-400: #fbbf24;
--amber-200: #fde68a;
--amber-50: #fffbeb;
--success: #16a34a;
--warning: #f59e0b;
--danger: #dc2626;
--info: #2563eb;
--neutral: #6b7280;
--text-primary: #0f1f3d;
--text-secondary: #6b7280;
--text-muted: #9ca3af;
--border: #e5e9f2;
--bg: #ffffff;
--bg-subtle: #f8f9fc;
```

### 2.2 Cores primárias — Navy Scale (como exibido)

| Swatch | Hex |
|---|---|
| Navy 900 | `#0f1f3d` |
| Navy 700 | `#1a2f5a` |
| Navy 500 | `#1e3a7a` |
| Navy 300 | `#2d5299` |
| Navy 100 | `#d0d9ee` |

### 2.3 Cores de destaque — Amber Scale (como exibido)

| Swatch | Hex | Marcação |
|---|---|---|
| Amber 600 | `#d97706` | — |
| Amber 500 | `#f59e0b` | **BRAND** (badge "BRAND" no frame) |
| Amber 400 | `#fbbf24` | — |
| Amber 200 | `#fde68a` | — |
| Amber 50 | `#fffbeb` | — |

### 2.4 Cores semânticas (com tags do frame)

| Nome | Hex | Tag do frame |
|---|---|---|
| Success | `#16a34a` | OK |
| Warning | `#f59e0b` | AVS |
| Danger | `#dc2626` | ERR |
| Info | `#2563eb` | INF |
| Neutral | `#6b7280` | NEU |

### 2.5 Tipografia — type scale (exatamente como documentado no frame)

| Nome | Size | Weight | Line-height | Letter-spacing | Chip |
|---|---|---|---|---|---|
| Display | 48px | Bold 700 | 1.05 | -1px | 48px · Bold 700 · lh 1.05 |
| Heading 1 | 36px | Bold 700 | 1.1 | -0.5px | 36px · Bold 700 · lh 1.1 |
| Heading 2 | 28px | SemiBold 600 | 1.15 | -0.3px | 28px · SemiBold 600 · lh 1.15 |
| Heading 3 | 22px | SemiBold 600 | 1.2 | -0.2px | 22px · SemiBold 600 · lh 1.2 |
| Body | 16px | Regular 400 | 1.6 | — | 16px · Regular 400 · lh 1.6 |
| Small | 14px | Regular 400 | 1.5 | — | 14px · Regular 400 · lh 1.5 |
| Label | 12px | Medium 500 | 1.4 | +0.1em | 12px · Medium 500 · ls 0.1em |

### 2.6 Outros fatos do frame

- Título da página: "CA3 Planner — Design System" · subtítulo "Tokens de cor e tipografia"
- Meta badges: "Inter Font Family" · "v1.0" · "Tokens"
- Textos de exemplo: "Organize o planejamento" (Display), "Dashboard" (H1), "Funcionalidades" (H2), "Quadros Kanban" (H3), "Módulos integrados que simplificam o dia a dia" (Body), "Sem cartão de crédito · Configuração em minutos" (Small), "Sistema de Gestão Pedagógica" (Label)
- Footer: logo CA3, "Design System · Tokens de Cor e Tipografia", tag "Produção", versão `v1.0.0`

---

## 3. Frame 5 — DS · Espaçamentos & Grid (`e023b7ef…`)

### 3.1 `:root` — deltas em relação ao frame 4

```css
--navy-50: #eef1f8;   /* token extra presente neste frame */
```

(demais tokens idênticos ao frame 4, incluindo `--text-secondary: #6b7280` e `--bg-subtle: #f8f9fc`)

### 3.2 Escala de espaçamento — Base 4px · 9 tokens (exibidos)

| px | Token (rótulo do frame) |
|---|---|
| 4px | xs |
| 8px | sm |
| 12px | sm+ |
| 16px | md |
| 24px | lg |
| 32px | xl |
| 48px | 2xl |
| 64px | 3xl |
| 96px | 4xl |

**Regra documentada no frame:** `space(n) = n × 4px` — "Todos os tokens são múltiplos de 4px"

### 3.3 Border Radius — 6 tokens

| px | Token | Uso (rótulo do frame) |
|---|---|---|
| 4px | radius-sm | Sutil / Input |
| 8px | radius-md | Padrão / Badge |
| 12px | radius-lg | Card / Swatch |
| 16px | radius-xl | Modal / Panel |
| 24px | radius-2xl | Pill / Chip |
| 9999px | radius-full | Avatar / Toggle |

Tabela de tokens do frame (dark card): `--radius-sm` 4px · `--radius-md` 8px · `--radius-lg` 12px · `--radius-xl` 16px · `--radius-2xl` 24px · `--radius-full` 9999px

### 3.4 Sombras / Elevation — 4 níveis

| Nome | CSS bruto | Uso (rótulo) |
|---|---|---|
| Shadow SM | `0 1px 3px rgba(15,31,61,0.06), 0 1px 2px rgba(15,31,61,0.04)` | Subtle card lift |
| Shadow MD | `0 4px 12px rgba(15,31,61,0.10), 0 2px 4px rgba(15,31,61,0.06)` | Stat card / Dropdown |
| Shadow LG | `0 10px 28px rgba(15,31,61,0.14), 0 4px 10px rgba(15,31,61,0.08)` | Modal / Popover |
| Shadow XL | `0 20px 48px rgba(15,31,61,0.18), 0 8px 18px rgba(15,31,61,0.10)` | Hero mockup float |

### 3.5 Grid System (exatamente como exibido)

| Viewport | Colunas | Gutter | Margem | Max-width | Spec |
|---|---|---|---|---|---|
| Desktop (≥1025px) | 12 | 24px | 80px | 1440px | viewport 1728px |
| Tablet (769–1024px) | 8 | 16px | 32px | — | viewport 768px |
| Mobile (≤768px) | 4 | 12px | 16px | — | viewport 430px |

### 3.6 Outros fatos

- Meta badges: "Spacing Tokens" · "v1.0" · "Layout"
- Footer: "Design System · Espaçamentos, Grid e Bordas" · versão `v1.0.0`

---

## 4. Frame 6 — DS · Componentes (`9dc589a9…`)

`:root` idêntico ao frame 4.

### 4.1 Botões

**Estrutura base:** `border-radius: 8px` · `font-weight: 600` · hover `translateY(-1px)` · active `translateY(0)`

**Variantes:**

| Variante | CSS bruto |
|---|---|
| Primary | `background: #f59e0b` · `color: #0f1f3d` · hover `#d97706` + `box-shadow 0 4px 14px rgba(245,158,11,0.4)` |
| Secondary | `background: #fff` · `color: #0f1f3d` · `border: 1.5px solid #0f1f3d` · hover bg `#f8f9fc` |
| Ghost | `background: transparent` · `color: #0f1f3d` · hover bg `#f8f9fc` color `#1e3a7a` |
| Danger | `background: #dc2626` · `color: #fff` · hover `#b91c1c` + shadow `rgba(220,38,38,0.35)` |
| Disabled | `background: #d1d5db` · `color: #9ca3af` · `cursor: not-allowed` · opacity 0.7 |

**Tamanhos:**

| Size | Font | Padding |
|---|---|---|
| SM | 12px | 7px 14px |
| MD | 14px | 10px 20px |
| LG | 16px | 13px 28px |

### 4.2 Badges / Tags (hexes exatos do frame)

| Badge | Background | Texto |
|---|---|---|
| Urgente | `#dc2626` | `#fff` |
| Alta | `#ea580c` | `#fff` |
| Média | `#e5e9f2` | navy-700 (`#1a2f5a`) |
| Baixa | `#dbeafe` | `#1d4ed8` |
| Concluída | `#16a34a` | `#fff` |
| Pendente | `#fde68a` | `#92400e` |

Base: `border-radius: 20px` · `font-size: 11px` · `font-weight: 700` · uppercase · dot 6px.

### 4.3 Cards

**Stat Card:** `radius 14px` · `padding 22px` · `border #e5e9f2` · ícone `38×38 radius 10` bg `#fffbeb` texto `#d97706` · trend badge bg `#dcfce7` texto `#16a34a` · label 11px uppercase · valor `34px/800/ls -1px` · sub 12px muted.

**Feature Card:** `radius 14px` · `padding 22px` · ícone `44×44 radius 12` bg `#f59e0b` texto `#0f1f3d` · título 15px 700 · desc 12px `#6b7280` lh 1.55.

**Task Card:** `radius 14px` · `padding 18px 20px` · título 14px 600 · tags · progress bar 4px `#f59e0b` · avatar 24px radius-full bg `#d0d9ee` texto `#1a2f5a` · nome 11px.

### 4.4 Inputs & Forms

| Estado | CSS bruto |
|---|---|
| Default | `border 1.5px #e5e9f2` · `radius 8px` · `padding 9px 13px` · font 13px · placeholder `#9ca3af` |
| Hover | `border-color #d0d9ee` |
| Focus | `border-color #1e3a7a` · `box-shadow 0 0 0 3px rgba(30,58,122,0.1)` |
| Error | `border-color #dc2626` · `box-shadow 0 0 0 3px rgba(220,38,38,0.1)` · msg 11px `#dc2626` |
| Select | mesma base + `appearance: none` + chevron SVG stroke `#9ca3af` (12×8) |
| Search | ícone à esquerda 12px · `padding-left 34px` |

**Checkbox:** `17×17` radius 4 · border 1.5px · checked bg `#0f1f3d` · indeterminate bg `#d0d9ee` border `#2d5299`.
**Radio:** `17×17` radius 50% · checked border `#0f1f3d` + ponto interno 7px `#0f1f3d`.

### 4.5 Sidebar Nav

**Estrutura:** width `220px` · bg `#0f1f3d` · radius 14 · padding `16px 12px` · logo 28×28 radius 6 bg `#f59e0b` · item: padding `9px 10px` · gap `10px` · radius `8px`.

**Estados (rgba exatos):**

| Estado | Fundo | Texto | Peso | Observações |
|---|---|---|---|---|
| Default | transparent | `rgba(255,255,255,0.65)` | 500 | ícone opaco |
| Hover | `rgba(255,255,255,0.07)` | `rgba(255,255,255,0.85)` | — | transição 150ms |
| Active | `#f59e0b` | `#0f1f3d` | 700 | item ativo |

**Tokens documentados no frame (nav tokens):** `--nav-bg: #0f1f3d` · `--nav-active-bg: #f59e0b` · `--nav-item-radius: 8px` · padding `9px 10px` · gap interno `10px` · width `220px` · transição `150ms ease` (props: bg, color).

### 4.6 Outros fatos

- Meta badges: "Inter Font Family" · "v1.0" · "Components"
- Ícones: Font Awesome (nomes usados: house, table-columns, calendar-days, users, chart-bar, gear, clipboard-list, columns, trash, check, clock, magnifying-glass, circle-exclamation)

---

## 5. Frame 3 — Dashboard (`a09f9dd2…`)

### 5.1 `:root` bruto

```css
--navy: #0f1f3d;
--navy-light: #162847;
--navy-mid: #1a2f52;
--amber: #F5A623;
--amber-bright: #FACC15;
--white: #ffffff;
--gray-light: #cbd5e1;
--gray-muted: #94a3b8;
--green: #22c55e;
--sidebar-width: 240px;
--topbar-height: 64px;
```

### 5.2 Layout (métricas brutas)

- **Sidebar:** `240px` fixa · bg navy · logo badge `40×40` amber radius 9 · nav-item padding `11px 14px` radius 9 · hover `rgba(255,255,255,0.08)` · ativo bg `#F5A623` texto navy
- **Topbar:** `64px` sticky · bg branco · borda `#e8ecf2` · título 22px 800 · subtítulo 13px `#94a3b8` · sino 38px círculo borda `#e2e8f0` · avatar 38px bg `#22c55e`
- **Content:** padding `32px 36px 48px` · bg página `#f4f6f9`
- **Stats row:** grid `4 col` gap 20 · card radius 12 padding `22px 24px` borda `#e8ecf2` · ícone `48×48` radius 11 · label 10.5px 700 uppercase `#8892a4` · valor 32px 800

**Cores de ícone dos stat cards:**

| Nome | bg | ícone |
|---|---|---|
| blue | `#eff6ff` | `#3b82f6` |
| indigo | `#eef2ff` | `#6366f1` |
| green | `#f0fdf4` | `#22c55e` |
| red | `#fff1f2` | `#ef4444` |

- **Panels row:** grid `2 col` gap 24 · panel radius 12 padding `26px 28px` · título 16px 700
- **Progress:** track 6px `#f0f2f5` radius 99 · fills: blue `#3b82f6` · amber `#F5A623` · purple `#8b5cf6` · green `#22c55e` · indigo `#6366f1`

**Badges do dashboard (diferentes dos do frame DS):**

| Badge | bg | texto |
|---|---|---|
| Média | `#f1f5f9` | `#475569` |
| Urgente | `#fee2e2` | `#dc2626` |
| Alta | `#fff7ed` | `#ea580c` |

### 5.3 Responsivo (breakpoints brutos)

| Max-width | Mudança |
|---|---|
| 1200px | sidebar → 220px · stats → 2 col |
| 900px | panels → 1 col |
| 768px | sidebar oculta · content padding `20px 16px 40px` · stats 2 col gap 12 |

### 5.4 Outros fatos

- Avisos de prazo: red `#ef4444` · orange `#f97316` · amber `#d97706` (12px, 500)
- Usuário demo: "Samuel Pereira" · `samuelrethuflay@gmail.com`

---

## 6. Frame 1 — Landing Page · Hero (`2bb2a354…`)

### 6.1 `:root` bruto

```css
--navy: #0f1f3d;
--navy-light: #162847;
--navy-mid: #1a2f52;
--amber: #F5A623;
--amber-bright: #FACC15;
--white: #ffffff;
--gray-light: #cbd5e1;
--gray-muted: #94a3b8;
--green: #22c55e;
```

### 6.2 Navbar

- bg navy · `position: sticky; top: 0` · `z-index: 100`
- inner: `max-width 1400px` · `padding 0 48px` · `height 68px`
- logo badge `38×38` amber radius 8 · texto 17px 700 branco
- links: `gap 36px` · 15px 500 · opacity 0.9 → hover 1

**Botões da navbar:**

| Botão | CSS bruto |
|---|---|
| outline branco | padding `9px 24px` · `border 1.5px rgba(255,255,255,0.7)` · radius 8 · hover borda branca + bg `rgba(255,255,255,0.06)` |
| âmbar | bg `#F5A623` · radius 8 · hover `#FACC15` + `box-shadow 0 4px 14px rgba(245,166,35,0.35)` |

### 6.3 Hero

- bg navy · `min-height: calc(100vh - 68px)` · padding `60px 0 70px`
- grid 2 col `1fr 1fr` · `gap 60px`
- eyebrow: dash `28×2` amber + texto 11.5px 700 `letter-spacing 1.5px` amber uppercase
- headline: `clamp(34px, 3.5vw, 52px)` · weight 900 · branco · `line-height 1.12` · `letter-spacing -1px`
- subtitle: 16px `#cbd5e1` · lh 1.65 · max-width 520px
- CTAs: padding `14px 28px` · radius 10 · primary amber / secondary outline `rgba(255,255,255,0.55)`
- footnote: 13px `#94a3b8`

### 6.4 Mockup de dashboard (hero right)

- `max-width 580px` · radius 16 · `box-shadow 0 30px 80px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.2)`
- titlebar bg `#f0f2f5` · padding `11px 16px` · borda `#e2e6eb`
- traffic-lights 11px: `#ff5f57` · `#febc2e` · `#28c840`
- body padding `28px 28px 32px`
- stats grid 3 col gap 16 · stat-card radius 10 borda `#e8ecf0` padding `16px 18px` · label 10.5px 600 uppercase `#8892a4` · valor 30px 800 `#0f1f3d`
- progress bar 4px `#e8ecf0` · fill `#3b82f6` (65%)

### 6.5 Responsivo

| Max-width | Mudança |
|---|---|
| 1100px | hero → 1 col · gap 48 |
| 768px | navbar `0 20px` · height 60px · links ocultos · headline 32px · CTAs empilhados · stats 1 col |

---

## 7. Frame 2 — Landing Page · Funcionalidades (`98c31d64…`)

### 7.1 `:root` — delta

```css
--bg-soft: #f5f6f8;   /* token extra deste frame */
```

(demais tokens idênticos ao frame 1, incluindo `--amber: #F5A623`)

### 7.2 Seção Funcionalidades

- section: padding `90px 0 100px` · inner `max-width 1400` · `padding 0 48`
- label: 11.5px 700 · `letter-spacing 2px` · amber · uppercase
- headline: `clamp(26px, 2.5vw, 38px)` · 800 · lh 1.2 · `letter-spacing -0.5px`
- subtitle: 16px `#94a3b8` · lh 1.6 · max-width 600px

**Feature cards:** grid `repeat(4, 1fr)` · `gap 24px`

| Propriedade | Valor |
|---|---|
| radius | 14px |
| padding | `32px 28px 36px` |
| ícone wrap | `56×56` radius 12 · bg `rgba(245,166,35,0.12)` · ícone 22px amber |
| título | 17px 700 |
| desc | 14.5px `#6b7280` · lh 1.65 |
| hover | `translateY(-4px)` + `box-shadow 0 12px 32px rgba(0,0,0,0.08)` |

### 7.3 Seção "Como funciona" (Steps)

- section bg `--bg-soft` · padding `90px 0 100px`
- grid `repeat(3, 1fr)` · conector tracejado `2px dashed #d1d5db`
- step-number: 60px · 800 · amber · `font-variant-numeric: tabular-nums` · opacity 0.85
- step-circle: 76px · branco · `border 2px #e2e8f0` · radius 50% · ícone 26px amber
- título 17px 700 · desc 14.5px lh 1.65 max-width 280px

### 7.4 Responsivo

| Max-width | Mudança |
|---|---|
| 1100px | feature cards → 2 col |
| 768px | 1 col · steps 1 col gap 48 · conector oculto |

---

## 8. Divergências de dados (fatos brutos, sem interpretação)

Registro objetivo de valores que **diferem entre frames** — só o que o Moonchild mostrou:

| Dado | Frame DS (4/5/6) | Dashboard (3) | Landing (1/2) | DESIGN-SYSTEM.md (repo) |
|---|---|---|---|---|
| Amber da marca | `#f59e0b` (BRAND) | `#F5A623` | `#F5A623` | `#ECB646` (gold-500) |
| Amber hover/bright | — | `#FACC15` | `#FACC15` | — |
| Navy de fundo | `#0f1f3d` | `#0f1f3d` | `#0f1f3d` | `#1B2452` (sidebar) |
| Success | `#16a34a` | `#22c55e` | `#22c55e` | `#22C55E` |
| Danger | `#dc2626` | `#ef4444` | — | `#EF4444` |
| Info | `#2563eb` | `#3b82f6` | — | `#3B82F6` |
| Text secondary | `#6b7280` | `#94a3b8` | `#94a3b8` | `#6B7280` |
| Badge "Alta" | bg `#ea580c` | bg `#fff7ed`/`#ea580c` | — | tokens próprios |

**Repetição exata entre frames DS (base consistente):**
- `--success: #16a34a` · `--danger: #dc2626` · `--info: #2563eb` · `--neutral: #6b7280` (frames 4 e 6)
- Espaçamento base 4px · radius `4/8/12/16/24/9999` · sombras tintadas de navy (15,31,61)

---

## 9. Estrutura HTML recorrente (fatos de todos os frames)

- Reset global: `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`
- `html, body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }`
- `.page { max-width: 1728px; min-height: 1117px; padding: 56px 80px 72px; }`
- `*:focus-visible { outline: 2px solid var(--amber-500); outline-offset: 2px; }` (frames DS e de landing)
- Header de página: título 28px 800 navy + underline 2px navy · subtítulo uppercase · meta badges
- Footer padrão: logo CA3 (mark navy 28×28 + texto) · tag "Produção" · versão `v1.0.0`

---

# PARTE B — INTERPRETAÇÕES DA V2

> As seções 1–9 registraram a **matéria-prima bruta**. Esta parte documenta as **interpretações/ decisões da v2** derivadas desses dados — o "porquê" de cada escolha e o mapeamento bruto → v2. A especificação completa e o detalhamento vivem em `novolayout.md`; aqui fica o raciocínio de interpretação sobre os dados brutos.

---

## 10. Interpretação central: um único amber de marca

### 10.1 O dado bruto (seção 8)

O Moonchild expôs **três ambers** coexistindo:
- `#f59e0b` nos frames DS (com badge **BRAND**)
- `#F5A623` nos frames Dashboard e Landing
- `#ECB646` (gold-500) no `DESIGN-SYSTEM.md` do repo

### 10.2 A interpretação V2

- Os frames DS marcam explicitamente `#f59e0b` como **BRAND** → ele é a fonte de verdade de identidade.
- Landing/Dashboard usam `#F5A623` como variação mais "quente" da mesma marca; `DESIGN-SYSTEM.md` usa um terceiro hex.
- **Decisão:** a marca passa a ter **um único hex**, `#f59e0b`, que substitui `#F5A623` e `#ECB646` em todo o sistema. `#FACC15` (amber-bright) é reinterpretado como hover brand → `--scale-accent-400`.

| Bruto | Papel nos frames | Interpretação V2 |
|---|---|---|
| `#f59e0b` | BRAND (frames DS) | `--scale-accent-500` · `--color-brand` (único) |
| `#F5A623` | amber de landing/dashboard | **obsoleto** → mapeado para `#f59e0b` |
| `#ECB646` | gold-500 do repo | **obsoleto** → mapeado para `#f59e0b` |
| `#FACC15` | hover de CTA (landing) | `--scale-accent-400` (hover brand) |
| `#d97706` | hover primary (frame DS) | `--scale-accent-600` |
| `#fbbf24` | item ativo sidebar (frame DS) | `--scale-accent-400` |

### 10.3 Impacto nos componentes que usavam os ambers antigos

- `src/modules/login/LoginPage.tsx` e `src/modules/register/RegisterPage.tsx`: `bg-[#F5A623]` / `hover:bg-[#E0951A]` → `var(--color-brand)` / `var(--color-brand-hover)`.
- Sidebar ativa (`--color-sidebar-item-active-bg`): `#f59e0b` (era `#F5A623` no dashboard).

---

## 11. Interpretação: desacoplar status do acento

### 11.1 O dado bruto (seções 2.4 e 5.1)

- Frames DS: `--warning: #f59e0b` (mesmo hex do BRAND).
- Badge "Alta": `#ea580c` (frame DS) e `#fff7ed`/`#ea580c` (dashboard) — laranja já usado como alerta.

### 11.2 A interpretação V2

- Âmbar é cor **exclusiva de marca/CTA**. Reusá-lo como "warning" faz o CTA âmbar parecer aviso.
- O Moonchild já fornecia o laranja `#ea580c` (badge Alta) como candidato natural de alerta → **warning V2 = `#ea580c`**, nunca âmbar.

| Função | Bruto (frame DS) | V2 |
|---|---|---|
| Brand/CTA | `#f59e0b` | `--scale-accent-500` / `--color-brand` |
| Warning | `#f59e0b` (era = brand) | `--color-warning: #ea580c` |
| Warning bg | — | `--color-warning-bg: #ffedd5` (derivado de `#fff7ed` do dashboard) |
| Success | `#16a34a` | `--color-success: #16a34a` + `--color-success-bg: #dcfce7` (do trend badge) |
| Danger | `#dc2626` | `--color-danger: #dc2626` + `--color-danger-bg: #fee2e2` (do badge urgente) |
| Info | `#2563eb` | `--color-info: #2563eb` + `--color-info-bg: #dbeafe` (do badge baixa) |

---

## 12. Interpretação: focus ring e contraste AA

### 12.1 O dado bruto

- Todos os frames DS/landing: `*:focus-visible { outline: 2px solid var(--amber-500); }` (âmbar sobre fundo claro).

### 12.2 A interpretação V2

- Âmbar `#f59e0b` sobre branco tem contraste ~1.7:1 → **falha WCAG AA (4.5:1)**.
- O Moonchild já expunha `#2563eb`/`#3b82f6` (info azul) com contraste suficiente → **focus ring V2 = `--color-focus-ring: #2563eb`** (info), não mais âmbar.
- Dark mode: `#60a5fa` (derivado da família info azul).

| Contexto | V1 (bruto) | V2 |
|---|---|---|
| Focus ring claro | `outline 2px amber-500` | `outline 2px #2563eb` |
| Focus ring escuro | — | `#60a5fa` |
| Texto sobre acento | navy `#0f1f3d` (dos frames) | `--color-text-on-accent: #0f1f3d` |
| Texto secundário | `#6b7280` | `#5b6472` (escurecido p/ AA sobre branco) |

---

## 13. Interpretação: escala primária Navy → `--scale-primary-*`

### 13.1 O dado bruto (seção 2.2)

Apenas 5 steps expostos: `#0f1f3d / #1a2f5a / #1e3a7a / #2d5299 / #d0d9ee`, mais `#eef1f8` (navy-50, frame 5) e `#162847/#1a2f52` (navy-light/mid, landing/dashboard).

### 13.2 A interpretação V2

- Interpolar os passos conhecidos em uma escala de 11 tons (`950→50`) para dar granularidade de token.
- Preservar os hexes exatos do Moonchild como âncoras: `900 #0f1f3d`, `700 #1a2f5a`, `500 #1e3a7a`, `300 #2d5299`, `100 #d0d9ee`, `50 #eef1f8`.
- Reinterpretar `--navy-light #162847` → `--scale-primary-800` e `--navy-mid #1a2f52` → `--scale-primary-700`.

| Âncora bruta | Fonte | V2 |
|---|---|---|
| `#0f1f3d` | todos | `--scale-primary-900` |
| `#162847` | landing/dashboard | `--scale-primary-800` |
| `#1a2f52` / `#1a2f5a` | landing / frame DS | `--scale-primary-700` |
| `#1e3a7a` | frame DS | `--scale-primary-500` |
| `#2d5299` | frame DS | `--scale-primary-300` |
| `#d0d9ee` | frame DS | `--scale-primary-100` |
| `#eef1f8` | frame DS 5 | `--scale-primary-50` |
| `#0b1220` | interpolado (mais escuro p/ overlay) | `--scale-primary-950` |

---

## 14. Interpretação: acento Amber → `--scale-accent-*`

| Âncora bruta | Fonte | V2 |
|---|---|---|
| `#d97706` | frame DS | `--scale-accent-600` |
| `#f59e0b` | frame DS (BRAND) | `--scale-accent-500` |
| `#fbbf24` / `#FACC15` | frame DS / landing | `--scale-accent-400` |
| `#fcd34d` | interpolado | `--scale-accent-300` |
| `#fde68a` | frame DS (badge pendente) | `--scale-accent-200` |
| `#fef3c7` | interpolado | `--scale-accent-100` |
| `#fffbeb` | frame DS | `--scale-accent-50` |

---

## 15. Interpretação: tipografia e números

### 15.1 O dado bruto (seção 2.5 + 6.3 + 7.2)

- Frames DS: escala de 7 passos (Display 48 → Label 12) — pesos 400/500/600/700.
- Landing: headline hero `clamp(34–52px)/900`, headline de seção `clamp(26–38px)/800`, eyebrow 11.5px/700 uppercase, step-number 60px/800 `tabular-nums`.
- Dashboard: valor de stat `32–34px/800/ls -1px`.

### 15.2 A interpretação V2

- **Juntar** a escala de dados do dashboard (valor 34px) e os textos de landing como tokens dedicados → escala de 11 passos + 6 tokens de landing (ver novolayout §4.2–4.3).
- `tabular-nums` (presente no step-number dos frames) vira **regra global** para dados numéricos.
- Adicionar face mono (`JetBrains Mono`) para IDs/prazos — **não veio dos frames**, é decisão complementar da v2.

| Bruto | V2 |
|---|---|
| valor 32–34px/800 | `--text-number: 34px · 800 · -1px · tabular-nums` |
| headline hero `clamp(34–52px)/900` | `--text-hero-headline` |
| headline seção `clamp(26–38px)/800` | `--text-section-headline` |
| eyebrow 11.5px/700/ls+1.5px | `--text-hero-label` (landing) · `--text-label` (app) |
| step-number 60px/800 | `--text-step-number` (tabular-nums) |

---

## 16. Interpretação: espaçamento, radius, sombras, grid

| Bruto (frames) | Interpretação V2 |
|---|---|
| 9 tokens `xs…4xl`, base 4px | Renomear p/ `--space-1…24` (n = n×4px); `--space-20` 80px passa a existir (margem desktop do grid) |
| radius `4/8/12/16/24/9999` | Mantidos 1:1 em `--radius-sm…full` |
| 4 sombras tintadas navy | Mantidas com leve ajuste de difusão; acrescenta `--shadow-xs` `0 1px 2px rgba(15,31,61,.04)` |
| grid 12/8/4 (gutter 24/16/12 · margin 80/32/16 · max 1440) | Mantidos 1:1 (§8.2) |
| quebras 1100/768 da landing | Adicionadas à escala de breakpoints (`--bp-1100`) |
| sidebar 240px / topbar 64px / content 32×36 | Mantidos; sidebar ganha colapso 240→72px e drawer <768px |
| container landing 1400px / padding 0 48px | Token de container da landing |

---

## 17. Interpretação: componentes

### 17.1 Botões

| Bruto (frame 6) | Interpretação V2 |
|---|---|
| 5 variantes × 3 tamanhos | Mantidos; focus ring passa a azul-info |
| hover primary `#d97706` + shadow `rgba(245,158,11,.4)` | `--color-brand-hover`; sombra mantida |
| `danger #dc2626 / hover #b91c1c` | Mantidos |

### 17.2 Badges — desambiguação dos dois conjuntos brutos

O Moonchild mostrou **dois conjuntos** de badges de prioridade:

| Prioridade | Frames DS (hex) | Dashboard (hex) | V2 (decisão) |
|---|---|---|---|
| Urgente | `#dc2626`/`#fff` | `#fee2e2`/`#dc2626` | bg `--color-danger-bg`, texto `--color-danger` |
| Alta | `#ea580c`/`#fff` | `#fff7ed`/`#ea580c` | bg `--color-warning-bg`, texto `--color-warning` |
| Média | `#e5e9f2`/navy-700 | `#f1f5f9`/`#475569` | bg `--color-neutral-bg`, texto `--color-neutral` |
| Baixa | `#dbeafe`/`#1d4ed8` | — | bg `--color-info-bg`, texto `--color-info` |
| Concluída | `#16a34a`/`#fff` | — | bg `--color-success-bg`, texto `--color-success` |
| Pendente | `#fde68a`/`#92400e` | — | bg `--scale-accent-200`, texto `--scale-accent-600` |

### 17.3 Cards, forms e nav

| Bruto | V2 |
|---|---|
| Stat card: ícone 38×38 amber-50/600, valor 34px, trend `#dcfce7`/`#16a34a` | Mantidos; valor vira `--text-number` + `tabular-nums` |
| Feature card (landing): ícone 56×56 amber 12% | Mantido; box amber brand |
| Input focus: `border #1e3a7a` + ring `rgba(30,58,122,.1)` | Ring passa a `--color-info` (azul) para AA |
| Sidebar default `rgba(255,255,255,.65)` · hover `.07`/`.85` · active `#f59e0b`/navy | Mantidos (tokens `--nav-*`); ativo `#f59e0b` |
| Nav tokens `--nav-bg #0f1f3d`, `--nav-item-radius 8px`, transição 150ms | Mantidos 1:1 |

---

## 18. Decisões v2 que NÃO vieram do Moonchild (complementares)

Para transparência: estes pontos foram adicionados pela v2 sem contraparte nos frames.

| Decisão | Motivo |
|---|---|
| `--font-mono` JetBrains Mono | dados/IDs legíveis; frames só traziam Inter |
| `--z-*` (7 níveis) | frames não documentavam z-index |
| `--duration-*` / easing | frames só mostravam transição 150ms da nav |
| Tabs, Table, Pagination, Tooltip, Empty State, Skeleton, Dropdown, Avatar-hash | componentes ausentes dos frames, necessários ao app |
| Sidebar colapsável 72px + drawer mobile | frames só tinham sidebar fixa oculta em <768px |
| `--text-h4` 18px, `--text-caption` 11px | extensão da escala para gaps encontrados no app |

---

## 19. Fonte de verdade e ordem de leitura

```
moonchild.md (este)  →  matéria-prima bruta (Parte A) + interpretações V2 (Parte B)
        │
        ▼
novolayout.md  →  especificação completa da v2 (tokens, layout, componentes, checklist, rastreabilidade)
        │
        ▼
tokens.css / index.css / componentes  →  implementação no código
```
