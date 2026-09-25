import { useEffect, useRef } from 'react'
import { startSoundwave } from '../lib/soundwave'
import { asset, prefersReducedMotion } from '../lib/util'

// A playing sound wave (see lib/soundwave.js). Decorative, so screen readers skip it.
//   levels: a .lvl file made from a song with tools/levels.py (optional)
//   start:  second of the song to start from
export default function SoundWave({ levels, start = 0 }) {
  const box = useRef(null)
  useEffect(
    () => startSoundwave(box.current, { still: prefersReducedMotion(), levels: levels ? asset(levels) : null, start }),
    [levels, start],
  )
  return <div ref={box} className="soundwave" aria-hidden="true" />
}
