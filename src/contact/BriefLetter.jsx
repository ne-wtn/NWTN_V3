import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { contact } from '../content/contact'
import { site } from '../content/site'
import { fill, listSentence, prefersReducedMotion } from '../lib/util'
import { Blank, Choice, Notes } from './Blanks'
import BriefNode from './BriefNode'
import Turnstile, { SITE_KEY } from './Turnstile'
import { blankValues, fieldErrors, order, statesFor } from './briefData'
import { sendBrief, demoMode } from './send'

const { fields, options, letter } = contact
const DRAFT = 'newtn_draft'
const SUBMITTED = 'newtn_submitted'
const SENT = 'newtn_sent'

const read = key => { try { return JSON.parse(sessionStorage.getItem(key)) } catch { return null } }
const write = (key, value) => { try { value == null ? sessionStorage.removeItem(key) : sessionStorage.setItem(key, JSON.stringify(value)) } catch { /* private mode */ } }
const wait = ms => new Promise(r => setTimeout(r, ms))

function validate(values, consent) {
  const errors = fieldErrors(values)
  if (!consent) errors.consent = 'missing'
  return errors
}

export default function BriefLetter() {
  const [values, setValues] = useState(() => ({ ...blankValues(), ...(read(DRAFT) || {}) }))
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(() => (read(SUBMITTED) ? 'sent' : 'idle'))
  const [sent, setSent] = useState(() => read(SENT))
  const [justSent, setJustSent] = useState(false)
  const [undo, setUndo] = useState(null)
  const [token, setToken] = useState(null)
  const [tokenReset, setTokenReset] = useState(0)
  const rewindTimers = useRef([])
  const trap = useRef(null)

  useEffect(() => { if (status !== 'sent') write(DRAFT, values) }, [values, status])

  // "Brief cleared. Undo" stays for a few seconds.
  useEffect(() => {
    if (!undo) return
    const t = setTimeout(() => setUndo(null), 6000)
    return () => clearTimeout(t)
  }, [undo])
  useEffect(() => () => rewindTimers.current.forEach(clearTimeout), [])

  const set = key => value => {
    setValues(v => ({ ...v, [key]: value }))
    if (errors[key]) setErrors(({ [key]: _, ...rest }) => rest)
  }

  async function submit(e) {
    e.preventDefault()
    const found = validate(values, consent)
    setErrors(found)
    const first = order.find(k => found[k]) || (found.consent && 'consent')
    if (first) {
      document.getElementById(`brief-${first}`)?.focus()
      return
    }
    setStatus('sending')
    try {
      await Promise.all([
        sendBrief({ values, turnstileToken: token, trap: trap.current?.value || '' }),
        wait(prefersReducedMotion() ? 0 : 1300),
      ])
      const record = { values, at: new Date().toISOString() }
      write(SUBMITTED, true)
      write(SENT, record)
      write(DRAFT, null)
      setSent(record)
      setJustSent(true)
      setStatus('sent')
    } catch (err) {
      // The server double-checks every answer; show anything it didn't accept.
      if (err.fields) setErrors(err.fields)
      setTokenReset(n => n + 1)
      setStatus('error')
    }
  }

  // Clear the brief like a timeline played backwards: last answer first.
  function rewind() {
    rewindTimers.current.forEach(clearTimeout)
    setUndo({ values, consent })
    setErrors({})
    setConsent(false)
    const filled = [...order].reverse().filter(k => values[k].trim())
    const gap = prefersReducedMotion() ? 0 : 90
    rewindTimers.current = filled.map((k, i) => setTimeout(() => setValues(v => ({ ...v, [k]: '' })), i * gap))
  }

  function restore() {
    rewindTimers.current.forEach(clearTimeout)
    setValues(undo.values)
    setConsent(undo.consent)
    setUndo(null)
  }

  function startOver() {
    write(SUBMITTED, null)
    write(SENT, null)
    setValues(blankValues())
    setConsent(false)
    setErrors({})
    setJustSent(false)
    setStatus('idle')
  }

  if (status === 'sent') return <Sent record={sent} onAgain={startOver} justSent={justSent} />

  const states = statesFor(values, errors)
  const missing = order.filter(k => errors[k] === 'missing').map(k => fields[k].label)
  const invalid = ['email', 'website', 'consent'].filter(k => errors[k] === 'invalid' || (k === 'consent' && errors.consent))

  const renderField = key => {
    const field = fields[key]
    const props = { id: `brief-${key}`, field, value: values[key], onChange: set(key), invalid: !!errors[key] }
    if (field.type === 'choice') return <Choice key={key} {...props} options={options[field.options]} />
    if (field.type === 'textarea') return <Notes key={key} {...props} />
    return <Blank key={key} {...props} />
  }

  return (
    <form className={`graph${status === 'sending' ? ' is-sending' : ''}`} onSubmit={submit} noValidate>
      {/* Spam trap: hidden from people, filled in by bots. */}
      <input ref={trap} className="trap" type="text" name="company_site" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="letter">
        {letter.map((para, i) => (
          <div key={i} className="letter-line">
            {para.map((part, j) => (typeof part === 'string' ? <span key={j}>{part}</span> : renderField(part.field)))}
          </div>
        ))}
      </div>

      <div className="graph-output">
        <BriefNode
          values={values}
          states={states}
          onRewind={rewind}
          canRewind={consent || order.some(k => values[k].trim())}
          notice={undo && (
            <p className="brief-undo" role="status">
              {contact.rewind.cleared} <button type="button" className="link-button" onClick={restore}>{contact.rewind.undo}</button>
            </p>
          )}
          footer={<span className="brief-progress" aria-hidden="true"><span /></span>}
        >
          <div className="brief-actions">
            <label className={`consent${errors.consent ? ' is-invalid' : ''}`}>
              <input
                id="brief-consent"
                type="checkbox"
                checked={consent}
                onChange={e => { setConsent(e.target.checked); setErrors(({ consent: _, ...rest }) => rest) }}
              />
              <span>
                {contact.consent.text} <Link className="u" to="/privacy">{contact.consent.privacy}</Link> {contact.consent.and}{' '}
                <Link className="u" to="/terms">{contact.consent.terms}</Link>.
              </span>
            </label>

            {(missing.length > 0 || invalid.length > 0) && (
              <div className="brief-errors" role="alert">
                {missing.length > 0 && <p>{contact.missing} {listSentence(missing)}.</p>}
                {invalid.map(k => <p key={k}>{contact.invalid[k]}</p>)}
              </div>
            )}
            {status === 'error' && (
              <div className="brief-errors" role="alert">
                <p><strong>{contact.error.title}</strong> {contact.error.body}</p>
              </div>
            )}

            <Turnstile onToken={setToken} resetKey={tokenReset} />
            <button className="btn btn--lg btn--light" type="submit" disabled={status === 'sending' || (!!SITE_KEY && !demoMode && !token)}>
              {status === 'sending' ? `${contact.sending}…` : status === 'error' ? contact.error.retry : contact.submit}
            </button>
            <p className="brief-small">
              {contact.instagram} <a className="u" href={site.instagram.url} target="_blank" rel="noreferrer">Instagram</a>.
            </p>
            {demoMode && <p className="brief-small">Preview mode: briefs aren’t sent yet. Type “fail” as your name to see the error message.</p>}
          </div>
        </BriefNode>
      </div>
    </form>
  )
}

function Sent({ record, onAgain, justSent }) {
  const s = contact.sent
  const ref = useRef(null)
  const values = record?.values || blankValues()
  const at = record?.at ? new Date(record.at) : null

  // Bring the confirmation into view right after sending (not on a reload).
  useEffect(() => {
    if (justSent) ref.current.scrollIntoView({ block: 'start', behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [justSent])

  return (
    <div className="sent" role="status" ref={ref}>
      <div className="sent-copy">
        <h2>{s.title}</h2>
        <p className="sent-tagline">{s.tagline}</p>
        <p>{fill(s.body)}</p>
        <p className="sent-note">{s.note}</p>
        <div className="sent-actions">
          <Link className="btn btn--lg" to={s.cta.to}>{s.cta.label}</Link>
          <button type="button" className="link-button" onClick={onAgain}>{s.again}</button>
        </div>
      </div>
      <div className="sent-brief">
        <BriefNode
          values={values}
          states={statesFor(values)}
          footer={at && (
            <p className="brief-small brief-received">
              {contact.brief.received} {at.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })},{' '}
              {at.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        />
      </div>
    </div>
  )
}
