# DESIGN.md — portfolio v2

The visual language of jan-moran.com. Tokens live in `src/styles/tokens.css`; this file explains how to use them and specifies every finished component. Exact markup for each section is in `docs/design-reference/portfolio-v2.dc.html`.

**Personality:** light, calm, engineered. A warm off-white page, near-black ink, one dark green accent used with intent, a monospace voice for labels and data. No gradients-as-decoration, no emoji, no glassy effects.

---

## 1. Foundations

### Colour

| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#F6F5F0` | Page ground, cream sections |
| `--color-surface` | `#FFFFFF` | Alternate sections, cards on cream |
| `--color-tint` | `#E6EEE8` | Pale green: pills, placeholders, selected rows |
| `--color-tint-2` | `#D6E2D9` | Second pale green (alternating fills) |
| `--color-ink` | `#142019` | Headings, primary text, outlines |
| `--color-ink-2` | `#3E4A42` | Body copy, nav links |
| `--color-muted` | `#4A564E` | Labels, captions, dates |
| `--color-accent` | `#1E4D3A` | Dark green — CTAs, highlights, green sections |
| `--color-on-accent` | `#F6F5F0` | Text on green |
| `--color-line` | `#DEE2DA` | Borders, dividers |
| `--color-line-dashed` | `#A9B3AA` | Dashed timeline gaps |

Rules:
- Green is an **accent**, not a fill for everything: CTAs, one word in a heading, the current role, and three full-bleed bands (Achievements, Contact, Footer).
- On green, text is `--color-on-accent`; secondary text on green uses `opacity: .85`, never a grey.
- Section backgrounds alternate cream / white with a 1px `--color-line` border between them. Green bands break the rhythm on purpose.

| Section | Background |
|---|---|
| Nav | `--color-nav-bg` (`rgba(246,245,240,.92)`) + `backdrop-filter: blur(8px)`, bottom border |
| Hero | cream |
| 01 About | white, top + bottom border |
| 02 Experience | cream (full-bleed timeline) |
| 03 Projects | white, borders |
| 04 Achievements | green |
| 05 Skills | cream |
| 06 Gallery | white, top border |
| 07 Contact + Footer | green |

### Typography

| Role | Font | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| Hero name | Bricolage Grotesque | `--fs-hero` | 700 | .95 | -0.03em |
| Section H2 | Bricolage Grotesque | `--fs-h2` | 700 | 1.05 | -0.02em |
| About H2 | Bricolage Grotesque | `--fs-h2-about` | 700 | 1.08 | -0.02em |
| Card title | Bricolage Grotesque | 24–30px | 700 | 1.1 | -0.01em |
| Lead | Inter | 20px | 400 | 1.55 | — |
| Body | Inter | 17px | 400 | 1.6–1.7 | — |
| Small / chips | Inter | 15px | 500 | — | — |
| Section label | JetBrains Mono | 13px | 400 | — | — |
| Meta / dates | JetBrains Mono | 12px | 400 | — | 0.04–0.06em |
| Eyebrow (uppercase) | JetBrains Mono | 12px | 400 | — | 0.06–0.14em, uppercase |

Mono is the "data voice": section numbers, dates, durations, tags, codes (EN, CA…), placeholders.

### Layout & spacing

- Container: `max-width: 1200px; margin: 0 auto; padding: 0 24px`.
- Section padding: `96px` top/bottom (About uses 72px).
- **Section header pattern:** mono label `0N — Name` in accent (13px, 12px below) → H2. Optional right-aligned muted note, bottom-aligned (`flex-wrap`, `justify-content: space-between`).
- Common gaps: 8 / 10 / 12 / 14 / 16 / 20 / 24 / 32 / 40 / 48 / 56 / 64px.
- Everything wraps: use `flex-wrap` and `grid-template-columns: repeat(auto-fit, minmax(Npx, 1fr))`. No layout should need media queries except where noted.

### Radii

pill `999px` · xl `28px` (hero photo, modal) · card `22px` · md `20px` · sm `16px` · xs `14px` · lane `12px` · logo `10px`.

### Motion

- Default transition `.2–.25s ease`; box geometry `.3s ease`; entrances use `cubic-bezier(.2,.7,.2,1)`.
- Press feedback: `transform: scale(.96)` on `:active`.
- Hover styles also apply on `:focus-visible`.
- `prefers-reduced-motion: reduce` → no transitions/animations; end states only.

---

## 2. Components

### Buttons

| Variant | Rest | Hover / focus |
|---|---|---|
| **Hero CTA (filled)** — "Contact me" | accent bg, on-accent text, 1.5px accent border, h 52, pad 0 26, pill | stays accent, grows to h 58 / pad 0 32, `--shadow-button-hover` |
| **Hero CTA (outline)** — "Download CV" | transparent, 1.5px ink border, ink text | becomes accent fill + on-accent text + accent border, grows like above |
| **Social circle** (GitHub, LinkedIn, YouTube) | 52×52 circle, white bg, 1.5px ink border, 20px icon | accent fill, on-accent icon, 58×58, shadow |
| **Nav "Contact"** | accent filled pill, h 44, pad 0 20 | transparent bg, accent text, inset 1.5px accent ring |
| **Light on green** (contact email) | cream bg, ink text, h 56 | transparent, cream text, inset cream ring |

Hero buttons: `box-sizing: border-box`, `flex-shrink: 0`. Their row has a **fixed min-height of 64px** so growing buttons never move the content above (siblings may slide sideways — intended). All buttons: `:active { transform: scale(.96) }`.

### Hover underline (nav links, language code)

A 2px accent bar drawn with `background-image` that grows left→right: `background-size: 0% 2px → 100% 2px`, `.25s ease`. No `text-decoration`.

### NavBar ✅

- Sticky, translucent cream (see table), bottom border, inner container `padding: 14px 24px`, `flex-wrap`, space-between.
- Left: 36×36 accent square (radius 10) with "JM" (Bricolage 16, on-accent) + "Jan Moran Ricardo" (Bricolage 700, 22px, ink).
- Right (gap 4px 22px, 15px/500): About · Experience · Projects · Achievements · Skills · Gallery (ink-2, hover underline) · **Contact** (filled pill) · **Language picker**.
- Order of links = order of sections on the page. If sections change, update the nav.

### Language picker ✅

- Trigger: mono 14px/500 code (`EN`), small chevron (down when closed, up when open), no border, ≥44×44 target. Underline shows on hover/focus **and while open**.
- Menu: 168px wide, white, 1px line border, radius 14, `--shadow-menu`, 6px padding, opens below-right (`top: calc(100% + 10px); right: 0`).
- Rows: h 44, radius 10, gap 12: code (mono 13, accent, 24px wide) + native name (Inter 15/500). Selected row bg `--color-tint`; others hover `--color-tint-hover`. No checkmark.
- Languages: EN English · CA Català · ES Español · LT Lietuvių · DE Deutsch.
- Behaviour: click toggles; choosing closes; **Esc and outside click close** (the prototype lacked outside-click — implement it). Use `aria-haspopup`, `aria-expanded`.

### Hero ✅

- Section: `min-height: clamp(620px, calc(100vh - var(--nav-height)), 960px)`, flex-wrap row, `align-items/align-content: center`, gap 64, padding `56px 24px 112px`.
- Left column (`flex: 1 1 520px`):
  - Eyebrow: 28×2px accent rule + "Telecom & Computer Engineer · Entrepreneur" (mono 14, accent, 0.04em).
  - H1: "Jan Moran" / line break / "Ricardo" in **accent**.
  - Lead (20px, ink-2, max 540px), 28px above.
  - CTA row, 40px above: Contact me · Download CV · 1×32px divider (`--color-line-strong`, margin 0 6px) · 3 social circles.
- Right column (`flex: 0 1 400px; min-width: 260px`): photo, radius 28, aspect 519/589, cover. Behind it an accent block offset `inset: 24px -24px -24px 24px`, radius 28. Floating badge bottom-left (`left:-20px; bottom:36px`): white, radius 14, `--shadow-badge`, 10px status dot + "Open to opportunities".
- Scroll cue: centred at bottom 24px — "SCROLL" (mono 12, 0.14em, muted) + down arrow, links to `#about`.

### 01 About ✅

- Label row on its own line above both columns (so the columns' tops align).
- Two columns, `align-items: flex-start`, gap 48:
  - Left (`flex: 1.5 1 480px`): H2 "Dual engineer **& entrepreneur**" (the "& entrepreneur" in accent), then two 17px/1.7 paragraphs, ink-2, max 600px.
  - Right (`flex: 1 1 360px`), stacked 12px:
    - **Education card**: cream on white, radius 20. Header row: "EDUCATION" (mono 12 uppercase muted) + "Dual degree" outline pill (accent). Two rows split by a line: 40×40 accent icon tile (radius 12; antenna icon for Telecom, monitor for Computer) + degree (17/600) + "Universitat Autònoma de Barcelona · 2021 – 2026" (14, muted).
    - **Languages card**: cream, radius 16. "LANGUAGES" label (96px column) + codes in mono 15: **CA ES EN** at weight 700 ink, LT DE at 400 muted, each an `<abbr title="Catalan — native">`. Below a 1px line: pen icon + note (12px muted) "This site is available in every language I speak".

### 02 Experience ✅

Full spec in `docs/TIMELINE.md`. Visual summary:
- Header in the normal container; the timeline itself is **full-bleed** (edge to edge).
- Lanes top→bottom: two studies bars (pale greens), BitSpace bar (white, accent border, open-ended fade), work boxes (white; the current role in accent), axis line with dates and duration pills.
- Hover on a work box → it grows upward and shows its description; its projects slide out from behind it; upper lanes fade to 18%.
- Studies bars, BitSpace bar and project boxes are clickable → open the detail pop-up.

### Detail pop-up (placeholder) ⬜

- Fixed overlay: `rgba(20,32,25,.45)` + `blur(4px)`; click to close.
- Card: `width: min(1100px, 100%)`, `height: min(760px, 100vh - 48px)`, cream, radius 28, padding `clamp(28px, 5vw, 56px)`, `--shadow-modal`. Enters with a 16px rise + scale .97 → 1 (`.28s`).
- Content now: kind pill (PROJECT / EDUCATION — mono 12 uppercase, accent outline), title (Bricolage, `--fs-modal-title`), subtitle (17px muted), then a dashed "Under construction" panel.
- Close button: 52px circle, ink outline; hover → accent fill + rotate 90°.
- `role="dialog"`, `aria-modal`, `aria-labelledby`; focus moves into the dialog on open and back to the trigger on close; Esc closes; **lock page scroll while open**.

### Drafts (🟡 — will be redesigned)

- **03 Projects**: 3-column auto-fit grid (min 300px) of cards: 16:10 image area, mono tag line, title, summary, "View project →".
- **04 Achievements**: green band; three cream cards ("WINNER · YEAR", event name, one-line placeholder); "Also competed in" row of outline chips.
- **05 Skills**: two cards — "Core strengths" (accent, translucent chips) and "Also worked with" (white, tint chips).
- **06 Gallery**: grid `auto-fill minmax(260px,1fr)`, rows 220px, some tiles span 2; captions as white chips bottom-left.
- **07 Contact**: placeholder — big "Let's build something." + email button + dashed area.
- **Footer**: green, top hairline at 25% cream, © line + links (mono 13).

---

## 3. Accessibility checklist

- Contrast: all text/background pairs above meet 4.5:1 — don't introduce lighter greys.
- Targets ≥44px (nav links get 10px vertical padding; dots/icons sit in 44px buttons).
- Every interactive element is a `<button>` or `<a>`; icon-only ones have `aria-label`.
- Keyboard parity for hover features: timeline is focusable and arrow-key scrollable; step buttons work on click; clickable bars/boxes are buttons.
