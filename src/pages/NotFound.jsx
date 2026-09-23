import { notFound } from '../content/pages'
import { usePageTitle } from '../lib/util'
import SmartLink from '../components/SmartLink'

export default function NotFound() {
  usePageTitle('Not found')
  return (
    <section className="wrap page-head not-found">
      <p className="band-label">404</p>
      <h1>{notFound.title}</h1>
      <p className="page-sub">{notFound.body}</p>
      <SmartLink className="btn btn--lg" link={notFound.cta} />
    </section>
  )
}
