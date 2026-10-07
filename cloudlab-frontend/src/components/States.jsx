import { AlertTriangle } from 'lucide-react'

export function PageSkeleton({ rows = 4 }) {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="skeleton skeleton--title" />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton skeleton--row" />
      ))}
    </div>
  )
}

export function ErrorState({ error, onRetry, title = 'Could not load this page' }) {
  return (
    <div className="state" role="alert">
      <h2><AlertTriangle size={20} aria-hidden="true" style={{ verticalAlign: '-3px', marginRight: 8 }} />{title}</h2>
      <p>{error?.message || 'Something went wrong.'}</p>
      {onRetry && <button type="button" className="btn btn--secondary" onClick={onRetry}>Try again</button>}
    </div>
  )
}

export function EmptyState({ title, children, action }) {
  return (
    <div className="state">
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}
