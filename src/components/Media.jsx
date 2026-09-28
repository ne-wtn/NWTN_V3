import { useEffect, useRef, useState } from 'react'
import { asset } from '../lib/util'
import { useAutoplay, setSound, isAudible, onSoundChange, keptVideo, watch } from '../lib/video'
import InlineModel from './InlineModel'

// Films only do what the site tells them: no download button, picture-in-picture,
// casting or dragging. (The right-click menu is blocked in Layout.)
export const LOCKED_VIDEO = {
  controlsList: 'nodownload nofullscreen noremoteplayback noplaybackrate',
  disablePictureInPicture: true,
  disableRemotePlayback: true,
  draggable: false,
}

// One component for every image, film and placeholder on the site.
//   media = { type: 'video', src, poster, start } | { type: 'image', src, alt, width, height } | null
//   An image's width and height (its pixel size) let the page save its space before it loads.
// null shows a placeholder frame with `placeholder` written in it.
// `persist` keeps a film running while you're elsewhere on the site (see keptVideo).
export default function Media({ media, placeholder = 'Image to come', className = '', ratio, autoplay = true, videoRef, persist = false }) {
  const own = useRef(null)
  const ref = videoRef || own
  useAutoplay(ref, media?.type === 'video' && autoplay && !persist)
  const style = ratio ? { aspectRatio: ratio } : undefined

  if (media?.type === 'video' && persist) {
    return <KeptVideo media={media} className={className} style={style} videoRef={ref} />
  }

  if (!media) {
    return (
      <div className={`media media--empty ${className}`} style={style}>
        <span>{placeholder}</span>
      </div>
    )
  }
  if (media.type === 'video') {
    const src = asset(media.src) + (media.start ? `#t=${media.start}` : '')
    return (
      <div className={`media ${className}`} style={style}>
        <video ref={ref} src={src} poster={asset(media.poster)} muted loop playsInline preload="none" aria-label={media.alt} {...LOCKED_VIDEO} />
      </div>
    )
  }
  return (
    <div className={`media ${className}`} style={style}>
      <img src={asset(media.src)} alt={media.alt || ''} width={media.width} height={media.height} loading="lazy" decoding="async" draggable={false} />
    </div>
  )
}

// A film that keeps running while you're elsewhere on the site: the same video element is
// put back each time, picking up where the site's clock says it should be.
function KeptVideo({ media, className, style, videoRef }) {
  const holder = useRef(null)
  const { src, poster, start, alt } = media
  useEffect(() => {
    const v = keptVideo(asset(src), { poster: asset(poster), start, label: alt })
    holder.current.append(v)
    videoRef.current = v
    const stop = watch(v)
    return () => {
      stop()
      setSound(v, false) // back to muted, the way it is on a first visit
      v.remove() // taking it out of the page pauses it
      if (videoRef.current === v) videoRef.current = null
    }
  }, [src, poster, start, alt, videoRef])
  return <div ref={holder} className={`media ${className}`} style={style} />
}

// "Sound on / Sound off" for the film in `videoRef`.
export function SoundToggle({ videoRef }) {
  const [, rerender] = useState(0)
  useEffect(() => onSoundChange(() => rerender(n => n + 1)), [])
  const on = isAudible(videoRef.current)
  return (
    <button
      type="button"
      className="link-button"
      aria-pressed={on}
      onClick={() => videoRef.current && setSound(videoRef.current, !on)}
    >
      {on ? 'Sound off' : 'Sound on'}
    </button>
  )
}

// Small media set inside a line of text (the home headline): a video, an image or a 3D model.
export function InlineMedia({ item }) {
  const ref = useRef(null)
  useAutoplay(ref, item.type === 'video')
  if (item.type === 'model') return <InlineModel item={item} />
  if (item.type === 'video') {
    return <video ref={ref} className="inline-media" src={asset(item.src)} muted loop playsInline preload="auto" aria-label={item.label} {...LOCKED_VIDEO} />
  }
  return <img className="inline-media" src={asset(item.src)} alt={item.label || ''} draggable={false} />
}
