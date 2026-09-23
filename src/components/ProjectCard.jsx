import { Link } from 'react-router-dom'
import { filmOf } from '../content/projects'
import Media from './Media'

export default function ProjectCard({ project, detail = 'discipline' }) {
  const film = filmOf(project)
  const meta = project.discipline
  return (
    <figure className="card">
      <Link to={`/projects/${project.slug}`} className="card-link">
        <Media media={film} placeholder="In the edit" className="card-media" />
        <figcaption>
          <strong>{project.name}</strong>
          <span>{detail === 'summary' ? project.summary : meta || 'In the edit'}</span>
        </figcaption>
      </Link>
    </figure>
  )
}
