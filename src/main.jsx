import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter, createHashRouter } from 'react-router-dom'
import { routes } from './App'
import { startOpening } from './lib/opening'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import './styles/pages.css'
import './styles/contact.css'

// The shareable preview can't use real URLs, so it routes with #/… instead.
const createRouter = import.meta.env.MODE === 'artifact' ? createHashRouter : createBrowserRouter

startOpening()
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={createRouter(routes)} />
  </StrictMode>,
)
