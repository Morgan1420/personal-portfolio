<script setup>
import ExperienceTimeline from '../timeline/ExperienceTimeline.vue'
</script>

<template>
  <!-- position: relative anchors the timeline's edge-scroll zones (full section height) -->
  <section id="experience" class="experience" aria-labelledby="experience-title">
    <div class="container experience__header">
      <p class="section-label experience__label">02 — Experience</p>
      <h2 id="experience-title" class="experience__title">Where I've worked</h2>
    </div>
    <ExperienceTimeline />
  </section>
</template>

<style scoped>
.experience {
  position: relative;
  padding: var(--section-pad) 0 0;
}

.experience__header {
  margin-bottom: 20px;
}

.experience__label {
  margin-bottom: 12px;
}

.experience__title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--fs-h2);
  line-height: 1.05;
  letter-spacing: -0.02em;
}
</style>
