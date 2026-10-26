// Timeline geometry: dates → x positions, ticks, pills and gap labels.
// Pure functions only (no DOM, no Vue) — see docs/TIMELINE.md §1–4.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const PAD = 96 // track side padding
export const SEAM = 14 // space between joined jobs
export const PROJ_GAP = 6 // space between neighbouring project boxes
export const EDGE = 18 // inset where a project shares its job's start/end
export const FUTURE_W = 180
export const VENTURE_OVERHANG = 150 // ongoing venture runs past the future marker

const FONT_PROJECT = '600 14px Inter, system-ui, sans-serif'
const FONT_MONO = "12px 'JetBrains Mono', monospace"

/** "YYYY-MM" → months since year 0. */
export const toMonthIndex = (date) => {
  const [year, month] = date.split('-').map(Number)
  return year * 12 + (month - 1)
}

export const currentMonthIndex = (now = new Date()) => now.getFullYear() * 12 + now.getMonth()

/** Month index → "Feb 2024". */
export const formatMonth = (index) => `${MONTHS[index % 12]} ${Math.floor(index / 12)}`

/** Months → "4 mos", "1 yr", "1 yr 10 mos". */
export const formatDuration = (months) => {
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts = []
  if (years) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`)
  if (rest) parts.push(`${rest} ${rest === 1 ? 'mo' : 'mos'}`)
  return parts.join(' ') || '< 1 mo'
}

/** Rough fallback when no canvas is available (tests, SSR). */
export const estimateTextWidth = (text) => text.length * 8.4

/** Canvas-backed text measurer with a small cache. Lives here so the scale stays testable. */
export function createTextMeasurer() {
  let ctx
  const cache = new Map()
  return (text, font) => {
    const key = `${font}|${text}`
    if (cache.has(key)) return cache.get(key)
    if (ctx === undefined) {
      try {
        ctx = document.createElement('canvas').getContext('2d')
      } catch {
        ctx = null
      }
    }
    if (!ctx) return estimateTextWidth(text)
    ctx.font = font
    const width = ctx.measureText(text).width
    cache.set(key, width)
    return width
  }
}

/**
 * Builds the whole timeline layout.
 *
 * @param {object}   opts
 * @param {Array}    opts.jobs     [{ id, start, end, projects: [{ id, title, start, end }] }] oldest first
 * @param {Array}    opts.lanes    [{ id, kind: 'education' | 'venture', start, end }]
 * @param {number}   opts.vpW      scroller clientWidth
 * @param {number}   opts.nowIdx   current month index
 * @param {Function} opts.measure  (text, font) → px
 */
export function buildTimeline({ jobs, lanes, vpW, nowIdx, measure = estimateTextWidth }) {
  const jobW = (m) => Math.max(340, vpW * (0.14 + 0.032 * m))
  const idleW = (m) => Math.max(44, vpW * 0.016 * m)

  const projectNeed = (title, months) =>
    Math.ceil(14 + measure(title, FONT_PROJECT) + 20 + measure(formatDuration(months), FONT_MONO) + 14 + 3 + 8)

  const J = jobs.map((job) => {
    const s = toMonthIndex(job.start)
    const e = job.end ? toMonthIndex(job.end) : nowIdx
    return { ...job, s, e, months: Math.max(1, e - s), ongoing: !job.end }
  })
  const L = lanes.map((lane) => {
    const s = toMonthIndex(lane.start)
    const ongoing = !lane.end
    return { ...lane, s, e: ongoing ? nowIdx : toMonthIndex(lane.end), ongoing }
  })

  const T0 = Math.min(...J.map((j) => j.s), ...L.map((l) => l.s))
  const pieces = []
  const lines = []
  const ticks = []
  const pills = []
  const gaps = []
  const placedJobs = []

  let x = PAD
  const addPiece = (t0, t1, w, kind) => {
    pieces.push({ t0, t1, x0: x, x1: x + w })
    lines.push({ x, w, kind })
    x += w
  }

  J.forEach((job, i) => {
    const prev = J[i - 1]
    const next = J[i + 1]
    const joinedPrev = !!prev && job.s - prev.e - 1 <= 0
    const joinedNext = !!next && next.s - job.e - 1 <= 0

    if (!prev) {
      if (job.s > T0) addPiece(T0, job.s, idleW(job.s - T0), 'idle')
    } else if (joinedPrev) {
      ticks.push({ x: x + SEAM / 2, label: formatMonth(job.s), align: 'center' })
      addPiece(prev.e, job.s, SEAM, 'work')
    } else {
      const w = idleW(job.s - prev.e)
      gaps.push({ x: x + w / 2, label: formatDuration(job.s - prev.e - 1) })
      addPiece(prev.e, job.s, w, 'idle')
    }

    // Base width from duration, widened so every project title fits
    let w = jobW(job.months)
    for (const p of job.projects ?? []) {
      const ps = toMonthIndex(p.start)
      const pe = p.end ? toMonthIndex(p.end) : job.e
      const pm = Math.max(1, pe - ps)
      const inset = PROJ_GAP + (ps === job.s ? EDGE : 0) + (pe === job.e ? EDGE : 0)
      w = Math.max(w, ((projectNeed(p.title, pm) + inset) * job.months) / pm)
    }
    w = Math.round(w)

    if (!joinedPrev) ticks.push({ x, label: formatMonth(job.s), align: 'start' })
    if (!joinedNext) ticks.push({ x: x + w, label: job.ongoing ? 'Present' : formatMonth(job.e), align: 'end' })
    pills.push({ x: x + w / 2, label: formatDuration(job.months) })
    placedJobs.push({ ...job, x, w, current: job.s <= nowIdx && job.e >= nowIdx })
    addPiece(job.s, job.e, w, 'work')
  })

  // Studies that run past the last job
  const lastEnd = J[J.length - 1].e
  const maxLaneEnd = Math.max(...L.map((l) => l.e), lastEnd)
  if (maxLaneEnd > lastEnd) addPiece(lastEnd, maxLaneEnd, idleW(maxLaneEnd - lastEnd), 'idle')

  const futureX = x
  lines.push({ x, w: FUTURE_W, kind: 'future' })
  const width = Math.round(x + FUTURE_W + PAD)

  const X = (t) => {
    for (const p of pieces) {
      if (p.t1 > p.t0 && t >= p.t0 && t <= p.t1) return p.x0 + ((t - p.t0) / (p.t1 - p.t0)) * (p.x1 - p.x0)
    }
    return t <= T0 ? PAD : futureX
  }

  const tickNear = (px, distance) => ticks.some((tick) => Math.abs(tick.x - px) < distance)

  const placedLanes = L.map((lane) => {
    const x0 = X(lane.s)
    const x1 = lane.ongoing ? futureX + VENTURE_OVERHANG : X(lane.e)
    if (!tickNear(x0, 30)) ticks.push({ x: x0, label: formatMonth(lane.s), align: 'start' })
    if (!lane.ongoing && !tickNear(x1, 30)) ticks.push({ x: x1, label: formatMonth(lane.e), align: 'end' })
    return { ...lane, x: Math.round(x0), w: Math.round(x1 - x0) }
  })

  /** Project boxes + extra (accent) ticks for an open work box. */
  const projectLayout = (jobIndex) => {
    const job = placedJobs[jobIndex]
    const projects = []
    const extraTicks = []
    if (!job) return { projects, ticks: extraTicks }

    for (const p of job.projects ?? []) {
      const ps = toMonthIndex(p.start)
      const pe = p.end ? toMonthIndex(p.end) : job.e
      const x0 = X(ps)
      const x1 = X(pe)
      const insetL = PROJ_GAP / 2 + (ps === job.s ? EDGE : 0)
      const insetR = PROJ_GAP / 2 + (pe === job.e ? EDGE : 0)
      const duration = formatDuration(Math.max(1, pe - ps))
      projects.push({
        ...p,
        x: Math.round(x0 + insetL),
        w: Math.max(80, Math.round(x1 - x0 - insetL - insetR)),
        duration,
        durationSpace: Math.ceil(measure(duration, FONT_MONO) + 48),
      })
      for (const [px, t, align] of [
        [x0, ps, 'start'],
        [x1, pe, 'end'],
      ]) {
        const taken = [...ticks, ...extraTicks].some((tick) => Math.abs(tick.x - px) < 8)
        if (!taken) extraTicks.push({ x: px, label: formatMonth(t), align, project: true })
      }
    }
    return { projects, ticks: extraTicks }
  }

  return { width, futureX, lines, ticks, pills, gaps, jobs: placedJobs, lanes: placedLanes, projectLayout }
}
