import { contact } from '../content/contact'
import { fill, usePageTitle } from '../lib/util'
import BriefLetter from '../contact/BriefLetter'

export default function Contact() {
  usePageTitle('Contact')
  return (
    <>
      <section className="wrap page-head">
        <p className="band-label">{contact.label}</p>
        <h1>{contact.title}</h1>
        {contact.intro.map((line, i) => <p key={i} className="page-sub">{fill(line)}</p>)}
      </section>
      <section className="band band--sky brief-band">
        <div className="wrap">
          <BriefLetter />
        </div>
      </section>
    </>
  )
}
