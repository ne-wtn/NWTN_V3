import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { home } from '../content/home'
import { findProject, filmOf } from '../content/projects'
import { fill, listSentence, usePageTitle } from '../lib/util'
import Media, { InlineMedia, SoundToggle } from '../components/Media'
import Band from '../components/Band'
import ProjectCard from '../components/ProjectCard'
import SmartLink from '../components/SmartLink'

export default function Home() {
  usePageTitle(null)
  const { hero, clients, bands, work, close } = home
  const heroProject = findProject(hero.film)
  const heroVideo = useRef(null)

  return (
    <>
      <section className="wrap hero">
        <h1>
          {hero.headline.map((part, i) =>
            typeof part === 'string' ? <span key={i}>{part}</span> : <InlineMedia key={i} item={part} />,
          )}
        </h1>
        <div className="hero-intro">
          <p>{hero.intro}</p>
          <SmartLink className="btn btn--lg" link={hero.cta} />
        </div>
        <figure className="hero-film">
          <Media media={filmOf(heroProject)} videoRef={heroVideo} placeholder="Showreel to come" />
          <figcaption className="caption">
            <span><Link to={`/projects/${heroProject.slug}`}><strong>{heroProject.name}</strong></Link>, {hero.caption}</span>
            <SoundToggle videoRef={heroVideo} />
          </figcaption>
        </figure>
      </section>

      <section className="wrap clients">
        <p><span>{clients.lead}</span> {listSentence(clients.names)}.</p>
      </section>

      {bands.map((band, i) => <Band key={i} band={band} />)}

      <section className="wrap work">
        <div className="section-head">
          <h2>{work.title}</h2>
          <SmartLink className="u" link={work.link} />
        </div>
        <div className="grid grid--3">
          {work.slugs.map(findProject).filter(Boolean).map(p => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </section>

      <section className="wrap closer">
        <h2>{close.title}</h2>
        <div>
          <p>{fill(close.body)}</p>
          <SmartLink className="btn btn--lg" link={close.cta} />
        </div>
      </section>
    </>
  )
}
