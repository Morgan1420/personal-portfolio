// Shared state for the project / education pop-up: open, switch, close, #project/<id> history.
// Closing is two-phase: close() flags it, DetailModal animates, then calls finishClose().
import { readonly, ref } from 'vue'
import { projectById } from './useProjects.js'

const HASH_PREFIX = '#project/'

const detail = ref(null) // { kind: 'Project', id } | { kind: 'Education', id, title, subtitle }
const closing = ref(false)

let origin = null // rect of the clicked element; null = no FLIP (direct link, or switched project)
let returnFocusTo = null
let pushedEntry = false // true: our history entry is on the stack, so closing goes back
let ignoreNextPop = false

const hashProjectId = () => {
  const { hash } = window.location
  return hash.startsWith(HASH_PREFIX) ? decodeURIComponent(hash.slice(HASH_PREFIX.length)) : null
}

// While open, the browser must not restore scroll on Back: the pop-up's entries are not page positions
function setScrollRestoration(mode) {
  if ('scrollRestoration' in window.history) window.history.scrollRestoration = mode
}

function show(entry, { trigger, fallback } = {}) {
  origin = trigger?.getBoundingClientRect() ?? null
  // Pass the trigger explicitly: some browsers (Safari, Firefox on macOS) don't focus a
  // button on click, so document.activeElement would be <body>.
  returnFocusTo = { trigger: trigger ?? document.activeElement, fallback }
  setScrollRestoration('manual')
  detail.value = entry
}

/** @param focus { trigger: element that opened it, fallback: focus target if the trigger is gone by then } */
function openProject(id, focus) {
  if (!projectById(id)) return
  window.history.pushState({ detailModal: true }, '', `${HASH_PREFIX}${id}`)
  pushedEntry = true
  show({ kind: 'Project', id }, focus)
}

function openEducation({ id, title, subtitle }, focus) {
  // No hash of its own, but an entry all the same so that Back closes it
  window.history.pushState({ detailModal: true }, '', window.location.href)
  pushedEntry = true
  show({ kind: 'Education', id, title, subtitle }, focus)
}

/** Swap to another project in place. Closing after this fades instead of flying back. */
function switchTo(id) {
  if (!projectById(id)) return
  window.history.replaceState(window.history.state, '', `${HASH_PREFIX}${id}`)
  origin = null
  detail.value = { kind: 'Project', id }
}

function close() {
  if (!detail.value || closing.value) return
  if (pushedEntry) {
    pushedEntry = false
    ignoreNextPop = true
    window.history.back()
  } else {
    // Opened from a direct link: nothing of ours to go back to
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  }
  closing.value = true
}

function finishClose() {
  detail.value = null
  closing.value = false
  origin = null
  if (!ignoreNextPop) setScrollRestoration('auto')
  const { trigger, fallback } = returnFocusTo ?? {}
  returnFocusTo = null
  const usable = (el) => el?.isConnected && el !== document.body
  const target = usable(trigger) ? trigger : (fallback ?? document.querySelector('#experience [role="region"]'))
  target?.focus?.({ preventScroll: true })
}

function openFromHash() {
  const id = hashProjectId()
  if (!id || !projectById(id)) return
  pushedEntry = window.history.state?.detailModal === true
  show({ kind: 'Project', id })
  origin = null
  returnFocusTo = null
}

function onPopState() {
  if (ignoreNextPop) {
    ignoreNextPop = false
    if (!detail.value) setScrollRestoration('auto')
    return
  }
  if (!detail.value) {
    openFromHash()
    return
  }
  const id = hashProjectId()
  if (id && projectById(id)) {
    if (id !== detail.value.id) {
      origin = null
      detail.value = { kind: 'Project', id }
    }
  } else if (!closing.value) {
    // Browser Back: the entry is already gone
    pushedEntry = false
    closing.value = true
  }
}

/** Call once from the modal: listens to Back/Forward and honours #project/<id> on load. */
function startHistorySync() {
  window.addEventListener('popstate', onPopState)
  openFromHash()
}

function stopHistorySync() {
  window.removeEventListener('popstate', onPopState)
}

export function useDetailModal() {
  return {
    detail: readonly(detail),
    closing: readonly(closing),
    getOrigin: () => origin,
    openProject,
    openEducation,
    switchTo,
    close,
    finishClose,
    startHistorySync,
    stopHistorySync,
  }
}
