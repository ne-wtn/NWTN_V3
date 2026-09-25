import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { projects, findProject, filmOf } from '../content/projects'
import { projectPage as copy } from '../content/pages'
import { site } from '../content/site'
import { asset, usePageTitle } from '../lib/util'
import { play } from '../lib/video'
import Media, { SoundToggle } from '../components/Media'
import NotFound from './NotFound'

export default function Project() {
  const { slug } = useParams()
  const project = findProject(slug)
  usePageTitle(project?.name || 'Not found')
  if (!project) return <NotFound />
  return <ProjectBody key={project.slug} project={project} />
}

function ProjectBody({ project }) {
  const video = useRef(null)
  const [now, setNow] = useState(0)
  const film = filmOf(project)

  useEffect(() => {
    const v = video.current
    if (!v) return
    const tick = () => setNow(v.currentTime)
    v.addEventListener('timeupdate', tick)
    return () => v.removeEventListener('timeupdate', tick)
  }, [])

  const seek = t => {
    const v = video.current
    if (!v) return
    v.currentTime = t
    play(v)
  }
  const active = project.chapters.findLastIndex(c => now >= c.t - 0.05)

  const pool = site.showUnreleased ? projects : projects.filter(p => p.film)
  const next = pool[(pool.indexOf(project) + 1) % pool.length]

  const meta = [
    [copy.meta.client, project.client],
    [copy.meta.discipline, project.discipline],
    [copy.meta.year, project.year],
  ].filter(([, v]) => v)

  return (
    <>
      <section className="wrap project-head">
        <Link className="back u" to="/projects">{copy.back}</Link>
        <h1>{project.name}</h1>
        <dl className="meta">
          {meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
      </section>

      <section className="wrap">
        <figure className="project-film">
          <Media media={film} videoRef={video} placeholder={copy.noFilm} />
          {film && (
            <figcaption className="caption">
              <span>{project.summary}</span>
              <SoundToggle videoRef={video} />
            </figcaption>
          )}
        </figure>

        {project.chapters.length > 0 && (
          <div className="chapters">
            <h2 className="sr-only">{copy.chapters}</h2>
            <ol>
              {project.chapters.map((c, i) => (
                <li key={c.t}>
                  <button type="button" onClick={() => seek(c.t)} aria-current={i === active ? 'true' : undefined}>
                    <img src={asset(c.thumb)} alt="" loading="lazy" draggable={false} />
                    <span className="chapter-time">{timecode(c.t)}</span>
                    <span className="chapter-label">{c.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      <section className="wrap project-text">
        <div className="project-desc">
          {project.description.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="project-notes">
          <h2>{copy.process}</h2>
          <p>{project.process}</p>
          <h2>{copy.tools}</h2>
          <p>{project.tools}</p>
        </div>
      </section>

      {project.stills.length > 0 && (
        <section className="wrap stills">
          <h2>{copy.stills}</h2>
          {project.stills.map(s => (
            <figure key={s.src}>
              <Media media={{ type: 'image', ...s }} />
              <figcaption>{s.caption}</figcaption>
            </figure>
          ))}
        </section>
      )}

      {next && next !== project && (
        <section className="band band--sky next">
          <Link className="wrap next-link" to={`/projects/${next.slug}`}>
            <div>
              <p className="band-label">{copy.next}</p>
              <h2>{next.name}</h2>
              <p>{next.summary}</p>
            </div>
            <Media media={filmOf(next)} placeholder="In the edit" className="next-media" />
          </Link>
        </section>
      )}
    </>
  )
}

// 14.6 -> "0:14"
const timecode = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`
