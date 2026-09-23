// The two-slab N. Takes the current text colour.
export default function Mark({ className = 'mark', title }) {
  return (
    <svg className={className} viewBox="0 0 290 290" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path
        d="M14 6h80l33 48v223H14z M163 6h112v271h-79l-33-45z"
        fill="currentColor" stroke="currentColor" strokeWidth="12" strokeLinejoin="round"
      />
    </svg>
  )
}
