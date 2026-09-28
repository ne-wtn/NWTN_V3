import { useEffect, useRef } from 'react'
import { projectsPage as copy } from '../content/pages'
import { asset } from '../lib/util'
import { setSound } from '../lib/video'
import { LOCKED_VIDEO } from './Media'

// A film opened full size: from the start, with sound and controls, framed to its own
// shape (portrait edits stay portrait). Esc, Close or a click beside the film closes it.
// Pass `project` to open it, null to close.
export default function FilmPlayer({ project, onClose }) {
  const dialog = useRef(null)
  const video = useRef(null)

  useEffect(() => {
    const d = dialog.current
    if (project && !d.open) d.showModal()
    if (!project && d.open) d.close()
    // Sound on, and any other film with sound goes quiet.
    if (project && video.current) setSound(video.current, true)
  }, [project])

  const closed = () => {
    if (video.current) setSound(video.current, false)
    onClose()
  }

  return (
    <dialog
      ref={dialog}
      className={`player player--${project?.shape || 'wide'}`}
      aria-label={project?.name}
      onClose={closed}
      onClick={e => e.target === dialog.current && dialog.current.close()}
    >
      {project && (
        <figure key={project.slug}>
          <video ref={video} src={asset(project.film.src)} poster={asset(project.film.poster)} controls playsInline {...LOCKED_VIDEO} />
          <figcaption>
            <strong>{project.name}</strong> <span>{project.client}</span>
            <p>{project.summary}</p>
          </figcaption>
        </figure>
      )}
      <button type="button" className="player-close" onClick={() => dialog.current.close()}>{copy.close}</button>
    </dialog>
  )
}
