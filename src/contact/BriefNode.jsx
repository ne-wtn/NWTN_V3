import { useEffect, useRef, useState } from 'react'
import { contact } from '../content/contact'
import { display } from './briefData'

const { nodes } = contact
const HOLD_MS = 900

// Press and hold: calls onDone once held for HOLD_MS, nothing if let go early.
function useHold(onDone, enabled) {
  const [holding, setHolding] = useState(false)
  const timer = useRef(null)
  const done = useRef(onDone)
  done.current = onDone

  const start = () => {
    if (!enabled || timer.current) return
    setHolding(true)
    timer.current = setTimeout(() => {
      timer.current = null
      setHolding(false)
      done.current()
    }, HOLD_MS)
  }
  const stop = () => {
    clearTimeout(timer.current)
    timer.current = null
    setHolding(false)
  }
  useEffect(() => () => clearTimeout(timer.current), [])
  return { holding, start, stop }
}

// "Your brief": one row per group of answers, filling in as the letter is written.
// With onRewind, holding the heading clears the brief.
export default function BriefNode({ values, states, onRewind, canRewind, notice, footer, children }) {
  const done = nodes.filter(n => states[n.id] === 'done').length
  const { holding, start, stop } = useHold(() => onRewind?.(), !!onRewind && canRewind)
  const count = `${done}/${nodes.length}`
  const holdKey = e => e.key === ' ' || e.key === 'Enter'

  return (
    <div className="brief-node" data-brief>
      {onRewind ? (
        <div
          className={`brief-head can-rewind${canRewind ? ' has-answers' : ''}${holding ? ' is-holding' : ''}`}
          onPointerDown={e => e.button === 0 && start()}
          onPointerUp={stop}
          onPointerLeave={stop}
          onPointerCancel={stop}
          onContextMenu={e => e.preventDefault()}
        >
          <h2>{contact.brief.title}</h2>
          {canRewind && <span className="brief-hint" aria-hidden="true">{contact.rewind.hint}</span>}
          <button
            type="button"
            className="brief-count"
            aria-label={`${count} filled. Hold Space to rewind and clear the brief.`}
            onKeyDown={e => { if (holdKey(e)) { e.preventDefault(); if (!e.repeat) start() } }}
            onKeyUp={e => holdKey(e) && stop()}
            onBlur={stop}
          >
            {count}
          </button>
          <span className="brief-hold" aria-hidden="true" />
        </div>
      ) : (
        <div className="brief-head">
          <h2>{contact.brief.title}</h2>
          <span className="brief-count">{count}</span>
        </div>
      )}
      {notice}
      <ul className="brief-rows">
        {nodes.map(n => {
          const value = n.fields.map(k => display(k, values)).filter(Boolean).join(', ')
          return (
            <li key={n.id} className={`brief-row brief-row--${states[n.id]}`}>
              <span className="brief-label">{n.short}</span>
              <span key={value ? 'on' : 'off'} className={`brief-value${value ? ' is-in' : ''}`}>{value || '—'}</span>
            </li>
          )
        })}
      </ul>
      {footer}
      {children}
    </div>
  )
}
