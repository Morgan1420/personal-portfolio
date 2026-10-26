<script setup>
// Horizontal, scrollable experience timeline — spec in docs/TIMELINE.md.
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, shallowRef, watch } from 'vue'
import { experience } from '../../assets/JSONs/experience.json'
import { projects, education } from '../../assets/JSONs/projects_education.json'
import { buildTimeline, createTextMeasurer, currentMonthIndex } from '../../composables/useTimelineScale.js'
import { useSlidingLabels } from '../../composables/useSlidingLabels.js'
import { useEdgeScroll } from '../../composables/useEdgeScroll.js'
import { useDetailModal } from '../../composables/useDetailModal.js'
import TimelineLane from './TimelineLane.vue'
import WorkBox from './WorkBox.vue'
import ProjectBox from './ProjectBox.vue'
import TimelineAxis from './TimelineAxis.vue'
import EdgeScrollZone from './EdgeScrollZone.vue'

const CLOSE_DELAY = 160
const LANE_STEP = 48

// ---- Data (JSON → timeline input) ----
const projectById = Object.fromEntries(projects.map((p) => [p.id, p]))

const jobs = experience.map((job) => ({
  id: job.id,
  role: job.role,
  org: `${job.organization.short} · ${job.organization.name}`,
  orgName: job.organization.name,
  description: job.description,
  start: job.start,
  end: job.end,
  projects: job.projectIds
    .map((id) => projectById[id])
    .filter((p) => p?.lane === 'projects')
    .map(({ id, title, start, end }) => ({ id, title, start, end })),
}))

const lanes = [
  ...education.map((entry) => ({
    id: entry.id,
    kind: 'education',
    left: entry.laneLabel.left,
    right: entry.laneLabel.right,
    start: entry.start,
    end: entry.end,
    detail: { kind: 'Education', title: entry.degree, subtitle: entry.institution.name, id: entry.id },
    ariaLabel: `Open studies: ${entry.laneLabel.right}`,
  })),
  ...projects
    .filter((p) => p.lane === 'venture')
    .map((p) => ({
      id: p.id,
      kind: 'venture',
      left: p.laneLabel.left,
      right: p.laneLabel.right,
      start: p.start,
      end: p.end,
      detail: { kind: 'Project', title: p.title, subtitle: p.laneLabel.left, id: p.id },
      ariaLabel: `Open project: ${p.title}`,
    })),
]

// ---- Layout ----
const scroller = ref(null)
const track = ref(null)
const vpW = ref(1440)
const measure = shallowRef(createTextMeasurer())
const nowIdx = currentMonthIndex()

const layout = computed(() =>
  buildTimeline({ jobs, lanes, vpW: vpW.value, nowIdx, measure: measure.value }),
)

// ---- Open (hovered / focused) work box ----
const openJob = ref(null)
let closeTimer = 0

const openLayout = computed(() => (openJob.value === null ? null : layout.value.projectLayout(openJob.value)))
const ticks = computed(() => [...layout.value.ticks, ...(openLayout.value?.ticks ?? [])])

function openBox(index) {
  clearTimeout(closeTimer)
  if (openJob.value !== index) openJob.value = index
}

function closeSoon() {
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => (openJob.value = null), CLOSE_DELAY)
}

// Keep the box open while focus moves between it and its own projects
function onFocusOut(index, event) {
  const next = event.relatedTarget?.closest?.('[data-job]')
  if (next?.dataset.job !== String(index)) closeSoon()
}

// Touch has no hover: a tap toggles the box
function onBoxPointerDown(index, event) {
  if (event.pointerType === 'mouse') return
  clearTimeout(closeTimer)
  openJob.value = openJob.value === index ? null : index
}

// ---- Detail pop-up ----
const { openDetail } = useDetailModal()

function openLane(lane, event) {
  clearTimeout(closeTimer)
  openJob.value = null
  openDetail(lane.detail, { trigger: event.currentTarget })
}

function openProject(job, project, index, event) {
  // The project box unmounts when the work box closes, so focus returns to the
  // work box (keyboard) or the scroller (mouse) instead.
  const keyboard = event.detail === 0
  const fallback = keyboard ? track.value?.querySelector(`article[data-job="${index}"]`) : scroller.value
  clearTimeout(closeTimer)
  openJob.value = null
  openDetail(
    { kind: 'Project', title: project.title, subtitle: job.orgName, id: project.id },
    { trigger: event.currentTarget, fallback },
  )
}

// ---- Scrolling & sliding labels ----
const sliders = useSlidingLabels(scroller)
const edges = useEdgeScroll(scroller)

function onScroll() {
  edges.updateEdges()
  sliders.schedule()
}

watch([edges.atStart, edges.atEnd], () => edges.stopScroll())

let resizeObserver
onMounted(async () => {
  vpW.value = scroller.value.clientWidth || 1440
  await nextTick()
  scroller.value.scrollLeft = scroller.value.scrollWidth // newest first
  edges.updateEdges()
  sliders.layout()

  resizeObserver = new ResizeObserver(() => {
    const w = scroller.value?.clientWidth
    if (w && Math.abs(w - vpW.value) > 1) vpW.value = w
    else sliders.layout()
    edges.updateEdges()
  })
  resizeObserver.observe(scroller.value)

  // Re-measure project titles once the web fonts are in
  document.fonts?.ready.then(() => {
    measure.value = createTextMeasurer()
  })
})

onUpdated(() => {
  sliders.layout()
  edges.updateEdges()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  sliders.cancel()
  clearTimeout(closeTimer)
})
</script>

<template>
  <div
    ref="scroller"
    class="scroller"
    :class="{ 'is-dragging': edges.dragging.value }"
    tabindex="0"
    role="region"
    aria-label="Studies and work experience timeline, scrollable"
    @scroll="onScroll"
    v-on="edges.dragHandlers"
  >
    <div ref="track" class="track" :style="{ width: `${layout.width}px` }">
      <TimelineLane
        v-for="(lane, i) in layout.lanes"
        :key="lane.id"
        :lane="lane"
        :top="i * LANE_STEP"
        :alt="lane.kind === 'education' && i % 2 === 1"
        :faded="openJob !== null"
        :slide="sliders.bind(`lane-${lane.id}`)"
        :aria-label="lane.ariaLabel"
        @click="openLane(lane, $event)"
      />

      <template v-for="(job, i) in layout.jobs" :key="job.id">
        <WorkBox
          :job="job"
          :open="openJob === i"
          :slide="sliders.bind(`job-${job.id}`)"
          :data-job="i"
          @mouseenter="openBox(i)"
          @mouseleave="closeSoon"
          @focusin="openBox(i)"
          @focusout="onFocusOut(i, $event)"
          @mousedown.prevent
          @pointerdown="onBoxPointerDown(i, $event)"
        />
        <template v-if="openJob === i">
          <ProjectBox
            v-for="project in openLayout.projects"
            :key="project.id"
            :project="project"
            :slide="sliders.bind(`project-${project.id}`)"
            :data-job="i"
            @mouseenter="openBox(i)"
            @mouseleave="closeSoon"
            @focusin="openBox(i)"
            @focusout="onFocusOut(i, $event)"
            @click="openProject(job, project, i, $event)"
          />
        </template>
      </template>

      <TimelineAxis
        :lines="layout.lines"
        :ticks="ticks"
        :pills="layout.pills"
        :gaps="layout.gaps"
        :future-x="layout.futureX"
      />
    </div>
  </div>

  <EdgeScrollZone
    v-if="!edges.atStart.value"
    side="back"
    @start="edges.startScroll(-1)"
    @stop="edges.stopScroll"
    @step="edges.step(-1)"
  />
  <EdgeScrollZone
    v-if="!edges.atEnd.value"
    side="forward"
    @start="edges.startScroll(1)"
    @stop="edges.stopScroll"
    @step="edges.step(1)"
  />
</template>

<style scoped>
/* A horizontal scroller clips vertical overflow: top room for hover lift/glow,
   bottom room so the area under the axis is draggable */
.scroller {
  overflow-x: auto;
  overflow-y: hidden;
  padding-top: 28px;
  padding-bottom: 72px;
  outline-offset: -4px;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  scrollbar-width: none;
}

.scroller::-webkit-scrollbar {
  display: none;
}

.scroller.is-dragging {
  cursor: grabbing;
}

.track {
  position: relative;
  height: 372px;
}

/* Clickable affordance shared by lanes and project boxes (child roots) */
.tl-clickable {
  cursor: pointer;
}

.tl-clickable:hover,
.tl-clickable:focus-visible {
  filter: var(--glow-clickable);
  translate: 0 -2px;
}

.tl-clickable:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}
</style>
