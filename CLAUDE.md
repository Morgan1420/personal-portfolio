# CLAUDE.md — personal-portfolio (v2)

Personal portfolio of **Jan Moran Ricardo** (Telecom & Computer Engineer · Entrepreneur).
Vue 3 + Vite single-page site, deployed on **Cloudflare** at jan-moran.com.

We are rebuilding the site from scratch ("v2"). Everything currently in `src/components/` (`HelloWorld.vue`, `Hero.vue`) and the old `App.vue` / `style.css` is from the previous version and **can be deleted or replaced freely**.

---

## ⚠️ Git & deployment — read first

- **`main` auto-deploys to production** (Cloudflare is linked to it). Any push or merge to `main` goes live immediately.
- **All work happens on the `version2` branch.**
- **Never** push to `main`, merge into `main`, open a PR targeting `main`, rebase `main`, or change the default branch — unless Jan explicitly asks in that message.
- Before any git command, run `git branch --show-current` and confirm it prints `version2`. If it doesn't, stop and ask.
- Commit only when asked. Use small, descriptive commits (`feat(timeline): sliding labels`, `style(hero): button hover`).
- Don't touch Cloudflare config, DNS, or build settings.

## Commands

Check `package.json` for the exact scripts; standard Vite setup:

```bash
npm install
npm run dev       # local dev server
npm run build     # production build — must pass before saying a task is done
npm run preview   # serve the built output
```

## Source of truth

| What | Where |
|---|---|
| Visual design, tokens, component specs | `DESIGN.md` |
| Experience timeline logic (the complex part) | `docs/TIMELINE.md` |
| Project pop-up (data schema, behaviour) | `docs/PROJECT_POPUP.md` |
| Content data | `src/assets/JSONs/experience.json`, `src/assets/JSONs/projects_education.json` (education), `src/assets/JSONs/projects/<id>.json` (one per project) |
| Project assets | `public/projects/<id>/` — no heavy videos: they go on YouTube |
| Design reference (working prototype) | `docs/design-reference/portfolio-v2.dc.html` |
| Old requirements | `website_requisites.md` — older notes; if it conflicts with `DESIGN.md`, `DESIGN.md` wins |

The design was iterated in a visual prototype first. `docs/design-reference/portfolio-v2.dc.html` is that prototype's source: plain HTML with inline styles plus a small template syntax (`{{hole}}`, `<sc-for>`, `<sc-if>`, a `class Component extends DCLogic` script). It is **reference only** — never import or ship it. When porting a section, read its markup there for exact values (sizes, colours, spacing, copy) and translate it into idiomatic Vue.

## Tech conventions

- **Vue 3, Composition API, `<script setup>`**, plain JavaScript (no TypeScript unless Jan asks).
- **No UI framework, no CSS framework** (no Tailwind/Vuetify/etc.). Plain CSS with the tokens in `src/styles/tokens.css`.
- Component styles are `<style scoped>`; anything global lives in `src/styles/`.
- Always use tokens (`var(--color-accent)`, `var(--radius-card)`…), never raw hex values in components. If a value is missing from the tokens, add it to `tokens.css` and `DESIGN.md` together.
- Icons: small inline-SVG Vue components (stroke icons, `currentColor`, `aria-hidden="true"`). For GitHub / LinkedIn / YouTube use the official brand marks (e.g. from Simple Icons), not hand-drawn imitations.
- Fonts: Google Fonts — Bricolage Grotesque (500, 700), Inter (400, 500, 600), JetBrains Mono (400, 500, 700). Load once in `index.html` with `preconnect`.
- Content comes from the JSON files — don't hard-code experience/project/education text in components.
- No new dependencies without asking. Likely future additions (ask first): `vue-i18n` for the language picker.

### Target structure

```
src/
  App.vue                     # page composition: NavBar + sections + footer + DetailModal
  main.js
  styles/
    tokens.css                # design tokens (CSS custom properties)
    base.css                  # reset, body, typography defaults, focus styles, reduced motion
  assets/
    images/  JSONs/  CV_Jan-Moran.pdf  hero.png
  components/
    layout/    NavBar.vue  LanguagePicker.vue  SiteFooter.vue
    sections/  HeroSection.vue  AboutSection.vue  ExperienceSection.vue
               ProjectsSection.vue  AchievementsSection.vue  SkillsSection.vue
               GallerySection.vue  ContactSection.vue
    timeline/  ExperienceTimeline.vue  TimelineLane.vue  WorkBox.vue
               ProjectBox.vue  TimelineAxis.vue  EdgeScrollZone.vue
    project/   ProjectDetail.vue  ProjectMedia.vue  YouTubeLite.vue  ProjectMiniTimeline.vue
    ui/        BaseButton.vue  IconButton.vue  SectionHeader.vue  DetailModal.vue  DetailHeader.vue  icons/
  composables/
    useTimelineScale.js       # dates → x positions (pure, unit-testable)
    useSlidingLabels.js       # keeps box labels on screen while scrolling
    useEdgeScroll.js          # hover-edge scrolling, step buttons, drag-to-scroll
    useDetailModal.js         # open/switch/close state and #project/<id> history
    useProjects.js            # loads and validates the project JSONs
  utils/                      # dates.js (shared with the timeline), media.js
```

This is a guide, not a contract — keep it simple and don't over-split.

## Section status

| # | Section | Status | Notes |
|---|---|---|---|
| — | NavBar | ✅ Final | Includes language picker (UI only, English copy for now) |
| — | Hero | ✅ Final | Full-screen, stable hover animations |
| 01 | About | ✅ Final | |
| 02 | Experience timeline | ✅ Final | See `docs/TIMELINE.md` |
| 03 | Projects | 🟡 Draft | Layout will change |
| 04 | Achievements | 🟡 Draft | |
| 05 | Skills | 🟡 Draft | |
| 06 | Gallery | 🟡 Draft | |
| 07 | Contact | ⬜ Placeholder | To be designed |
| — | Project pop-up | ✅ Final | See `docs/PROJECT_POPUP.md` |
| — | Education pop-up | ⬜ Placeholder | Only kind label + title + "Under construction" for now |

Port ✅ sections faithfully. For 🟡/⬜ sections, build a simple version that matches the design reference but expect it to change — don't over-engineer.

## Content rules

- Never invent facts, numbers, dates or quotes. Missing content is a visible placeholder in square brackets, e.g. `[Project image]`, `[Dates]`.
- The language picker shows CA / EN / ES / LT / DE. Copy is English-only for now; Jan will write every translation himself (no machine translation).
- The CV download links to `src/assets/CV_Jan-Moran.pdf` (`download` attribute).

## Accessibility & quality bar (every change)

- Real elements: `<button>` for actions, `<a href>` for navigation. Never `@click` on a `div`/`span`.
- Icon-only buttons get `aria-label`. Decorative SVGs get `aria-hidden="true"`.
- Touch targets ≥ 44px. Text contrast ≥ 4.5:1 (the palette in `DESIGN.md` already passes — don't lighten greys).
- Visible `:focus-visible` styles; hover effects also apply on focus.
- Respect `prefers-reduced-motion` (disable transitions/animations, keep the end state).
- Layout works from **360px to 1920px**; check at 390px and 1440px.

## Definition of done

1. `npm run build` passes with no warnings you introduced.
2. Checked in the browser at 390px and 1440px widths.
3. Keyboard: Tab order is sensible, focus is visible, Esc closes pop-ups/menus.
4. Matches `DESIGN.md` (and the reference file) for values and behaviour.
5. Still on `version2`; nothing pushed to `main`.
