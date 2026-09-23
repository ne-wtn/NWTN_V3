import { legal } from '../content/legal'
import { site } from '../content/site'
import { usePageTitle } from '../lib/util'

export default function Legal({ doc }) {
  const page = legal[doc]
  usePageTitle(page.title)
  return (
    <section className="wrap legal">
      <div className="page-head">
        <p className="band-label">Legal</p>
        <h1>{page.title}</h1>
        <p className="page-sub">{page.sub}</p>
      </div>
      <ol className="legal-list">
        {page.sections.map(s => (
          <li key={s.title}>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
      <p className="legal-closer">{legal.closer} <a className="u" href={`mailto:${site.email}`}>{site.email}</a></p>
    </section>
  )
}
