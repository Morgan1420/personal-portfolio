<script setup>
import { education } from '../../assets/JSONs/projects_education.json'
import IconAntenna from '../ui/icons/IconAntenna.vue'
import IconMonitor from '../ui/icons/IconMonitor.vue'
import IconPen from '../ui/icons/IconPen.vue'

const degreeIcons = {
  'telecom-eng': IconAntenna,
  'computer-eng': IconMonitor,
}

const year = (date) => (date ? date.slice(0, 4) : 'Present')

const degrees = education.map((entry) => ({
  id: entry.id,
  title: entry.degree,
  meta: `${entry.institution.name} · ${year(entry.start)} – ${year(entry.end)}`,
  icon: degreeIcons[entry.id] ?? IconMonitor,
}))

const spokenLanguages = [
  { code: 'CA', title: 'Catalan — native', strong: true },
  { code: 'ES', title: 'Spanish — native', strong: true },
  { code: 'EN', title: 'English — C1', strong: true },
  { code: 'LT', title: 'Lithuanian — A1', strong: false },
  { code: 'DE', title: 'German — A1', strong: false },
]
</script>

<template>
  <section id="about" class="about" aria-labelledby="about-title">
    <div class="container about__inner">
      <p class="section-label about__label">01 — About me</p>

      <div class="about__columns">
        <div class="about__text">
          <h2 id="about-title" class="about__title">
            Dual engineer <span class="about__accent">&amp; entrepreneur</span>
          </h2>
          <p class="about__paragraph">
            I'm a Telecommunications and Computer Engineer driven by empirical learning and proactive
            problem-solving. My work spans the whole stack of a telecom system — rotating antennas, embedded systems,
            software-defined radios and signal processing — up to the web apps that show the data.
          </p>
          <p class="about__paragraph">
            Alongside engineering, I'm co-founding BitSpace, a digital-health startup that has taught me to think
            like a founder, not just a builder. And you'll usually find me at a hackathon, pitching an idea to anyone
            who will listen.
          </p>
        </div>

        <div class="about__cards">
          <div class="card card--education">
            <div class="card__header">
              <h3 class="card__label">Education</h3>
              <span class="card__pill">Dual degree</span>
            </div>
            <ul class="degrees">
              <li v-for="degree in degrees" :key="degree.id" class="degree">
                <span class="degree__icon" aria-hidden="true">
                  <component :is="degree.icon" />
                </span>
                <div class="degree__body">
                  <p class="degree__title">{{ degree.title }}</p>
                  <p class="degree__meta">{{ degree.meta }}</p>
                </div>
              </li>
            </ul>
          </div>

          <div class="card card--languages">
            <h3 class="card__label card__label--fixed">Languages</h3>
            <div class="languages">
              <abbr
                v-for="lang in spokenLanguages"
                :key="lang.code"
                :title="lang.title"
                class="languages__code"
                :class="{ 'is-strong': lang.strong }"
              >
                {{ lang.code }}
              </abbr>
            </div>
            <p class="languages__note">
              <IconPen :size="14" class="languages__note-icon" />
              <span>This site is available in every language I speak</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  background: var(--color-surface);
  border-top: 1px solid var(--color-line);
  border-bottom: 1px solid var(--color-line);
}

.about__inner {
  padding-top: 72px;
  padding-bottom: 72px;
}

/* Label on its own row so both columns' tops align */
.about__label {
  margin-bottom: 20px;
}

.about__columns {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 48px;
}

.about__text {
  flex: 1.5 1 480px;
  min-width: 0;
}

.about__title {
  margin-bottom: 22px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--fs-h2-about);
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.about__accent {
  color: var(--color-accent);
}

.about__paragraph {
  max-width: 600px;
  font-size: var(--fs-body);
  line-height: 1.7;
  color: var(--color-ink-2);
}

.about__paragraph + .about__paragraph {
  margin-top: 14px;
}

.about__cards {
  flex: 1 1 360px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  background: var(--color-bg);
}

.card__label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-label-sm);
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.card--education {
  border-radius: var(--radius-md);
  padding: 22px 24px 8px;
}

.card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}

.card__pill {
  font-family: var(--font-mono);
  font-size: var(--fs-label-sm);
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
}

.degrees {
  margin: 0;
  padding: 0;
  list-style: none;
}

.degree {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 0;
}

.degree + .degree {
  border-top: 1px solid var(--color-line);
}

.degree__icon {
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lane);
  background: var(--color-accent);
  color: var(--color-on-accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.degree__body {
  min-width: 0;
}

.degree__title {
  font-weight: 600;
  font-size: var(--fs-body);
  line-height: 1.35;
}

.degree__meta {
  margin-top: 3px;
  font-size: var(--fs-caption);
  color: var(--color-muted);
}

.card--languages {
  border-radius: var(--radius-sm);
  padding: 18px 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 16px;
}

.card__label--fixed {
  flex: 0 0 96px;
}

.languages {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  font-family: var(--font-mono);
  font-size: var(--fs-small);
}

.languages__code {
  text-decoration: none;
  font-weight: 400;
  color: var(--color-muted);
  cursor: help;
}

.languages__code.is-strong {
  font-weight: 700;
  color: var(--color-ink);
}

.languages__note {
  flex: 1 1 100%;
  padding-top: 12px;
  border-top: 1px solid var(--color-line);
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: var(--fs-label-sm);
  line-height: 1.5;
  color: var(--color-muted);
}

.languages__note-icon {
  flex: 0 0 auto;
  margin-top: 2px;
}
</style>
