// Shared open/close state for the project / education pop-up.
import { readonly, ref } from 'vue'

const detail = ref(null) // { kind: 'Project' | 'Education', title, subtitle, id }
let returnFocusTo = null

/**
 * @param {object} entry
 * @param {Element} [returnFocus] where focus goes on close if the trigger is gone
 */
function openDetail({ kind, title, subtitle, id }, returnFocus) {
  const trigger = document.activeElement
  returnFocusTo = { trigger, fallback: returnFocus }
  detail.value = { kind, title, subtitle, id }
}

function closeDetail() {
  detail.value = null
  const { trigger, fallback } = returnFocusTo ?? {}
  returnFocusTo = null
  const target = trigger?.isConnected ? trigger : fallback
  target?.focus?.({ preventScroll: true })
}

export function useDetailModal() {
  return { detail: readonly(detail), openDetail, closeDetail }
}
