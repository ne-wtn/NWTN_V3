import { Link } from 'react-router-dom'
import { previewOf, ratios } from '../content/projects'
import { projectsPage as copy } from '../content/pages'
import Media from './Media'

// A film in a grid, framed to its own shape, playing its short silent loop.
// A project with a case study links to it; the others open in the player (onPlay).
export default function ProjectCard({ project, onPlay, style }) {
  const media = <Media media={previewOf(project)} ratio={ratios[project.shape]} placeholder="In the edit" className="card-media" />
  const text = (
    <span className="card-text">
      <strong>{project.name}</strong>
      <span className="card-meta">{project.client}</span>
      <span>{project.summary}</span>
      {project.caseStudy && <span className="card-more">{copy.caseStudy}</span>}
    </span>
  )

  return (
    <figure className="card" style={style}>
      {project.caseStudy ? (
        <Link to={`/projects/${project.slug}`} viewTransition className="card-link">{media}{text}</Link>
      ) : (
        <button type="button" className="card-link card-play" onClick={() => onPlay?.(project)} aria-label={copy.play.replace('{name}', project.name)}>
          {media}{text}
        </button>
      )}
    </figure>
  )
}
