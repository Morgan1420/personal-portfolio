<script setup>
import NavBar from './components/layout/NavBar.vue'
import HeroSection from './components/sections/HeroSection.vue'
import AboutSection from './components/sections/AboutSection.vue'
import ExperienceSection from './components/sections/ExperienceSection.vue'
import DetailModal from './components/ui/DetailModal.vue'
</script>

<template>
  <NavBar />
  <main>
    <HeroSection />
    <AboutSection />
    <ExperienceSection />
  </main>
  <DetailModal />
</template>
