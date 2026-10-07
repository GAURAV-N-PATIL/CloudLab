import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Circle, ExternalLink } from 'lucide-react'
import { api } from '../api'
import { useAsync } from '../lib/useAsync'
import { titleCase } from '../lib/format'
import StatusBadge from '../components/StatusBadge'
import { ErrorState, PageSkeleton } from '../components/States'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const { data, error, loading, reload } = useAsync(
    () => Promise.all([api.getProject(slug), api.getRoadmap()]),
    [slug],
  )
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  if (loading && !data) return <PageSkeleton rows={3} />
  if (error) {
    const message = error.status === 403 ? 'This project belongs to the other cloud track.' : undefined
    return <ErrorState error={message ? { message } : error} onRetry={reload} title="Could not open this project" />
  }

  const [project, roadmap] = data
  const topicBySlug = new Map(roadmap.map((t) => [t.slug, t]))
  const canSubmit = project.status === 'UNLOCKED' || project.status === 'IN_PROGRESS'

  async function handleSubmit() {
    setSaving(true)
    setActionError('')
    try {
      await api.submitProject(project.slug)
      reload()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className="topic">
      <Link to="/projects" className="back-link"><ArrowLeft size={16} aria-hidden="true" /> Back to projects</Link>

      <div className="meta-row">
        <span className="badge">{titleCase(project.level)}</span>
        {project.free && <span className="badge badge--free">Free</span>}
        <StatusBadge status={project.status} kind="project" />
      </div>
      <h1>{project.title}</h1>
      <p className="topic__lead">{project.description}</p>

      {project.requiredTopicSlugs.length > 0 && (
        <section aria-labelledby="req-title" className="topic__resources">
          <h2 id="req-title">Topics this project builds on</h2>
          <ul className="req-list">
            {project.requiredTopicSlugs.map((s) => {
              const t = topicBySlug.get(s)
              const done = t?.status === 'COMPLETED'
              return (
                <li key={s} className={done ? 'is-done' : ''}>
                  {done ? <Check size={16} aria-label="Completed" /> : <Circle size={16} aria-label="Not completed" />}
                  {t ? <Link to={`/roadmap/${t.slug}`}>{t.name}</Link> : <span>{s}</span>}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {project.resources.length > 0 && (
        <section aria-labelledby="proj-res-title" className="topic__resources">
          <h2 id="proj-res-title">Resources</h2>
          <ul className="resource-list">
            {project.resources.map((r) => (
              <li key={r.id} className="resource">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="resource__link">
                  <ExternalLink size={18} aria-hidden="true" />
                  <span>
                    <span className="resource__title">{r.title}</span>
                    <span className="resource__kind">Opens in a new tab</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="topic__complete card card--flat" aria-live="polite">
        {project.status === 'LOCKED' && <p>Complete the topics above to unlock this project.</p>}
        {canSubmit && (
          <>
            <p>When your project works, submit it to record it on your profile.</p>
            <button type="button" className="btn btn--primary" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Submitting…' : 'Submit project'}
            </button>
          </>
        )}
        {(project.status === 'SUBMITTED' || project.status === 'COMPLETED') && (
          <p className="topic__done"><Check size={18} aria-hidden="true" /> {project.status === 'COMPLETED' ? 'Project completed.' : 'Project submitted.'}</p>
        )}
        {actionError && <div className="notice notice--error" role="alert"><p>{actionError}</p></div>}
      </section>
    </article>
  )
}
