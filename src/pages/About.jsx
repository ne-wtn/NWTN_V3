import { about } from '../content/about'
import { fill, usePageTitle } from '../lib/util'
import Media from '../components/Media'
import SmartLink from '../components/SmartLink'

export default function About() {
  usePageTitle('About')
  return (
    <>
      <section className="wrap page-head">
        <p className="band-label">{about.label}</p>
        <h1>{about.title}</h1>
        <p className="page-sub">{about.intro}</p>
      </section>

      <section className="band band--sand">
        <figure className="wrap about-figure">
          <Media media={about.media} placeholder="Portrait to come" />
          {about.caption && <figcaption>{about.caption}</figcaption>}
        </figure>
      </section>

      <section className="wrap about-sections">
        {about.sections.map(s => (
          <div key={s.id} id={s.id} className="about-row">
            <h2>{s.title}</h2>
            <div>
              {s.list && <ul className="about-list">{s.list.map(item => <li key={item}>{item}</li>)}</ul>}
              {s.paras.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        ))}
        <div className="about-row">
          <h2>{about.tools.title}</h2>
          <p className="about-tools">{about.tools.items.join(', ')}</p>
        </div>
      </section>

      <section className="band band--deep">
        <div className="wrap closer closer--band">
          <h2>{about.close.title}</h2>
          <div>
            <p>{fill(about.close.body)}</p>
            <SmartLink className="btn btn--lg btn--light" link={about.close.cta} />
          </div>
        </div>
      </section>
    </>
  )
}
