import { useEffect, useRef, useState } from 'react'
import { asset } from '../lib/util'
import { useAutoplay, setSound, isAudible, onSoundChange } from '../lib/video'
import InlineModel from './InlineModel'

// Films only do what the site tells them: no download button, picture-in-picture,
// casting or dragging. (The right-click menu is blocked in Layout.)
const LOCKED_VIDEO = {
  controlsList: 'nodownload nofullscreen noremoteplayback noplaybackrate',
  disablePictureInPicture: true,
  disableRemotePlayback: true,
  draggable: false,
}

// One component for every image, film and placeholder on the site.
//   media = { type: 'video', src, poster, start } | { type: 'image', src, alt, width, height } | null
//   An image's width and height (its pixel size) let the page save its space before it loads.
// null shows a placeholder frame with `placeholder` written in it.
export default function Media({ media, placeholder = 'Image to come', className = '', ratio, autoplay = true, videoRef }) {
  const own = useRef(null)
  const ref = videoRef || own
  useAutoplay(ref, media?.type === 'video' && autoplay)
  const style = ratio ? { aspectRatio: ratio } : undefined

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
