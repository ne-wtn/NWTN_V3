import { useRef } from 'react'
import Media from './Media'
import SmartLink from './SmartLink'
import SoundWave from './SoundWave'
import { useRibbon, ribbonClass } from '../lib/useRibbon'

// A full-width coloured band: label, title, body, button, and media that runs off the page edge.
//   tone:   'sky' | 'sand' | 'deep' | 'mist' | 'white'
//   layout: 'split' | 'split-reverse' | 'wide'
//   ribbon: draws ribbons behind the band as it scrolls into view (a route name from lib/ribbons.js)
//   soundwave: a playing sound wave just above the paragraph: true, or { levels: 'media/levels/….lvl', start }
export default function Band({ band, ribbon = band.ribbon }) {
  const { tone = 'white', layout = 'split', label, title, body, cta, media, caption, soundwave } = band
  const section = useRef(null)

  useRibbon(section, ribbon)

  const figure = (
    <figure className="band-media">
      <Media media={media} placeholder={caption || 'Image to come'} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )

  if (layout === 'wide') {
    return (
      <section ref={section} className={`band band--${tone} band--wide${ribbonClass(ribbon)}`}>
        <div className="wrap band-wide">
          <div>
            {label && <p className="band-label">{label}</p>}
            <h2>{title}</h2>
          </div>
          <div>
            {soundwave && <SoundWave {...(soundwave === true ? {} : soundwave)} />}
            {body && <p className="band-body">{body}</p>}
            {cta && <SmartLink className={`btn ${tone === 'deep' ? 'btn--light' : ''}`} link={cta} />}
          </div>
          {figure}
        </div>
      </section>
    )
  }

  return (
    <section ref={section} className={`band band--${tone}${ribbonClass(ribbon)}`}>
      <div className={`wrap band-split ${layout === 'split-reverse' ? 'band-split--reverse' : ''}`}>
        <div className="band-copy">
          {label && <p className="band-label">{label}</p>}
          <h2>{title}</h2>
          {soundwave && <SoundWave {...(soundwave === true ? {} : soundwave)} />}
          {body && <p className="band-body">{body}</p>}
          {cta && <SmartLink className={`btn ${tone === 'deep' ? 'btn--light' : ''}`} link={cta} />}
        </div>
        {figure}
      </div>
    </section>
  )
}
