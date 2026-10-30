// Helpers for project media items (docs/PROJECT_POPUP.md §4).

const YOUTUBE_HOSTS = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com']

/** Video id from a watch?v=, youtu.be/, /shorts/ or /embed/ URL; null if it isn't one. */
export function parseYouTubeId(url) {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1).split('/')[0] || null
  if (!YOUTUBE_HOSTS.includes(parsed.hostname)) return null
  const fromPath = parsed.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/)
  return fromPath ? fromPath[1] : parsed.searchParams.get('v')
}

export const youTubeThumbnail = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

/** Items the viewer can actually show: unknown types and missing sources are skipped. */
export function isValidMedia(item) {
  if (item?.type === 'image' || item?.type === 'video') return !!item.src
  if (item?.type === 'youtube') return !!parseYouTubeId(item.url)
  return false
}
