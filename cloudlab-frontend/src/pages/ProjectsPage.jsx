import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAsync } from '../lib/useAsync'
import { titleCase } from '../lib/format'
import StatusBadge from '../components/StatusBadge'
import { EmptyState, ErrorState, PageSkeleton } from '../components/States'

export default function ProjectsPage() {
  const { data, error, loading, reload } = useAsync(() => api.getProjects(), [])

  if (loading) return <PageSkeleton rows={3} />
  if (error) return <ErrorState error={error} onRetry={reload} />
  if (data.length === 0) return <EmptyState title="No projects yet">Projects will appear here.</EmptyState>

  return (
    <div>
      <div className="page-head">
        <h1>Projects</h1>
        <p>Build something real. Free projects are always open; the rest unlock as you finish the topics they need.</p>
      </div>
      <ul className="project-grid">
        {data.map((p) => (
          <li key={p.id}>
            <Link to={`/projects/${p.slug}`} className={`card project-card${p.status === 'LOCKED' ? ' is-locked' : ''}`}>
              <div className="meta-row">
                <span className="badge">{titleCase(p.level)}</span>
                {p.free && <span className="badge badge--free">Free</span>}
              </div>
              <h2>{p.title}</h2>
              <div className="project-card__foot">
                <StatusBadge status={p.status} kind="project" />
                {p.status === 'LOCKED' && <span className="project-card__hint">Finish the required topics to unlock</span>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
