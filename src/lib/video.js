import { useEffect } from 'react'
import { prefersReducedMotion } from './util'

// Films play while they're on screen and pause when they leave.
let observer
function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      entries => entries.forEach(({ target, isIntersecting }) => (isIntersecting ? play(target) : target.pause())),
      { threshold: 0.3 },
    )
  }
  return observer
}

export function play(video) {
  const p = video.play()
  if (p) p.catch(() => {})
}

export function useAutoplay(ref, enabled = true) {
  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    if (!enabled || prefersReducedMotion()) return
    const o = getObserver()
    o.observe(v)
    return () => o.unobserve(v)
  }, [ref, enabled])
}

// Films that keep running while you're elsewhere on the site (the home page's hero film).
// Each gets one video element, reused whenever the film is shown again, so coming back
// doesn't reload it or flash its poster. It keeps time with the page's clock from the
// moment the site loaded, like the sound wave: whenever it starts playing (coming back to
// the page, or scrolling back up to it) it picks up where it would have got to had it been
// playing all along. `start` shifts that clock, in seconds (it skips a slow fade-in).
const kept = new Map()

export function keptVideo(src, { poster, start = 0, label } = {}) {
  if (kept.has(src)) return kept.get(src)
  const v = document.createElement('video')
  Object.assign(v, { src, poster: poster || '', muted: true, defaultMuted: true, loop: true, playsInline: true, preload: 'auto' })
  // The same locks as every other film (see LOCKED_VIDEO in components/Media.jsx).
  v.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback noplaybackrate')
  Object.assign(v, { disablePictureInPicture: true, disableRemotePlayback: true, draggable: false })
  if (label) v.setAttribute('aria-label', label)
  const sync = () => {
    if (!v.duration) return
    const at = (performance.now() / 1000 + start) % v.duration
    if (Math.abs(v.currentTime - at) > 0.3) v.currentTime = at
  }
  v.addEventListener('loadedmetadata', sync)
  v.addEventListener('play', sync)
  kept.set(src, v)
  return v
}

// Plays a film while it's on screen (as useAutoplay does). Returns a function that stops.
export function watch(video) {
  if (prefersReducedMotion()) return () => {}
  const o = getObserver()
  o.observe(video)
  return () => o.unobserve(video)
}

// Only one film makes sound at a time.
let audible = null
const listeners = new Set()

export function setSound(video, on) {
  if (on) {
    if (audible && audible !== video) audible.muted = true
    video.muted = false
    audible = video
    play(video)
  } else {
    video.muted = true
    if (audible === video) audible = null
  }
  listeners.forEach(fn => fn())
}

export const isAudible = video => !!video && audible === video && !video.muted

export function onSoundChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
