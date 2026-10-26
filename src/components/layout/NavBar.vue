<script setup>
import LanguagePicker from './LanguagePicker.vue'

// Order matches the sections on the page.
const links = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#achievements', label: 'Achievements' },
  { href: '#skills', label: 'Skills' },
  { href: '#gallery', label: 'Gallery' },
]
</script>

<template>
  <header class="nav-header">
    <nav class="nav" aria-label="Main">
      <a href="#top" class="nav__brand">
        <span class="nav__badge" aria-hidden="true">JM</span>
        Jan Moran Ricardo
      </a>

      <div class="nav__links">
        <a v-for="link in links" :key="link.href" :href="link.href" class="nav__link hover-underline">
          {{ link.label }}
        </a>
        <a href="#contact" class="nav__contact">Contact</a>
        <LanguagePicker />
      </div>
    </nav>
  </header>
</template>

<style scoped>
.nav-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--color-nav-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-line);
}

.nav {
  max-width: var(--container);
  margin: 0 auto;
  padding: 14px var(--gutter);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.nav__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 22px;
  color: var(--color-ink);
  text-decoration: none;
}

.nav__brand:hover {
  color: var(--color-ink);
}

.nav__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-logo);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-size: 16px;
}

.nav__links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 22px;
  font-size: var(--fs-small);
  font-weight: 500;
}

.nav__link {
  padding: 10px 0;
  color: var(--color-ink-2);
  text-decoration: none;
}

.nav__link:hover {
  color: var(--color-ink-2);
}

.nav__contact {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 20px;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color var(--dur) ease,
    color var(--dur) ease,
    box-shadow var(--dur) ease,
    transform 0.12s ease;
}

.nav__contact:hover,
.nav__contact:focus-visible {
  background: transparent;
  color: var(--color-accent);
  box-shadow: inset 0 0 0 1.5px var(--color-accent);
}

.nav__contact:active {
  transform: scale(0.96);
}
</style>
