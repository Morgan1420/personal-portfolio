// Keeps each box's left label (T) and right element (L) inside the visible
// window while the timeline scrolls, without overlapping — docs/TIMELINE.md §5.
// Transforms are written straight to the elements, not through reactive state.

const GAP = 24

export function useSlidingLabels(scrollerRef) {
  const items = new Map() // key → { box, t, l }
  const binders = new Map() // key → stable ref callbacks
  let frame = 0

  /** Ref callbacks for one box: `:ref="slide.box"` etc. Stable per key. */
  function bind(key) {
    if (!binders.has(key)) {
      const set = (part) => (el) => {
        const item = items.get(key) ?? {}
        item[part] = el
        if (!item.box && !item.t && !item.l) items.delete(key)
        else items.set(key, item)
      }
      binders.set(key, { box: set('box'), t: set('t'), l: set('l') })
    }
    return binders.get(key)
  }

  function layout() {
    const scroller = scrollerRef.value
    if (!scroller) return
    const view = scroller.getBoundingClientRect()
    const inset = Math.max(112, view.width * 0.12) + 12
    const viewL = view.left + inset
    const viewR = view.right - inset

    for (const { box, t, l } of items.values()) {
      if (!box || !t || !l || !box.isConnected) continue
      const rect = box.getBoundingClientRect()
      const origin = rect.left + (box.clientLeft || 0)
      const tw = t.offsetWidth
      const lw = l.offsetWidth
      const tNat = origin + t.offsetLeft
      const lNat = origin + l.offsetLeft
      const tx = Math.max(tNat, Math.min(Math.max(viewL, tNat), lNat - GAP - tw))
      const lx = Math.min(lNat, Math.max(viewR - lw, tx + tw + GAP))
      t.style.transform = `translateX(${tx - tNat}px)`
      l.style.transform = `translateX(${lx - lNat}px)`
    }
  }

  /** rAF-throttled layout, for scroll events. */
  function schedule() {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      layout()
    })
  }

  function cancel() {
    if (frame) cancelAnimationFrame(frame)
    frame = 0
  }

  return { bind, layout, schedule, cancel }
}
