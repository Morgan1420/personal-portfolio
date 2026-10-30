<script setup>
// Header + body for one project. Every block renders only when its data exists — PROJECT_POPUP.md §2.
import { computed } from 'vue'
import { currentMonthIndex, formatDuration, formatMonth, toMonthIndex } from '../../utils/dates.js'
import { isValidMedia } from '../../utils/media.js'
import DetailHeader from '../ui/DetailHeader.vue'
import IconPen from '../ui/icons/IconPen.vue'
import ProjectMedia from './ProjectMedia.vue'
import ProjectMiniTimeline from './ProjectMiniTimeline.vue'

const props = defineProps({
  project: { type: Object, required: true },
  experience: { type: Object, default: null },
  siblings: { type: Array, default: () => [] }, // same experienceId, oldest first, includes this project
})
defineEmits(['close', 'switch'])

const filled = (value) => typeof value === 'string' && value.trim() !== ''

const chip = computed(() => (props.experience ? `${props.experience.organization.short} · ${props.experience.role}` : ''))

const facts = computed(() => {
  const { start, end, ongoing, role, context } = props.project
  const result = []
  if (start) {
    const from = toMonthIndex(start)
    let dates = formatMonth(from)
    if (end) dates += ` – ${formatMonth(toMonthIndex(end))}`
    else if (ongoing) dates += ' – Present'
    result.push({ label: 'Dates', value: dates })
    if (end || ongoing) {
      const to = end ? toMonthIndex(end) : currentMonthIndex()
      result.push({ label: 'Duration', value: `${formatDuration(Math.max(1, to - from))}${ongoing ? ' so far' : ''}` })
    }
  }
  if (filled(role)) result.push({ label: 'My role', value: role })
  if (filled(context)) result.push({ label: 'Context', value: context })
  return result
})

const media = computed(() => (props.project.media ?? []).filter(isValidMedia))
const overview = computed(() => (props.project.overview ?? []).filter(filled))
const highlights = computed(() =>
  (props.project.highlights ?? [])
    .filter((h) => filled(h.title) || filled(h.text))
    .map((h, i) => ({ ...h, number: `${String(i + 1).padStart(2, '0')}${filled(h.label) ? ` · ${h.label}` : ''}` })),
)
const outcomes = computed(() => (props.project.outcomes ?? []).filter((o) => filled(o.value)))
const skills = computed(() => (props.project.skills ?? []).filter(filled))
const links = computed(() => (props.project.links ?? []).filter((l) => filled(l.label) && filled(l.url)))

const isEmpty = computed(
  () => !media.value.length && !overview.value.length && !highlights.value.length && !outcomes.value.length,
)

const position = computed(() => props.siblings.findIndex((s) => s.id === props.project.id))
const previous = computed(() => (position.value > 0 ? props.siblings[position.value - 1] : null))
const next = computed(() => (position.value >= 0 ? (props.siblings[position.value + 1] ?? null) : null))

const showSiblings = computed(() => !!props.experience && props.siblings.length >= 2)
const hasSidebar = computed(() => skills.value.length > 0 || links.value.length > 0 || showSiblings.value)
</script>

<template>
  <DetailHeader
    kind="Project"
    :chip="chip"
    :title="project.title"
    :tagline="project.tagline || project.summary || ''"
    @close="$emit('close')"
  >
    <dl v-if="facts.length" class="facts" :style="{ '--fact-columns': facts.length }" data-stagger>
      <div v-for="fact in facts" :key="fact.label" class="fact">
        <dt class="fact__label">{{ fact.label }}</dt>
        <dd class="fact__value">{{ fact.value }}</dd>
      </div>
    </dl>
  </DetailHeader>

  <div class="scroll" data-modal-scroll>
    <div class="body" :class="{ 'body--with-sidebar': hasSidebar }" data-stagger>
      <div class="main">
        <ProjectMedia v-if="media.length" :key="project.id" :items="media" />

        <section v-if="overview.length" class="block block--overview">
          <h3 class="heading">Overview</h3>
          <p v-for="(paragraph, i) in overview" :key="i" class="overview__text">{{ paragraph }}</p>
        </section>

        <section v-if="highlights.length" class="block">
          <h3 class="heading">How it works</h3>
          <ol class="highlights">
            <li v-for="highlight in highlights" :key="highlight.number" class="highlight">
              <span class="highlight__number">{{ highlight.number }}</span>
              <strong v-if="highlight.title" class="highlight__title">{{ highlight.title }}</strong>
              <span v-if="highlight.text" class="highlight__text">{{ highlight.text }}</span>
            </li>
          </ol>
        </section>

        <section v-if="outcomes.length" class="block">
          <h3 class="heading">Outcome</h3>
          <div class="outcomes">
            <div v-for="outcome in outcomes" :key="outcome.value + outcome.label" class="outcome">
              <p class="outcome__value">{{ outcome.value }}</p>
              <p v-if="outcome.label" class="outcome__label">{{ outcome.label }}</p>
            </div>
          </div>
        </section>

        <div v-if="isEmpty" class="soon">
          <span class="soon__icon" aria-hidden="true"><IconPen /></span>
          <p class="soon__text">More about this project — images, details and results — is on its way.</p>
        </div>

        <nav v-if="previous || next" class="pager" aria-label="More projects">
          <div class="pager__side">
            <button v-if="previous" type="button" class="pager__button" @click="$emit('switch', previous.id)">
              <span class="pager__label">← Previous project</span>
              <span class="pager__title">{{ previous.title }}</span>
            </button>
          </div>
          <div class="pager__side">
            <button v-if="next" type="button" class="pager__button pager__button--next" @click="$emit('switch', next.id)">
              <span class="pager__label">Next project →</span>
              <span class="pager__title">{{ next.title }}</span>
            </button>
          </div>
        </nav>
      </div>

      <aside v-if="hasSidebar" class="sidebar">
        <div v-if="skills.length" class="side-card side-card--roomy">
          <h3 class="side-heading">Built with</h3>
          <div class="skills">
            <span v-for="skill in skills" :key="skill" class="skill">{{ skill }}</span>
          </div>
        </div>

        <div v-if="links.length" class="side-card side-card--tight">
          <h3 class="side-heading side-heading--links">Links</h3>
          <a
            v-for="link in links"
            :key="link.url"
            class="link"
            :href="link.url"
            target="_blank"
            rel="noopener"
          >
            {{ link.label }}
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div v-if="showSiblings" class="side-card">
          <h3 class="side-heading">Projects at {{ experience.organization.short }}</h3>
          <ProjectMiniTimeline :project="project" :experience="experience" :siblings="siblings" />
          <ul class="siblings">
            <li v-for="sibling in siblings" :key="sibling.id">
              <span v-if="sibling.id === project.id" class="sibling sibling--current" aria-current="true">
                <span class="sibling__dot" aria-hidden="true"></span>
                {{ sibling.title }}
              </span>
              <button v-else type="button" class="sibling sibling--other" @click="$emit('switch', sibling.id)">
                <span class="sibling__dot" aria-hidden="true"></span>
                {{ sibling.title }}
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
/* Facts strip: 1px lines come from the gap over a line-coloured background */
.facts {
  margin: 4px 0 0;
  display: grid;
  grid-template-columns: repeat(var(--fact-columns), minmax(0, 1fr));
  gap: 1px;
  background: var(--color-line);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.fact {
  min-width: 0;
  padding: 12px 18px;
  background: var(--color-surface);
}

.fact__label {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.fact__value {
  margin: 4px 0 0;
  font-weight: 600;
  font-size: var(--fs-small);
}

.scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.body {
  padding: 36px 48px 48px;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 48px;
  align-items: start;
}

.body--with-sidebar {
  grid-template-columns: minmax(0, 1fr) 300px;
}

.main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.block {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.block--overview {
  gap: 12px;
}

.heading,
.side-heading {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: var(--fs-label-sm);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.heading {
  color: var(--color-accent);
}

.side-heading {
  color: var(--color-muted);
}

.side-heading--links {
  margin-bottom: 4px;
}

.overview__text {
  font-size: var(--fs-body);
  line-height: 1.7;
  color: var(--color-ink-2);
}

.highlights {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}

.highlight {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-tile);
}

.highlight__number {
  font-family: var(--font-mono);
  font-size: var(--fs-label-sm);
  color: var(--color-accent);
}

.highlight__title {
  font-family: var(--font-display);
  font-size: 20px;
  line-height: 1.2;
}

.highlight__text {
  font-size: var(--fs-small);
  line-height: 1.55;
  color: var(--color-ink-2);
}

.outcomes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
}

.outcome {
  padding: 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-tile);
}

.outcome:first-child {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-on-accent);
}

.outcome__value {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  line-height: 1.1;
}

.outcome__label {
  margin-top: 6px;
  font-size: var(--fs-caption);
  color: var(--color-muted);
}

.outcome:first-child .outcome__label {
  color: inherit;
  opacity: 0.85;
}

.soon {
  padding: 28px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1.5px dashed var(--color-line-dashed);
  border-radius: var(--radius-md);
  color: var(--color-muted);
}

.soon__icon {
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lane);
  background: var(--color-tint);
  color: var(--color-accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.soon__text {
  font-size: var(--fs-small);
  line-height: 1.55;
}

.pager {
  padding-top: 24px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  border-top: 1px solid var(--color-line);
}

.pager__side {
  min-width: 0;
}

.pager__button {
  width: 100%;
  height: 100%;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-line);
  background: var(--color-surface);
  color: var(--color-ink);
  text-align: left;
  cursor: pointer;
  transition:
    border-color var(--dur) ease,
    translate var(--dur) ease,
    box-shadow var(--dur) ease;
}

.pager__button--next {
  align-items: flex-end;
  text-align: right;
}

.pager__button:hover,
.pager__button:focus-visible {
  border-color: var(--color-accent);
  translate: 0 -2px;
  box-shadow: var(--shadow-nav-hover);
}

.pager__label {
  font-family: var(--font-mono);
  font-size: var(--fs-label-sm);
  color: var(--color-muted);
}

.pager__title {
  font-weight: 600;
  font-size: 16px;
}

.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.side-card {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
}

.side-card--roomy {
  gap: 14px;
}

.side-card--tight {
  gap: 10px;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill {
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  background: var(--color-tint);
  font-size: var(--fs-caption);
  font-weight: 500;
}

.link {
  min-height: 44px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: var(--radius-lane);
  border: 1.5px solid var(--color-line);
  color: var(--color-ink);
  text-decoration: none;
  font-weight: 600;
  font-size: var(--fs-small);
  line-height: 1.3;
  transition:
    background-color var(--dur) ease,
    color var(--dur) ease,
    border-color var(--dur) ease;
}

.side-heading--links + .link {
  border-color: var(--color-ink);
}

.link:hover,
.link:focus-visible {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-on-accent);
}

.siblings {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
}

.sibling {
  width: 100%;
  min-height: 44px;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--fs-caption);
  line-height: 1.3;
  text-align: left;
}

.sibling--current {
  font-weight: 600;
}

.sibling--other {
  border: none;
  background: transparent;
  color: var(--color-ink-2);
  cursor: pointer;
  transition: color var(--dur) ease;
}

.sibling--other:hover,
.sibling--other:focus-visible {
  color: var(--color-accent);
}

.sibling__dot {
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-line-dashed);
}

.sibling--current .sibling__dot {
  background: var(--color-accent);
}

@media (max-width: 700px) {
  .facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* An odd last fact takes the whole row, so no grey hole is left in the grid */
  .fact:last-child:nth-child(odd) {
    grid-column: 1 / -1;
  }

  .fact {
    padding: 10px 14px;
  }

  .body,
  .body--with-sidebar {
    grid-template-columns: minmax(0, 1fr);
    padding: 24px 16px 40px;
    gap: 32px;
  }

  .sidebar {
    position: static;
  }
}
</style>
