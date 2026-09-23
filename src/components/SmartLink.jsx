import { Link } from 'react-router-dom'

// Internal routes use `to`; outside links use `href` and open in a new tab.
export default function SmartLink({ link, className, children }) {
  const label = children ?? link.label
  if (link.to) return <Link className={className} to={link.to}>{label}</Link>
  const external = /^https?:/.test(link.href)
  return (
    <a className={className} href={link.href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {label}
    </a>
  )
}
