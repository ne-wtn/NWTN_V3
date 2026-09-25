import { useEffect } from 'react'

// Keeps the field being typed in visible above the phone keyboard and below the sticky nav.
// iPhones lay the keyboard over the page instead of shrinking it, so the browser's own
// scrolling can leave a field hidden. This watches the visible area and nudges the page.
export function useKeepFieldVisible(ref) {
  useEffect(() => {
    const root = ref.current
    const vv = window.visualViewport
    if (!root || !vv || !matchMedia('(pointer: coarse)').matches) return

    const GAP = 20
    let timer = 0

    const keep = () => {
      const el = document.activeElement
      if (!el || !root.contains(el) || !el.matches('input, textarea')) return
      const r = el.getBoundingClientRect()
      const nav = document.querySelector('.nav')?.getBoundingClientRect().bottom ?? 0
      const top = Math.max(vv.offsetTop, nav) + GAP
      const bottom = vv.offsetTop + vv.height - GAP
      // A tall notes box that can't fit: keep its bottom (where the caret is) in view.
      if (r.bottom > bottom) window.scrollBy({ top: r.bottom - bottom, behavior: 'smooth' })
      else if (r.top < top) window.scrollBy({ top: r.top - top, behavior: 'smooth' })
    }
    const soon = (ms = 80) => { clearTimeout(timer); timer = setTimeout(keep, ms) }

    // The keyboard takes a moment to slide up; check once it has.
    const onFocus = () => soon(320)
    const onInput = () => soon()
    const onResize = () => soon()

    root.addEventListener('focusin', onFocus)
    root.addEventListener('input', onInput)
    vv.addEventListener('resize', onResize)
    return () => {
      clearTimeout(timer)
      root.removeEventListener('focusin', onFocus)
      root.removeEventListener('input', onInput)
      vv.removeEventListener('resize', onResize)
    }
  }, [ref])
}
