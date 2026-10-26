<script setup>
import portrait from '../../assets/images/Persona/iFest_parlant_de_cara.jpeg'
import cvFile from '../../assets/CV_Jan-Moran.pdf'
import IconMail from '../ui/icons/IconMail.vue'
import IconDownload from '../ui/icons/IconDownload.vue'
import IconArrowDown from '../ui/icons/IconArrowDown.vue'
import IconGithub from '../ui/icons/IconGithub.vue'
import IconLinkedin from '../ui/icons/IconLinkedin.vue'
import IconYoutube from '../ui/icons/IconYoutube.vue'

const socials = [
  { label: 'GitHub', href: 'https://github.com/Morgan1420', icon: IconGithub },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/jan-moran', icon: IconLinkedin },
  { label: 'YouTube', href: 'https://www.youtube.com/@j-moran', icon: IconYoutube },
]
</script>

<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="hero__text">
      <p class="hero__eyebrow">
        <span class="hero__rule" aria-hidden="true"></span>
        Telecom &amp; Computer Engineer · Entrepreneur
      </p>
      <h1 id="hero-title" class="hero__title">
        Jan Moran<br /><span class="hero__accent">Ricardo</span>
      </h1>
      <p class="hero__lead">
        I turn high-level engineering concepts into tangible products that solve real-world problems — from
        satellite-tracking antennas to a startup of my own.
      </p>

      <div class="hero__actions">
        <a href="mailto:jan.moran.r@gmail.com" class="hero-btn hero-btn--filled">
          <IconMail :size="18" />
          Contact me
        </a>
        <a :href="cvFile" download="CV_Jan-Moran.pdf" class="hero-btn hero-btn--outline">
          <IconDownload :size="18" />
          Download CV
        </a>
        <span class="hero__divider" aria-hidden="true"></span>
        <a
          v-for="social in socials"
          :key="social.label"
          :href="social.href"
          :aria-label="social.label"
          class="hero-social"
          :target="social.href.startsWith('http') ? '_blank' : undefined"
          rel="noopener noreferrer"
        >
          <component :is="social.icon" />
        </a>
      </div>
    </div>

    <div class="hero__media">
      <div class="hero__backdrop" aria-hidden="true"></div>
      <img :src="portrait" alt="Portrait of Jan Moran" class="hero__photo" width="773" height="962" />
      <p class="hero__badge">
        <span class="hero__status" aria-hidden="true"></span>
        Open to opportunities
      </p>
    </div>

    <a href="#about" class="hero__scroll">
      Scroll
      <IconArrowDown :size="16" />
    </a>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  max-width: var(--container);
  min-height: clamp(620px, calc(100vh - var(--nav-height)), 960px);
  margin: 0 auto;
  padding: 56px var(--gutter) 112px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  gap: 64px;
}

.hero__text {
  flex: 1 1 520px;
  min-width: 0;
}

.hero__eyebrow {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.04em;
  color: var(--color-accent);
}

.hero__rule {
  flex: 0 0 auto;
  width: 28px;
  height: 2px;
  background: var(--color-accent);
}

.hero__title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--fs-hero);
  line-height: 0.95;
  letter-spacing: -0.03em;
}

.hero__accent {
  color: var(--color-accent);
}

.hero__lead {
  margin-top: 28px;
  max-width: 540px;
  font-size: var(--fs-lead);
  line-height: 1.55;
  color: var(--color-ink-2);
}

/* Fixed min-height so growing buttons never move the content above */
.hero__actions {
  margin-top: 40px;
  min-height: 64px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}

.hero__divider {
  width: 1px;
  height: 32px;
  margin: 0 6px;
  background: var(--color-line-strong);
}

.hero-btn,
.hero-social {
  box-sizing: border-box;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--color-ink);
  color: var(--color-ink);
  text-decoration: none;
  transition:
    background-color var(--dur) ease,
    color var(--dur) ease,
    border-color var(--dur) ease,
    padding var(--dur) ease,
    min-height var(--dur) ease,
    width var(--dur) ease,
    height var(--dur) ease,
    box-shadow var(--dur) ease,
    transform 0.12s ease;
}

.hero-btn {
  gap: 10px;
  min-height: 52px;
  padding: 0 26px;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 16px;
}

.hero-btn--filled {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-on-accent);
}

.hero-btn--outline {
  background: transparent;
}

.hero-social {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--color-surface);
}

.hero-btn:hover,
.hero-btn:focus-visible,
.hero-social:hover,
.hero-social:focus-visible {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-on-accent);
  box-shadow: var(--shadow-button-hover);
}

.hero-btn:hover,
.hero-btn:focus-visible {
  min-height: 58px;
  padding: 0 32px;
}

.hero-social:hover,
.hero-social:focus-visible {
  width: 58px;
  height: 58px;
}

.hero-btn:active,
.hero-social:active {
  transform: scale(0.96);
}

.hero__media {
  position: relative;
  flex: 0 1 400px;
  min-width: 260px;
  margin: 0 auto;
}

.hero__backdrop {
  position: absolute;
  inset: 24px -24px -24px 24px;
  border-radius: var(--radius-xl);
  background: var(--color-accent);
}

.hero__photo {
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 519 / 589;
  object-fit: cover;
  border-radius: var(--radius-xl);
  background: var(--color-tint);
}

.hero__badge {
  position: absolute;
  left: -20px;
  bottom: 36px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-xs);
  box-shadow: var(--shadow-badge);
  font-size: var(--fs-caption);
  font-weight: 500;
}

.hero__status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-status);
}

.hero__scroll {
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 44px;
  color: var(--color-muted);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: var(--fs-label-sm);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero__scroll:hover,
.hero__scroll:focus-visible {
  color: var(--color-accent);
}
</style>
