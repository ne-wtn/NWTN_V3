import { useEffect } from 'react'
import { prefersReducedMotion } from './util'
import { startRibbons } from './ribbons'

// Draws a ribbon (a route name from lib/ribbons.js) behind a section as it scrolls into
// view. The section also needs the class `has-ribbon` (see ribbonClass).
// The ribbon code ships with the site, so ribbons are ready the moment a page opens.
export function useRibbon(ref, route) {
  useEffect(() => {
    if (!route || !ref.current) return
    return startRibbons(ref.current, route, { still: prefersReducedMotion() })
  }, [ref, route])
}

export const ribbonClass = route => (route ? ' has-ribbon' : '')
