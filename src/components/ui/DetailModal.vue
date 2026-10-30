<script setup>
// Pop-up shell: overlay, card, scroll lock, focus trap, Esc/Back, FLIP open/close, mobile sheet.
// See docs/PROJECT_POPUP.md §3, §5–§7.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useDetailModal } from '../../composables/useDetailModal.js'
import { experienceById, projectById, projectsOfExperience } from '../../composables/useProjects.js'
import ProjectDetail from '../project/ProjectDetail.vue'
import DetailHeader from './DetailHeader.vue'
import IconConstruction from './icons/IconConstruction.vue'

const EASE_OPEN = 'cubic-bezier(.2,.7,.2,1)'
const EASE_CLOSE = 'cubic-bezier(.4,0,.2,1)'

const { detail, closing, getOrigin, close, finishClose, switchTo, startHistorySync, stopHistorySync } = useDetailModal()

const card = ref(null)
const backdrop = ref(null)

const project = computed(() => (detail.value?.kind === 'Project' ? projectById(detail.value.id) : null))
const experience = computed(() => (project.value?.experienceId ? experienceById(project.value.experienceId) : null))
const siblings = computed(() => (experience.value ? projectsOfExperience(experience.value.id) : []))

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isMobile = () => window.matchMedia('(max-width: 700px)').matches

// ---- Animations ----

// The part of the trigger on screen: a timeline lane can be far wider than the viewport
function visibleOrigin() {
  const rect = getOrigin()
  if (!rect) return null
  const left = Math.max(rect.left, 0)
  const top = Math.max(rect.top, 0)
  const width = Math.min(rect.right, window.innerWidth) - left
  const height = Math.min(rect.bottom, window.innerHeight) - top
  return width > 0 && height > 0 ? { left, top, width, height } : null
}

function flipTransform(from) {
  const to = card.value.getBoundingClientRect()
  const scaleX = Math.max(0.05, from.width / to.width)
  const scaleY = Math.max(0.05, from.height / to.height)
  return `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${scaleX}, ${scaleY})`
}

function stagger(delay) {
  if (reducedMotion()) return
  card.value?.querySelectorAll('[data-stagger]').forEach((el, i) => {
    el.animate(
      [
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 260, delay: delay + i * 60, easing: EASE_OPEN, fill: 'backwards' },
    )
  })
}

function animateOpen() {
  if (reducedMotion()) return
  backdrop.value.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: 'ease' })
  const from = visibleOrigin()
  if (isMobile()) {
    card.value.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], {
      duration: 340,
      easing: EASE_OPEN,
    })
  } else if (from) {
    card.value.animate(
      [
        { transformOrigin: '0 0', transform: flipTransform(from), opacity: 0.5, borderRadius: '14px' },
        { transformOrigin: '0 0', transform: 'none', opacity: 1, borderRadius: '28px' },
      ],
      { duration: 380, easing: EASE_OPEN },
    )
  } else {
    card.value.animate(
      [
        { opacity: 0, transform: 'translateY(16px) scale(.97)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 280, easing: EASE_OPEN },
    )
  }
  stagger(220)
}

async function animateClose() {
  const el = card.value
  if (!el || reducedMotion()) return
  el.getAnimations({ subtree: true }).forEach((animation) => animation.cancel())
  const mobile = isMobile()
  const from = visibleOrigin()
  let frames
  if (mobile) {
    frames = [{ transform: 'none' }, { transform: 'translateY(100%)' }]
  } else if (from) {
    frames = [
      { transformOrigin: '0 0', transform: 'none', opacity: 1 },
      { transformOrigin: '0 0', transform: flipTransform(from), opacity: 0 },
    ]
  } else {
    frames = [
      { opacity: 1, transform: 'none' },
      { opacity: 0, transform: 'translateY(12px)' },
    ]
  }
  const duration = mobile ? 260 : 300
  backdrop.value.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing: 'ease', fill: 'forwards' })
  await el
    .animate(frames, { duration, easing: EASE_CLOSE, fill: 'forwards' })
    .finished.catch(() => {})
}

// ---- Keyboard & focus ----

function onKeydown(event) {
  if (event.key === 'Escape') close()
}

// Keep Tab inside the dialog
function onCardKeydown(event) {
  if (event.key !== 'Tab') return
  const focusable = [...card.value.querySelectorAll('button, a[href], video[controls], iframe, [tabindex]:not([tabindex="-1"])')]
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && (document.activeElement === first || document.activeElement === card.value)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

// Safety net for what the Tab handler can't see, e.g. tabbing out of a cross-origin iframe
function onFocusIn(event) {
  if (card.value && !card.value.contains(event.target)) card.value.focus()
}

function setOpen(isOpen) {
  const method = isOpen ? 'addEventListener' : 'removeEventListener'
  document.documentElement.style.overflow = isOpen ? 'hidden' : ''
  document[method]('keydown', onKeydown)
  document[method]('focusin', onFocusIn)
}

watch(
  () => !!detail.value,
  async (isOpen) => {
    setOpen(isOpen)
    if (!isOpen) return
    await nextTick()
    card.value?.focus({ preventScroll: true })
    animateOpen()
  },
)

watch(closing, async (isClosing) => {
  if (!isClosing) return
  await animateClose()
  setOpen(false)
  finishClose()
})

// Switching project: same card, new content
watch(
  () => detail.value?.id,
  async (id, previous) => {
    if (!id || !previous) return
    await nextTick()
    const body = card.value?.querySelector('[data-modal-scroll]')
    if (body) body.scrollTop = 0
    // The button that switched may be gone (e.g. no "next" left, or now the current sibling)
    if (!card.value?.contains(document.activeElement)) card.value?.focus({ preventScroll: true })
    stagger(0)
  },
)

onMounted(startHistorySync)

onBeforeUnmount(() => {
  stopHistorySync()
  setOpen(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="detail" class="modal">
      <button
        ref="backdrop"
        type="button"
        class="modal__backdrop"
        tabindex="-1"
        aria-label="Close pop-up"
        @click="close"
      ></button>
      <div
        ref="card"
        class="modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        tabindex="-1"
        @keydown="onCardKeydown"
      >
        <ProjectDetail
          v-if="project"
          :project="project"
          :experience="experience"
          :siblings="siblings"
          @close="close"
          @switch="switchTo"
        />
        <template v-else>
          <DetailHeader :kind="detail.kind" :title="detail.title" :tagline="detail.subtitle" @close="close" />
          <div class="modal__body" data-modal-scroll>
            <div class="modal__placeholder" data-stagger>
              <span class="modal__placeholder-icon" aria-hidden="true"><IconConstruction :size="26" /></span>
              <p class="modal__placeholder-title">Under construction</p>
              <p class="modal__placeholder-text">The full story — images, details and results — is coming soon.</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__backdrop {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  border: none;
  background: var(--color-overlay);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  cursor: pointer;
}

.modal__card {
  position: relative;
  width: min(1100px, calc(100% - 48px));
  height: min(840px, calc(100vh - 48px));
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-xl);
  background: var(--color-bg);
  color: var(--color-ink);
  box-shadow: var(--shadow-modal);
  outline: none;
}

.modal__body {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 36px 48px 48px;
}

.modal__placeholder {
  flex: 1;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 32px;
  text-align: center;
  border: 1.5px dashed var(--color-line-dashed);
  border-radius: var(--radius-card);
}

.modal__placeholder-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  background: var(--color-tint);
  color: var(--color-accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.modal__placeholder-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 28px;
}

.modal__placeholder-text {
  max-width: 420px;
  font-size: var(--fs-small);
  color: var(--color-muted);
}

/* Mobile: full-screen sheet */
@media (max-width: 700px) {
  .modal__card {
    width: 100%;
    height: 100%;
    border-radius: 0;
    box-shadow: none;
  }

  .modal__body {
    padding: 20px 16px 32px;
  }
}
</style>
