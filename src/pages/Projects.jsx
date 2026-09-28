import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { projects, categories } from '../content/projects'
import { projectsPage as copy } from '../content/pages'
import { site } from '../content/site'
import { prefersReducedMotion, usePageTitle } from '../lib/util'
import ProjectCard from '../components/ProjectCard'
import FilmPlayer from '../components/FilmPlayer'

// The Work page, one category at a time. The title is the switch between them: the category
// you're on in ink, the other as a blue link. Each has its own address (/projects for motion
// design, /projects/editing for video editing), but switching only moves the films: they
// slide out towards the side you're leaving, the new ones slide in from the other, and the
// page eases to its new length. The title, nav and footer stay where they are.
//   motion design: the lead films side by side, the rest in one row under them
//   video editing: portrait films, three to a row, ending with a way to more on Instagram
const FLEX = { wide: 16 / 9, square: 1, tall: 9 / 16 }
const SLIDE = 48 // px

export default function Projects() {
  const { pathname, state } = useLocation()
  const path = pathname.replace(/\/+$/, '') || '/'
  const category = (categories.find(c => c.path === path) || categories[0]).id
  const [shown, setShown] = useState(category)
  const current = categories.find(c => c.id === shown)
  usePageTitle(categories.find(c => c.id === category).name)

  // A link to a film without a case study lands here with that film open.
  const [playing, setPlaying] = useState(() => projects.find(p => p.slug === state?.play) || null)

  // Switching: the films on screen slide out first, then the new ones are put in and slide in.
  const stage = useRef(null)
  const films = useRef(null)
  const entering = useRef(null)
  useEffect(() => {
    if (category === shown) return
    const el = films.current
    if (!el || prefersReducedMotion()) return setShown(category)
    const dir = categories.findIndex(c => c.id === category) > categories.findIndex(c => c.id === shown) ? 1 : -1
    const height = stage.current.offsetHeight
    const out = el.animate(
      [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-dir * SLIDE}px)` }],
      { duration: 220, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
    )
    let live = true
    out.finished.then(() => {
      if (!live) return
      entering.current = { dir, height }
      setShown(category)
    }, () => {})
    // Switched back before it finished: the films on screen simply stay.
    return () => { live = false; out.cancel() }
  }, [category, shown])

  useLayoutEffect(() => {
    const move = entering.current
    if (!move) return
    entering.current = null
    const box = stage.current
    const to = films.current.offsetHeight
    box.animate([{ height: `${move.height}px` }, { height: `${to}px` }], { duration: 460, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' })
    films.current.animate(
      [{ opacity: 0, transform: `translateX(${move.dir * SLIDE}px)` }, { opacity: 1, transform: 'none' }],
      { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' },
    )
  }, [shown])

  const list = projects.filter(p => p.category === shown)
  const leads = list.filter(p => p.lead)
  const rest = list.filter(p => !p.lead)
  const card = (p, style) => <ProjectCard key={p.slug} project={p} onPlay={setPlaying} style={style} />

  return (
    <>
      <section className="wrap page-head work-head">
        <h1 className="work-switch">
          {categories.map((c, i) => (
            <Fragment key={c.id}>
              {i > 0 && <span className="work-sep" aria-hidden="true">/</span>}
              <Link to={c.path} preventScrollReset aria-current={c.id === category ? 'page' : undefined}>{c.name}</Link>
            </Fragment>
          ))}
        </h1>
        <p className="page-sub">{current.line}</p>
      </section>

      <section ref={stage} className="wrap work-stage">
        <div ref={films} key={shown} className="work-films">
          {shown === 'edit' ? (
            <div className="work-tall">
              {[...leads, ...rest].map(p => card(p))}
              <a className="work-more" href={site.instagram.url} target="_blank" rel="noreferrer">
                {copy.more}
                <span className="u">{site.instagram.handle}</span>
              </a>
            </div>
          ) : (
            <>
              <div className="work-leads">{leads.map(p => card(p))}</div>
              {rest.length > 0 && <div className="work-rest">{rest.map(p => card(p, { flex: `${FLEX[p.shape]} 1 0%` }))}</div>}
            </>
          )}
        </div>
      </section>

      <FilmPlayer project={playing} onClose={() => setPlaying(null)} />
    </>
  )
}
