import { Link, useLocation } from 'react-router-dom'
import { site } from '../content/site'
import Mark from './Mark'
import SmartLink from './SmartLink'

function taglineFor(pathname) {
  const t = site.taglines
  if (t[pathname] !== undefined) return t[pathname]
  const prefix = Object.keys(t).filter(k => k.endsWith('/') && pathname.startsWith(k)).sort((a, b) => b.length - a.length)[0]
  return prefix ? t[prefix] : null
}

export default function Footer() {
  const { pathname } = useLocation()
  const tagline = taglineFor(pathname)

  return (
    <>
      {tagline && (
        <p className="wrap tagline">
          {tagline.text} <SmartLink className="u" link={tagline.link} />
        </p>
      )}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-cols">
            <div className="footer-brand">
              <Link className="logo" to="/"><Mark /><span>{site.wordmark}</span></Link>
              <p>{site.discipline}.<br />{site.location}.</p>
            </div>
            {site.footer.columns.map(col => (
              <div key={col.title}>
                <h2>{col.title}</h2>
                <ul>{col.links.map(l => <li key={l.label}><SmartLink link={l} /></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="footer-fine">
            <span>{site.footer.copyright}</span>
            <span>{site.footer.colophon}</span>
          </div>
        </div>
      </footer>
    </>
  )
}
