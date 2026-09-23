import { projects } from '../content/projects'
import { projectsPage as copy } from '../content/pages'
import { site } from '../content/site'
import { fill, usePageTitle } from '../lib/util'
import ProjectCard from '../components/ProjectCard'

export default function Projects() {
  usePageTitle('Projects')
  const released = projects.filter(p => p.film)
  const unreleased = projects.filter(p => !p.film)

  return (
    <>
      <section className="wrap page-head">
        <p className="band-label">{copy.label}</p>
        <h1>{copy.title}</h1>
        <p className="page-sub">{fill(copy.sub)}</p>
      </section>

      <section className="wrap">
        {/* With an odd number of films, the first one runs full width so no card sits alone. */}
        <div className={`grid grid--2${released.length % 2 ? ' grid--feature' : ''}`}>
          {released.map(p => <ProjectCard key={p.slug} project={p} detail="summary" />)}
        </div>
      </section>

      {site.showUnreleased && unreleased.length > 0 && (
        <section className="wrap in-edit">
          <div className="section-head">
            <h2>{copy.inEdit.title}</h2>
            <p>{copy.inEdit.sub}</p>
          </div>
          <div className="grid grid--3">
            {unreleased.map(p => <ProjectCard key={p.slug} project={p} />)}
          </div>
        </section>
      )}
    </>
  )
}
