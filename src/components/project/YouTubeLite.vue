<script setup>
// Lite embed: only a thumbnail until clicked, so nothing loads from YouTube's player before that.
import { nextTick, ref } from 'vue'
import { youTubeThumbnail } from '../../utils/media.js'
import IconPlay from '../ui/icons/IconPlay.vue'

const props = defineProps({
  id: { type: String, required: true },
  start: { type: Number, default: 0 },
  alt: { type: String, default: 'Play video' },
})

const playing = ref(false)
const player = ref(null)

async function play() {
  playing.value = true
  await nextTick()
  player.value?.focus() // the play button is gone: don't drop focus out of the dialog
}

const embedUrl = () => `https://www.youtube-nocookie.com/embed/${props.id}?autoplay=1&rel=0&start=${props.start}`
</script>

<template>
  <iframe
    v-if="playing"
    ref="player"
    class="yt__player"
    :src="embedUrl()"
    :title="alt"
    allow="autoplay; encrypted-media; picture-in-picture"
    allowfullscreen
    referrerpolicy="strict-origin-when-cross-origin"
  ></iframe>
  <button v-else type="button" class="yt__poster" :aria-label="alt" @click="play">
    <img class="yt__image" :src="youTubeThumbnail(id)" alt="" />
    <span class="yt__play" aria-hidden="true"><IconPlay :size="26" /></span>
  </button>
</template>

<style scoped>
.yt__player,
.yt__poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.yt__poster {
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.yt__poster:focus-visible {
  outline-offset: -4px;
}

.yt__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.yt__play {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 64px;
  height: 64px;
  margin: -32px 0 0 -32px;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-on-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--dur) ease;
}

.yt__poster:hover .yt__play,
.yt__poster:focus-visible .yt__play {
  transform: scale(1.1);
}
</style>
