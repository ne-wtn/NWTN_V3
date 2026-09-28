import { useEffect, useRef, useState } from 'react'
import { asset, prefersReducedMotion } from '../lib/util'
import { opened } from '../lib/opening'

// A 3D model (.glb) in place of a headline card. The 3D code loads only when one is on the page.
// Its file downloads straight away, but it's only set up once the page has opened (lib/opening.js),
// so the 3D work never holds up or stutters the page coming in; then it fades in (see pages.css).
// If 3D isn't available, the slot stays empty rather than showing a broken box.

// Models that are ready at the same moment (e.g. from the cache) appear one after another.
const STAGGER = 140 // ms
let nextShow = 0

export default function InlineModel({ item }) {
  const canvas = useRef(null)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cleanup = () => {}
    let cancelled = false
    let timer = 0
    const show = enter => {
      const now = performance.now()
      nextShow = Math.max(now, nextShow + STAGGER)
      timer = setTimeout(() => { setReady(true); enter() }, nextShow - now)
    }
    import('../lib/model3d')
      .then(model => {
        model.preloadModel(asset(item.src)).catch(() => {})
        return opened.then(() => model)
      })
      .then(({ mountModel }) => {
        if (cancelled || !canvas.current) return
        cleanup = mountModel(canvas.current, asset(item.src), {
          rotate: item.rotate, crop: item.crop, range: item.range, scale: item.scale,
          still: prefersReducedMotion(), onReady: show, onError: () => setFailed(true),
        })
      })
      .catch(() => setFailed(true))
    return () => { cancelled = true; clearTimeout(timer); cleanup() }
  }, [item.src, item.rotate, item.crop, item.range, item.scale])

  return (
    <span className={`inline-media inline-model${ready ? ' is-ready' : ''}`} role="img" aria-label={item.label} style={item.width ? { width: `${item.width}em` } : undefined}>
      {!failed && <canvas ref={canvas} />}
    </span>
  )
}
