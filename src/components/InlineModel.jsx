import { useEffect, useRef, useState } from 'react'
import { asset, prefersReducedMotion } from '../lib/util'

// A 3D model (.glb) in place of a headline card. The 3D code loads only when one is on the page.
// If 3D isn't available, the slot stays empty rather than showing a broken box.
export default function InlineModel({ item }) {
  const canvas = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cleanup = () => {}
    let cancelled = false
    import('../lib/model3d')
      .then(({ mountModel }) => {
        if (cancelled || !canvas.current) return
        cleanup = mountModel(canvas.current, asset(item.src), {
          rotate: item.rotate, crop: item.crop, range: item.range, scale: item.scale,
          still: prefersReducedMotion(), onError: () => setFailed(true),
        })
      })
      .catch(() => setFailed(true))
    return () => { cancelled = true; cleanup() }
  }, [item.src, item.rotate, item.crop, item.range, item.scale])

  return (
    <span className="inline-media inline-model" role="img" aria-label={item.label} style={item.width ? { width: `${item.width}em` } : undefined}>
      {!failed && <canvas ref={canvas} />}
    </span>
  )
}
