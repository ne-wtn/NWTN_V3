import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// A blank inside a sentence. It grows with what you type.
export function Blank({ id, field, value, onChange, invalid }) {
  const input = useRef(null)
  const mirror = useRef(null)

  useLayoutEffect(() => {
    const m = mirror.current
    const size = () => { input.current.style.width = `${Math.ceil(m.getBoundingClientRect().width) + 2}px` }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(m)
    return () => ro.disconnect()
  }, [])

  return (
    <span className="blank-wrap">
      <span ref={mirror} className="blank-mirror" aria-hidden="true">{value || field.placeholder}</span>
      <input
        id={id}
        ref={input}
        className={`blank${value ? ' is-filled' : ''}${invalid ? ' is-invalid' : ''}`}
        type={field.type}
        inputMode={field.type === 'url' ? 'url' : undefined}
        value={value}
        placeholder={field.placeholder}
        aria-label={field.label}
        aria-invalid={invalid || undefined}
        aria-required={field.required || undefined}
        autoComplete={field.autoComplete || 'off'}
        spellCheck={field.type === 'text'}
        onChange={e => onChange(e.target.value)}
      />
    </span>
  )
}

// Lined notes area for the longer answer.
export function Notes({ id, field, value, onChange }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])
  return (
    <textarea
      id={id}
      ref={ref}
      className="notes"
      rows={3}
      value={value}
      placeholder={field.placeholder}
      aria-label={field.label}
      onChange={e => onChange(e.target.value)}
    />
  )
}

// A choice inside a sentence: shows the answer as words, opens a short list.
export function Choice({ id, field, options, value, onChange, invalid }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrap = useRef(null)
  const button = useRef(null)
  const list = useRef(null)
  const selected = options.find(o => o.value === value)

  const openList = () => {
    setActive(Math.max(0, options.indexOf(selected)))
    setOpen(true)
  }
  const close = (refocus = true) => {
    setOpen(false)
    if (refocus) button.current?.focus()
  }
  const choose = o => {
    onChange(o.value)
    close()
  }

  useEffect(() => {
    if (!open) return
    const onDown = e => !wrap.current.contains(e.target) && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  // Keep the list on screen, then hand it keyboard focus.
  useLayoutEffect(() => {
    if (!open) return
    const l = list.current
    l.style.left = '0px'
    const overflow = l.getBoundingClientRect().right - (document.documentElement.clientWidth - 12)
    if (overflow > 0) l.style.left = `${-overflow}px`
    l.focus({ preventScroll: true })
    // If the list opens below the bottom of the screen, bring it into view.
    const below = l.getBoundingClientRect().bottom - (window.visualViewport?.height ?? innerHeight) + 16
    if (below > 0) window.scrollBy({ top: below, behavior: 'smooth' })
  }, [open])

  const onListKey = e => {
    const last = options.length - 1
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, last)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0) }
    else if (e.key === 'End') { e.preventDefault(); setActive(last) }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(options[active]) }
    else if (e.key === 'Escape') { e.preventDefault(); close() }
    else if (e.key === 'Tab') close(false)
  }

  return (
    <span className="choice" ref={wrap}>
      <button
        id={id}
        ref={button}
        type="button"
        className={`blank blank--choice${selected ? ' is-filled' : ''}${invalid ? ' is-invalid' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${field.label}: ${selected ? selected.phrase : 'not chosen yet'}`}
        aria-invalid={invalid || undefined}
        onClick={() => (open ? close() : openList())}
        onKeyDown={e => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); openList() }
        }}
      >
        {selected ? selected.phrase : field.placeholder}
      </button>
      {open && (
        <ul
          ref={list}
          className="choice-list"
          role="listbox"
          tabIndex={-1}
          aria-label={field.label}
          aria-activedescendant={`${id}-${active}`}
          onKeyDown={onListKey}
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-${i}`}
              role="option"
              aria-selected={o.value === value}
              className={i === active ? 'is-active' : undefined}
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(o)}
            >
              {o.phrase}
            </li>
          ))}
        </ul>
      )}
    </span>
  )
}
