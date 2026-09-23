import { useEffect } from 'react'
import { site } from '../content/site'

// Paths in the content files are relative to /public. This makes them work
// on the live site and in the preview build alike.
export const asset = path =>
  !path || /^(https?:|data:|blob:|\/)/.test(path) ? path : import.meta.env.BASE_URL + path

export const monthName = (date = new Date()) => date.toLocaleString('en', { month: 'long' })

// Fills {spots}, {month}, {replyTime}, {perMonth} in copy from site.js.
export function fill(text) {
  const values = {
    spots: site.availability.spots,
    perMonth: site.availability.perMonth,
    month: monthName(),
    replyTime: site.replyTime,
  }
  return text.replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m))
}

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${site.name}` : `${site.name} · ${site.person}, ${site.discipline.toLowerCase()}`
  }, [title])
}

// ['a', 'b', 'c'] -> "a, b and c"
export const listSentence = items =>
  items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`

export const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
