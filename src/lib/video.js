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
