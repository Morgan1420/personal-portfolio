// Hover-edge scrolling, step buttons and mouse drag-to-scroll — docs/TIMELINE.md §8.
import { onBeforeUnmount, ref } from 'vue'

const EDGE_SPEED = 7 // px per frame
const STEP = 420

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useEdgeScroll(scrollerRef) {
  const atStart = ref(false)
  const atEnd = ref(true)
  const dragging = ref(false)
  let frame = 0
  let drag = null

  function updateEdges() {
    const el = scrollerRef.value
    if (!el) return
    atStart.value = el.scrollLeft <= 2
    atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
  }

  function startScroll(direction) {
    stopScroll()
    const tick = () => {
      const el = scrollerRef.value
      if (!el) return
      el.scrollLeft += direction * EDGE_SPEED
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  }

  function stopScroll() {
    if (frame) cancelAnimationFrame(frame)
    frame = 0
  }

  function step(direction) {
    scrollerRef.value?.scrollBy({
      left: direction * STEP,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  // Drag to scroll — mouse only, and only on empty space
  function onPointerDown(event) {
    const el = scrollerRef.value
    if (!el || event.pointerType !== 'mouse' || event.button !== 0) return
    if (event.target.closest('button, article, a')) return
    drag = { x: event.clientX, scrollLeft: el.scrollLeft }
    el.setPointerCapture(event.pointerId)
    dragging.value = true
  }

  function onPointerMove(event) {
    if (!drag) return
    scrollerRef.value.scrollLeft = drag.scrollLeft - (event.clientX - drag.x)
  }

  function onPointerUp(event) {
    if (!drag) return
    drag = null
    dragging.value = false
    if (scrollerRef.value?.hasPointerCapture(event.pointerId)) scrollerRef.value.releasePointerCapture(event.pointerId)
  }

  onBeforeUnmount(stopScroll)

  return {
    atStart,
    atEnd,
    dragging,
    updateEdges,
    startScroll,
    stopScroll,
    step,
    dragHandlers: {
      pointerdown: onPointerDown,
      pointermove: onPointerMove,
      pointerup: onPointerUp,
      pointercancel: onPointerUp,
    },
  }
}
