# PROJECT_POPUP.md — project detail pop-up

Spec for the pop-up that opens when a visitor clicks a **project box** on the experience timeline or the **BitSpace lane**. Visual reference:

- `docs/design-reference/portfolio-v2.dc.html` — working prototype. Search for `PROJECT =====` (markup) and `Pop-up view model` / `animateOpen` / `closePop` (logic). Port its values and behaviour, not its template syntax.
- `docs/design-reference/project-popup-desktop.dc.html` and `project-popup-mobile.dc.html` — static, full-content mock-ups (unscrolled) of the desktop and mobile layouts.

Tokens and general rules: `DESIGN.md`. Timeline integration: `docs/TIMELINE.md`.

---

## 1. Data

### Files

One file per project in `src/assets/JSONs/projects/<id>.json`. Files starting with `_` (e.g. `_template.json`) are **not** projects — skip them.

Load them all at build time:

```js
const files = import.meta.glob('@/assets/JSONs/projects/[!_]*.json', { eager: true, import: 'default' })
export const projects = Object.values(files)
```

This **replaces the `projects` array in `projects_education.json`** — move education to its own `education.json` (or keep `projects_education.json` with only `education`) and update the timeline to read projects from the new loader. Validate on load in dev: warn (console) about a missing `id`/`title`, duplicate ids, unknown `experienceId`, bad dates.

### Schema (only `id` and `title` are required)

| Field | Type | Notes |
|---|---|---|
| `id` | string | unique, kebab-case |
| `title` | string | |
| `tagline` | string | one sentence under the title; falls back to `summary` |
| `summary` | string | short; used where space is tight |
| `experienceId` | string \| null | id in `experience.json`; null = independent |
| `lane` | `"projects"` \| `"venture"` | `projects`: shown above its work box on hover. `venture`: own lane (BitSpace) |
| `laneLabel` | `{left,right}` | venture lanes only |
| `relatedProjectIds` | string[] | not displayed yet |
| `start`, `end` | `"YYYY-MM"` \| null | |
| `ongoing` | boolean | `end: null` + `ongoing: true` = still running; `end: null` alone = unknown end |
| `role`, `context` | string | |
| `overview` | string[] | paragraphs |
| `media` | item[] | see §4 |
| `highlights` | `{label,title,text}`[] | “How it works” steps |
| `outcomes` | `{value,label}`[] | result figures |
| `skills` | string[] | |
| `links` | `{label,url,type}`[] | type: `code` `demo` `video` `report` `post` `website` `other` |

### Paths in `media[].src`, `media[].poster`, `links[].url`

The JSON files contain work-in-progress paths (some like `/src/assets/...`, some bare names like `fotoOutput1`). **`/src/...` paths do not exist in a production Vite build.** Normalise:

1. Put every project asset in `public/projects/<project-id>/` (images, mp4s, posters, PDFs) — keep file names, fix obviously misspelled ones only if Jan agrees.
2. Rewrite each path in the JSON to `/projects/<project-id>/<file>` (with extension).
3. External links (`https://…`) stay as they are.
4. If a referenced file can't be found in the repo, leave the path, add it to a list, and **report that list to Jan** at the end — don't invent files.

## 2. Adaptive layout — show only what exists

Treat a field as present when it's a non-empty string / non-empty array. Nothing renders an empty heading, empty card or “undefined”.

| Block | Shown when | Notes |
|---|---|---|
| Kind pill “PROJECT” | always | |
| Experience chip “IEEC · Engineering Intern” | `experienceId` resolves | `org.short + ' · ' + role` from experience.json |
| Tagline | `tagline` or `summary` | |
| Facts strip | ≥1 of Dates, Duration, My role, Context | grid with exactly N equal columns (1–4); 2 columns on mobile |
| — Dates | `start` | `Feb 2024 – Jun 2024` · `May 2025 – Present` (ongoing) · `Feb 2024` (start only) |
| — Duration | `start` and (`end` or `ongoing`) | months = end − start (same rule as the timeline); ongoing adds “ so far” |
| Media viewer | `media` has ≥1 valid item | thumbnails + “1 / N” counter only when N ≥ 2; caption only if the item has one |
| Overview | `overview` | one `<p>` per paragraph |
| How it works | `highlights` | `<ol>` of cards, `repeat(auto-fit, minmax(240px, 1fr))`; number label `01 · Hardware` |
| Outcome | `outcomes` | cards `repeat(auto-fit, minmax(160px, 1fr))`; first card accent-filled |
| “On its way” note | none of media / overview / highlights / outcomes | dashed box: “More about this project — images, details and results — is on its way.” |
| Prev / next | the project has neighbours among projects of the same `experienceId` (sorted by `start`) | each side independent |
| Sidebar | ≥1 of the three cards below | otherwise main column goes full width |
| — Built with | `skills` | tint chips |
| — Links | ≥1 link with `label` and `url` | first link ink border, others line border; `target="_blank" rel="noopener"`; hover → accent fill |
| — Projects at ORG | ≥2 projects share the `experienceId` | mini timeline (below) + list; current item bold with accent dot (`aria-current`), others are buttons that switch project |

**Mini timeline:** a 10px bar spanning the experience's start→end. Each project is a rounded segment with `flex-grow` = its months (current = accent, others = `--color-tint-2`); gaps between projects are dashed segments. Labels under it: experience start / end (`Present` if ongoing).

## 3. Layout & styles

- Overlay: fixed, `z-index: 100`, backdrop `rgba(20,32,25,.45)` + `blur(4px)`; clicking it closes.
- Card: `width: min(1100px, 100% − 48px)`, `height: min(840px, 100vh − 48px)`, cream, radius 28, `--shadow-modal`, flex column, `overflow: hidden`.
- **Header (doesn't scroll):** padding `32px 48px 26px`, bottom border. Row: pills left, 48px close button right. Title Bricolage 700 `clamp(34px, 4.2vw, 54px)`, lh 1.02. Tagline 18px/1.55 ink-2, max 720px. Facts strip: white cells separated by 1px lines (grid `gap: 1px` on a line-coloured background), radius 16; label mono 11 uppercase muted, value 15/600.
- **Body (scrolls, `overscroll-behavior: contain`):** padding `36px 48px 48px`, grid `minmax(0,1fr) 300px`, gap 48. Section headings are `<h3>` in mono 12 uppercase accent (Overview / How it works / Outcome); sidebar headings mono 12 uppercase muted. Sidebar is `position: sticky; top: 0`.
- **Mobile (≤700px):** full-screen sheet (no radius, no outer padding), header padding `16px`, title 34px, single column, sidebar stacks below main content (not sticky), facts 2×2, media frame 4:3.

## 4. Media viewer

One main frame + optional thumbnail strip (`repeat(auto-fill, minmax(84px, 1fr))`, 4:3 tiles, radius 12, 2px accent border on the selected one, `aria-pressed`). Main frame: **always 16:9** (4:3 on mobile), radius 20, background `--color-tint` so the pop-up never changes height when switching items.

| `type` | Fields | Render |
|---|---|---|
| `image` | `src`, `alt`, `caption?`, `fit?`, `focus?` | `<img loading="lazy">`. **Fit:** if `fit` is set use it; else measure on load — aspect within ±15% of the frame → `cover`, otherwise `contain` (whole image, pale bands). `focus` → `object-position` (default `center`). Thumbnails always `cover`. |
| `video` | `src`, `poster?`, `alt`, `caption?` | `<video controls playsinline preload="metadata" :poster>` |
| `youtube` | `url`, `start?`, `alt`, `caption?` | **Lite embed:** parse the id from `watch?v=`, `youtu.be/`, `/shorts/`, `/embed/`. Show `https://i.ytimg.com/vi/<id>/hqdefault.jpg` (cover) with a centred 64px accent play button and the `alt` as its `aria-label`. On click replace with `<iframe src="https://www.youtube-nocookie.com/embed/<id>?autoplay=1&rel=0&start=<start>" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="<alt>">`. Thumbnail tile uses the same YouTube thumbnail + a small play icon. |

Rules: only one item is “live” at a time — switching items or closing the pop-up **unmounts** any playing `<video>` / YouTube iframe so audio stops. Images other than the current one aren't loaded until selected (thumbnails may load). Missing/unknown `type` → skip the item.

## 5. Opening, switching, closing

- **Open from the clicked element (FLIP).** On click, store the trigger's `getBoundingClientRect()`. After the card mounts, measure it and animate with the Web Animations API from `translate(dx,dy) scale(sx,sy)` (origin `0 0`, opacity .5, radius 14px) to `none` (opacity 1, radius 28px) — **380ms `cubic-bezier(.2,.7,.2,1)`**. Backdrop fades in 250ms.
- **Stagger:** pills, title, tagline, facts and body fade up 10px, 260ms each, starting at 220ms, +60ms per element.
- **Close** (× button, backdrop click, Esc, browser Back): reverse — card animates back into the stored rect (300ms `cubic-bezier(.4,0,.2,1)`, opacity → 0) while the backdrop fades; unmount on finish. If the project was switched since opening, just fade + drop 12px instead.
- **Mobile:** open = slide up from `translateY(100%)` (340ms), close = slide down (260ms). No FLIP.
- **Switch project** (prev/next, sibling list): swap content in place, scroll body to top, re-run the stagger (no delay). Don't replay the open animation.
- `prefers-reduced-motion`: no animations — show/hide instantly.

## 6. URL & history

- Opening sets the hash `#project/<id>` with `history.pushState`; switching uses `replaceState`; closing goes back (or `replaceState` to the previous hash if the pop-up was opened from a direct link).
- On page load with `#project/<id>`, open that project (no FLIP origin → fade-in variant).
- Browser Back while open closes the pop-up.

## 7. Accessibility

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` → the title.
- On open: lock page scroll (`overflow: hidden` on `html`), move focus to the dialog; **trap Tab** inside it. On close: unlock and return focus to the trigger (or the timeline if the trigger no longer exists).
- Esc closes. Every control is a `<button>` or `<a>`. Close button `aria-label="Close"`; thumbnails `aria-label="Image 2: <alt>"`.
- Hover effects also on `:focus-visible`; contrast per `DESIGN.md`.

## 8. Suggested components

```
src/components/ui/DetailModal.vue          # overlay, card shell, FLIP, scroll lock, focus trap, Esc/Back
src/components/project/ProjectDetail.vue   # header + body for one project (pure, props: project, experience, siblings)
src/components/project/ProjectMedia.vue    # viewer + thumbnails, image fit logic
src/components/project/YouTubeLite.vue     # thumbnail → iframe
src/components/project/ProjectMiniTimeline.vue
src/composables/useProjects.js             # load, validate, lookups (byId, byExperience, siblings)
src/composables/useDetailModal.js          # open(id, originEl), close(), switchTo(id), hash sync
src/utils/dates.js                         # parse 'YYYY-MM', format, months between (share with the timeline)
```

The education pop-up stays as the current placeholder (kind “EDUCATION”, title, subtitle, “Under construction”) inside the same `DetailModal`.
