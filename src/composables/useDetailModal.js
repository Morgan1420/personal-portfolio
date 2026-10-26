// Shared open/close state for the project / education pop-up.
import { readonly, ref } from 'vue'

const detail = ref(null) // { kind: 'Project' | 'Education', title, subtitle, id }
let returnFocusTo = null

/**
 * @param {object} entry
 * @param {object} [focus]
 * @param {Element} [focus.trigger]  element that opened the pop-up. Pass it explicitly:
 *   some browsers (Safari, Firefox on macOS) don't focus a button on click, so
 *   document.activeElement would be <body> and focus would restart at the top of the page.
 * @param {Element} [focus.fallback] where focus goes if the trigger is gone by then
 */
function openDetail({ kind, title, subtitle, id }, { trigger, fallback } = {}) {
  returnFocusTo = { trigger: trigger ?? document.activeElement, fallback }
  detail.value = { kind, title, subtitle, id }
}

function closeDetail() {
  detail.value = null
  const { trigger, fallback } = returnFocusTo ?? {}
  returnFocusTo = null
  const usable = (el) => el?.isConnected && el !== document.body
  const target = usable(trigger) ? trigger : fallback
  target?.focus?.({ preventScroll: true })
}

export function useDetailModal() {
  return { detail: readonly(detail), openDetail, closeDetail }
}
