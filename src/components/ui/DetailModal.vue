<script setup>
// Project / education pop-up. Placeholder content for now — see DESIGN.md "Detail pop-up".
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useDetailModal } from '../../composables/useDetailModal.js'
import IconClose from './icons/IconClose.vue'
import IconConstruction from './icons/IconConstruction.vue'

const { detail, closeDetail } = useDetailModal()
const card = ref(null)

function onKeydown(event) {
  if (event.key === 'Escape') closeDetail()
}

// Keep Tab inside the dialog
function onCardKeydown(event) {
  if (event.key !== 'Tab') return
  const focusable = [...card.value.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')]
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

function setOpen(isOpen) {
  document.documentElement.style.overflow = isOpen ? 'hidden' : ''
  document[isOpen ? 'addEventListener' : 'removeEventListener']('keydown', onKeydown)
}

watch(
  () => !!detail.value,
  async (isOpen) => {
    setOpen(isOpen)
    if (isOpen) {
      await nextTick()
      card.value?.focus()
    }
  },
)

onBeforeUnmount(() => setOpen(false))
</script>

<template>
  <Teleport to="body">
    <div v-if="detail" class="modal">
      <button type="button" class="modal__backdrop" tabindex="-1" aria-label="Close pop-up" @click="closeDetail"></button>
      <div
        ref="card"
        class="modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        tabindex="-1"
        @keydown="onCardKeydown"
      >
        <div class="modal__head">
          <div class="modal__heading">
            <span class="modal__kind">{{ detail.kind }}</span>
            <h2 id="detail-title" class="modal__title">{{ detail.title }}</h2>
            <p v-if="detail.subtitle" class="modal__subtitle">{{ detail.subtitle }}</p>
          </div>
          <button type="button" class="modal__close" aria-label="Close" @click="closeDetail">
            <IconClose />
          </button>
        </div>

        <div class="modal__placeholder">
          <span class="modal__placeholder-icon" aria-hidden="true"><IconConstruction :size="26" /></span>
          <p class="modal__placeholder-title">Under construction</p>
          <p class="modal__placeholder-text">The full story — images, details and results — is coming soon.</p>
        </div>
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
  padding: var(--gutter);
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
  animation: fade-in 0.2s ease both;
}

.modal__card {
  position: relative;
  width: min(1100px, 100%);
  height: min(760px, calc(100vh - 48px));
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: clamp(28px, 5vw, 56px);
  border-radius: var(--radius-xl);
  background: var(--color-bg);
  color: var(--color-ink);
  box-shadow: var(--shadow-modal);
  outline: none;
  animation: pop-in 0.28s var(--ease-out) both;
}

.modal__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.modal__heading {
  min-width: 0;
}

.modal__kind {
  display: inline-flex;
  padding: 6px 12px;
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: var(--fs-label-sm);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.modal__title {
  margin-top: 20px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--fs-modal-title);
  line-height: 1.02;
  letter-spacing: -0.02em;
}

.modal__subtitle {
  margin-top: 12px;
  font-size: var(--fs-body);
  color: var(--color-muted);
}

.modal__close {
  flex: 0 0 auto;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1.5px solid var(--color-ink);
  background: var(--color-surface);
  color: var(--color-ink);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background-color var(--dur) ease,
    color var(--dur) ease,
    transform var(--dur) ease;
}

.modal__close:hover,
.modal__close:focus-visible {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-on-accent);
  transform: rotate(90deg);
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

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pop-in {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
