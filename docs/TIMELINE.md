# TIMELINE.md — Experience section (02)

Technical spec for the horizontal, scrollable experience timeline. The working prototype is `docs/design-reference/portfolio-v2.dc.html` (search for `EXPERIENCE SLIDER` in the markup and `renderVals()` / `layoutSliders()` in the script) — port its behaviour, not its syntax.

## 1. Data

From `src/assets/JSONs/`:

- `experience.json` → work boxes (main lane). Fields used: `id`, `role`, `organization.name/short`, `start`, `end`, `description`, `projectIds`.
- `projects_education.json` → `education[]` → studies lanes (`laneLabel.left` / `laneLabel.right`, `start`, `end`).
- `projects/<id>.json` (via `useProjects.js`) →
  - `lane: "venture"` → BitSpace lane (`laneLabel`, `end: null` = ongoing).
  - `lane: "projects"` → shown above their work box (`experienceId`) on hover.

Dates are `"YYYY-MM"`. Convert to a month index: `year * 12 + (month - 1)`. `end: null` → current month.

**Duration conventions (match Jan's wording):**
- Duration in months = `end − start` (Feb→Jun = 4 mos; Sep 2024→Jul 2026 = 1 yr 10 mos).
- Gap between jobs = `nextStart − prevEnd − 1` (Jun→Sep = 2 mos). Gap ≤ 0 → the jobs are **joined**.
- Format: `"4 mos"`, `"1 yr"`, `"1 yr 10 mos"`, `"2 yrs 3 mos"`. Dates: `"Feb 2024"`. Ongoing end: `"Present"`.

## 2. Horizontal scale (`useTimelineScale.js` — keep pure)

All lanes share one piecewise-linear **time → x** mapping so dates line up vertically across lanes. Build it by walking the work jobs in order, starting at `T0 = earliest start of any job/education/venture`, with `x = P = 96px` (track side padding). `vpW` = the scroller's `clientWidth` (re-measure on resize).

| Piece | Width | Axis style |
|---|---|---|
| Before first job (e.g. 2021→2024, studies only) | `idleW(months)` | dashed `--color-line-dashed` |
| Job | `jobW(months)`, widened to fit its projects (below) | solid ink |
| Gap between jobs (gap > 0) | `idleW(nextStart − prevEnd)` + centred label `"2 mos"` | dashed |
| Joined jobs (gap ≤ 0) | `SEAM = 14px` | solid ink (line continues) |
| After last job, if studies run longer | `idleW(months)` | dashed |
| Future | `180px` + "FUTURE →" label | dashed accent |

```js
jobW  = m => Math.max(340, vpW * (0.14 + 0.032 * m))  // ~6 mos ≈ 1/3 screen, ~2 yrs ≈ 0.9 screen
idleW = m => Math.max(44,  vpW * 0.016 * m)
```

**Widen jobs so project titles fit.** For each project of a job:
`need = 14 + textWidth(name, '600 14px Inter') + 20 + textWidth(duration, "12px 'JetBrains Mono'") + 14 + 3 + 8`,
`inset = 6 (PROJ_GAP) + 18 if project.start == job.start + 18 if project.end == job.end`,
`jobWidth = max(jobW(m), (need + inset) * jobMonths / projectMonths)`.
Measure text with a cached canvas `measureText`; recompute after `document.fonts.ready`. Everything after a widened job shifts right automatically because x accumulates.

`X(month)` = interpolate inside the piece containing it; total track width = `x_after_future + P`.

## 3. Vertical layout (track is 372px tall, absolutely positioned children)

| Element | top | height |
|---|---|---|
| Studies lane 1 | 0 | 40 |
| Studies lane 2 | 48 | 40 |
| BitSpace lane | 96 | 40 |
| Project boxes (on hover) | 8 | 48 |
| Work boxes | 160 (64 when open) | 132 (228 when open) |
| Gap labels | 218 | — |
| Axis line | 306 | 2px |
| Tick marks | 299 | 16 (2px wide) |
| Date labels | tick + 22 | mono 12 muted |
| Project date labels (hover) | tick + 44 | mono 12 **accent** |
| Duration pills | 318, centred on job | mono 12 accent on tint, pill |

The scroller has `padding-top: 28px` (room for hover lift/glow — a horizontal scroller clips vertical overflow) and `padding-bottom: 72px` (so the area under the axis is scrollable/draggable). Section padding is `96px 0 0`.

## 4. Lanes and boxes

**Studies lanes** — `left: X(start)`, `width: X(end) − X(start)`, radius 12, fill `--color-tint` / `--color-tint-2` alternating. Left text "Engineering Student" (14/600 ink), right text degree label (mono 12 accent). Clickable → Education pop-up.

**BitSpace lane** — white fill, 1.5px accent border. Ongoing (`end: null`): extends to `futureX + 150`, no right border, left-only radius, and a mask fade `linear-gradient(to right, #000 calc(100% − 220px), transparent)` on the background layer only (texts stay crisp; right text sits 200px from the right edge). Clickable → Project pop-up (BitSpace).

**Work boxes** — radius 22, 1.5px border. Current role (start ≤ now ≤ end): accent fill, on-accent text, translucent logo tile. Others: white, `--color-line` border. Content: org (mono 12, .8 opacity) + role (Bricolage 26) top-left with `padding-top: 38px`; description (15/1.55) below, hidden (opacity 0); logo tile 72×72 radius 16 at `top: 28px; right: 22px`.

**Axis ticks** — one tick per job start and end. **Joined jobs share a single tick** at the seam centre, one centred label. Labels: start ticks left-aligned (`translateX(0)`), end ticks right-aligned (`-100%`), seam/shared `-50%`. Add ticks for education/venture starts/ends only if no tick is within 30px. Ongoing venture gets no end tick.

## 5. Sliding labels (`useSlidingLabels.js`)

Every lane/box/project has a left element **T** and a right element **L** (title & logo; "Engineering Student" & degree; name & duration). While scrolling, they stay inside the visible window and never overlap.

```
viewL = scroller.left  + inset,  viewR = scroller.right − inset,  inset = max(112, 0.12 * width) + 12
tNat  = natural left of T,  lNat = natural left of L  (offsetLeft-based, unaffected by transforms)
GAP   = 24
tx = clamp(viewL, tNat, lNat − GAP − tw)      // title follows the left edge, stops before the logo
lx = min(lNat, max(viewR − lw, tx + tw + GAP)) // logo follows the right edge, stops after the title
T.style.transform = translateX(tx − tNat);  L.style.transform = translateX(lx − lNat)
```

Run on scroll (rAF-throttled), resize, after mount, and after any re-render that changes layout. Write transforms directly to the elements (template refs) — don't route through reactive state.

## 6. Hover / open state

On `mouseenter` of a work box (`hoverJob = i`):
1. Box animates `top 160→64` and `height 132→228` (`.3s ease`) — **grows upward**, the axis never moves. Shadow `--shadow-box-open`, `z-index: 3`. Description fades in (`.25s`, `.05s` delay).
2. Upper lanes fade to `opacity: .18`.
3. Its projects render at `top: 8`, **behind** the box (`z-index: 2`), and play `projIn`: from `translateY(64px); opacity 0` to rest, `.38s cubic-bezier(.2,.7,.2,1)`, **delay .3s** (after the box is open). Box: `left = X(start) + 3 (+18 if shares job start)`, `width = X(end) − X(start) − 6 (−18 per shared edge)`, min 80. White, 1.5px accent border, radius 14, `--shadow-project`. Name (14/600, ellipsis fallback) left, duration (mono 12 accent) right.
4. Project start/end ticks not already within 8px of an existing tick appear on the second label row (accent), fading in at `.45s`.

`mouseleave` closes after **160ms**; entering a project box (or re-entering the work box) cancels the close and must not restart the projects' animation. Opening a pop-up closes the hover state.

## 7. Clickable affordance

Studies lanes, BitSpace lane and project boxes are `<button>`s. Hover/focus: `filter: drop-shadow(0 6px 14px rgba(30,77,58,.30))`, `translate: 0 −2px` (use the `translate` property — `transform` is taken by the entrance animation), lane border becomes accent, project box bg `--color-project-hover`. Focus ring: 2px accent, offset 3px.

## 8. Scrolling (`useEdgeScroll.js`)

- Scroller: `overflow-x: auto; overflow-y: hidden`, scrollbar hidden, `tabindex="0"`, `role="region"`, `aria-label`. Native trackpad/touch/Shift+wheel/arrow keys must keep working.
- **Initial position: scrolled fully to the right** (newest).
- **Edge zones:** absolutely positioned on the **section** (full section height, including next to the title), `width: max(112px, 12%)`, `z-index: 5`. Hover → continuous scroll (`requestAnimationFrame`, 7px/frame) toward that side; a shade fades in (`linear-gradient(to right|left, --edge-shade, transparent)`, `.25s`). Hidden entirely when already at that end.
- **Step buttons** inside the zones: 52px white circle, ink border, `--shadow-floating`, positioned at `bottom: 192px` (vertically centred on the work boxes). Click → `scrollBy(±420, smooth)`. Zone hover also styles the button (accent fill, scale 1.1).
- **Drag to scroll** (mouse only): pointerdown on empty space (not on `button, article, a`) captures the pointer; move sets `scrollLeft`; cursor `grab` / `grabbing`; `user-select: none` on the scroller.
- Do not hijack the vertical mouse wheel.

## 9. Detail pop-up

Clicking a project box or the BitSpace lane calls `openProject(id, { trigger, fallback })`; a studies lane calls `openEducation({ id, title, subtitle }, { trigger })` (both from `useDetailModal`). Project pop-up: `docs/PROJECT_POPUP.md`. Education is still the placeholder (see `DESIGN.md`).

## 10. Mobile notes

Hover does not exist on touch: tapping a work box should toggle its open state; edge zones are hidden on touch devices (`@media (hover: none)`), swipe scrolls natively. Minimum box width 340px keeps content readable at 390px.
