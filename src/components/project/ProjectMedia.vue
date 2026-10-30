<script setup>
// Media viewer: one frame + thumbnails. Only the selected item is mounted, so switching
// stops any playing video and other images aren't loaded until selected.
import { computed, ref } from 'vue'
import { parseYouTubeId, youTubeThumbnail } from '../../utils/media.js'
import IconPlay from '../ui/icons/IconPlay.vue'
import YouTubeLite from './YouTubeLite.vue'

const FIT_TOLERANCE = 0.15

const props = defineProps({
  items: { type: Array, required: true }, // already filtered with isValidMedia
})

const index = ref(0)
const measuredFit = ref({}) // src → 'cover' | 'contain'

const current = computed(() => props.items[index.value])
const youTubeId = computed(() => (current.value.type === 'youtube' ? parseYouTubeId(current.value.url) : null))

const imageStyle = computed(() => ({
  objectFit: current.value.fit || measuredFit.value[current.value.src] || 'contain',
  objectPosition: current.value.focus || 'center',
}))

// Close to the frame's shape: fill it. Anything else: show it whole, on pale bands.
function onImageLoad(event) {
  const image = event.target
  const frame = image.parentElement
  if (!image.naturalWidth || !frame.clientHeight) return
  const ratio = image.naturalWidth / image.naturalHeight / (frame.clientWidth / frame.clientHeight)
  measuredFit.value[image.getAttribute('src')] = Math.abs(ratio - 1) <= FIT_TOLERANCE ? 'cover' : 'contain'
}

function thumbnailOf(item) {
  if (item.type === 'image') return item.src
  if (item.type === 'video') return item.poster || ''
  return youTubeThumbnail(parseYouTubeId(item.url))
}

function thumbnailLabel(item, i) {
  const name = `${item.type === 'image' ? 'Image' : 'Video'} ${i + 1}`
  return item.alt ? `${name}: ${item.alt}` : name
}
</script>

<template>
  <figure class="media">
    <div class="media__frame">
      <img
        v-if="current.type === 'image'"
        :key="current.src"
        class="media__image"
        :src="current.src"
        :alt="current.alt || ''"
        :style="imageStyle"
        loading="lazy"
        @load="onImageLoad"
      />
      <video
        v-else-if="current.type === 'video'"
        :key="current.src"
        class="media__video"
        :src="current.src"
        :poster="current.poster || undefined"
        :aria-label="current.alt || undefined"
        controls
        playsinline
        preload="metadata"
      ></video>
      <YouTubeLite v-else :key="youTubeId" :id="youTubeId" :start="current.start || 0" :alt="current.alt || undefined" />
      <span v-if="items.length > 1" class="media__counter">{{ index + 1 }} / {{ items.length }}</span>
    </div>

    <div v-if="items.length > 1" class="media__thumbs">
      <button
        v-for="(item, i) in items"
        :key="i"
        type="button"
        class="media__thumb"
        :class="{ 'is-selected': i === index }"
        :aria-label="thumbnailLabel(item, i)"
        :aria-pressed="i === index"
        @click="index = i"
      >
        <img v-if="thumbnailOf(item)" class="media__thumb-image" :src="thumbnailOf(item)" alt="" loading="lazy" />
        <span v-if="item.type !== 'image'" class="media__thumb-play" aria-hidden="true"><IconPlay /></span>
      </button>
    </div>

    <figcaption v-if="current.caption" class="media__caption">{{ current.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.media {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Fixed shape: the pop-up never changes height when switching items */
.media__frame {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-tint);
}

.media__image,
.media__video {
  width: 100%;
  height: 100%;
}

.media__video {
  object-fit: cover;
  background: var(--color-ink);
}

.media__counter {
  position: absolute;
  right: 14px;
  bottom: 14px;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: var(--color-media-chip);
  color: var(--color-on-accent);
  font-family: var(--font-mono);
  font-size: var(--fs-label-sm);
  pointer-events: none;
}

.media__thumbs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
  gap: 10px;
}

.media__thumb {
  position: relative;
  aspect-ratio: 4 / 3;
  padding: 0;
  border-radius: var(--radius-lane);
  border: 2px solid transparent;
  background: var(--color-tint);
  overflow: hidden;
  cursor: pointer;
  transition: border-color var(--dur) ease;
}

.media__thumb:hover,
.media__thumb:focus-visible {
  border-color: var(--color-line-dashed);
}

.media__thumb.is-selected {
  border-color: var(--color-accent);
  background: var(--color-tint-2);
}

.media__thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media__thumb-play {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 26px;
  height: 26px;
  margin: -13px 0 0 -13px;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-on-accent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.media__caption {
  font-size: var(--fs-caption);
  color: var(--color-muted);
}

@media (max-width: 700px) {
  .media__frame {
    aspect-ratio: 4 / 3;
  }
}
</style>
