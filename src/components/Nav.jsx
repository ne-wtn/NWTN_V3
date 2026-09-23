import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '../content/site'
import { monthName } from '../lib/util'
import Mark from './Mark'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = e => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="nav">
      <div className="wrap nav-bar">
        <Link className="logo" to="/" aria-label={`${site.wordmark}, home`}>
          <Mark />
          <span>{site.wordmark}</span>
        </Link>
        <nav className="nav-links" aria-label="Main">
          {site.nav.map(l => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
        </nav>
        <div className="nav-right">
          <span className="nav-avail">{site.availability.spots} spots open in {monthName()}</span>
          <Link className="btn" to="/contact">Start a project</Link>
          <button type="button" className="nav-menu link-button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(o => !o)}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
      {open && (
        <div className="menu" id="menu">
          <nav className="wrap" aria-label="Menu">
            {site.nav.map(l => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
            <p>{site.availability.spots} spots open in {monthName()}</p>
          </nav>
        </div>
      )}
    </header>
  )
}
