import Media from './Media'
import SmartLink from './SmartLink'

// A full-width coloured band: label, title, body, button, and media that runs off the page edge.
//   tone:   'sky' | 'sand' | 'deep' | 'mist' | 'white'
//   layout: 'split' | 'split-reverse' | 'wide'
export default function Band({ band }) {
  const { tone = 'white', layout = 'split', label, title, body, cta, media, caption } = band

  const figure = (
    <figure className="band-media">
      <Media media={media} placeholder={caption || 'Image to come'} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )

  if (layout === 'wide') {
    return (
      <section className={`band band--${tone} band--wide`}>
        <div className="wrap band-wide">
          <div>
            {label && <p className="band-label">{label}</p>}
            <h2>{title}</h2>
          </div>
          <div>
            {body && <p className="band-body">{body}</p>}
            {cta && <SmartLink className={`btn ${tone === 'deep' ? 'btn--light' : ''}`} link={cta} />}
          </div>
          {figure}
        </div>
      </section>
    )
  }

  return (
    <section className={`band band--${tone}`}>
      <div className={`wrap band-split ${layout === 'split-reverse' ? 'band-split--reverse' : ''}`}>
        <div className="band-copy">
          {label && <p className="band-label">{label}</p>}
          <h2>{title}</h2>
          {body && <p className="band-body">{body}</p>}
          {cta && <SmartLink className={`btn ${tone === 'deep' ? 'btn--light' : ''}`} link={cta} />}
        </div>
        {figure}
      </div>
    </section>
  )
}
