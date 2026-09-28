import { useEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'

export default function Layout() {
  // No right-click menu or dragging on images and films, so they can't be saved,
  // looped or opened from the browser's menu.
  useEffect(() => {
    const block = e => { if (e.target.closest?.('img, video, .media')) e.preventDefault() }
    document.addEventListener('contextmenu', block)
    document.addEventListener('dragstart', block)
    return () => {
      document.removeEventListener('contextmenu', block)
      document.removeEventListener('dragstart', block)
    }
  }, [])

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      {/* A new page starts at the top, /about#services jumps to that section,
          and Back returns to where you were. */}
      <ScrollRestoration />
    </>
  )
}
