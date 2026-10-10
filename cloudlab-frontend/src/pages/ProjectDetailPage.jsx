import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Circle, ExternalLink, Lock } from 'lucide-react'
import { api } from '../api'
import { useAsync } from '../lib/useAsync'
import { titleCase } from '../lib/format'
import { gsap, prefersReducedMotion } from '../lib/motion'
import StatusBadge from '../components/StatusBadge'
import ProgressRing from '../components/ProgressRing'
import { ErrorState, PageSkeleton } from '../components/States'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const { data, error, loading, reload } = useAsync(
    () => Promise.all([api.getProject(slug), api.getRoadmap()]),
    [slug],
  )

  if (loading && !data) return <PageSkeleton rows={3} />
  if (error) {
    const message = error.status === 403 ? 'This project belongs to the other cloud track.' : undefined
    return <ErrorState error={message ? { message } : error} onRetry={reload} title="Could not open this project" />
  }
  return <ProjectDetail key={slug} project={data[0]} roadmap={data[1]} reload={reload} />
}

function ProjectDetail({ project, roadmap, reload }) {
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')
  const [active, setActive] = useState('overview')
  const rootRef = useRef(null)

  const topicBySlug = new Map(roadmap.map((t) => [t.slug, t]))
  const required = project.requiredTopicSlugs.map((s) => ({ slug: s, topic: topicBySlug.get(s) }))
  const doneCount = required.filter((r) => r.topic?.status === 'COMPLETED').length
  const percent = required.length ? Math.round((doneCount / required.length) * 100) : 100
  const canSubmit = project.status === 'UNLOCKED' || project.status === 'IN_PROGRESS'
  const finished = project.status === 'SUBMITTED' || project.status === 'COMPLETED'

  const sections = [
    { id: 'overview', label: 'Overview', show: true },
    { id: 'requirements', label: 'Requirements', show: required.length > 0 },
    { id: 'resources', label: 'Resources', show: project.resources.length > 0 },
    { id: 'submit', label: 'Submit', show: true },
  ].filter((s) => s.show)

  // Highlight the contents link for the section currently in view.
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-20% 0px -65% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.pd-in', { y: 24, opacity: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out', clearProps: 'transform,opacity' })
    }, rootRef)
    return () => ctx.revert()
  }, [])

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
    <div className="pd" ref={rootRef}>
      <header className="pd-hero pd-in">
        <Link to="/projects" className="back-link"><ArrowLeft size={16} aria-hidden="true" /> Back to projects</Link>
        <div className="meta-row">
          <span className="badge">{titleCase(project.level)}</span>
          {project.free && <span className="badge badge--free">Free</span>}
          <StatusBadge status={project.status} kind="project" />
        </div>
        <h1>{project.title}</h1>
        <p className="pd-hero__lead">{project.description}</p>
      </header>

      <div className="pd-grid">
        <nav className="pd-contents pd-in" aria-label="On this page">
          <h2>Contents</h2>
          <ol>
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={active === s.id ? 'is-active' : ''} aria-current={active === s.id ? 'true' : undefined}>
                  <span className="pd-contents__n">{i + 1}</span>{s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="pd-main">
          <section id="overview" className="panel pd-in">
            <h2>Overview</h2>
            <p>
              {required.length > 0
                ? `This ${titleCase(project.level).toLowerCase()} project builds on ${required.length} ${required.length === 1 ? 'topic' : 'topics'}. You have completed ${doneCount} so far.`
                : `This ${titleCase(project.level).toLowerCase()} project has no required topics.`}
            </p>
            <p className="pd-note">
              {project.free
                ? 'This project is free and open as soon as you have an account.'
                : 'This project unlocks once you have completed the topics it builds on.'}
            </p>
          </section>

          {required.length > 0 && (
            <section id="requirements" className="panel pd-in">
              <h2>Requirements</h2>
              <p className="pd-note">Topics this project builds on.</p>
              <ul className="rows">
                {required.map(({ slug: s, topic }) => {
                  const done = topic?.status === 'COMPLETED'
                  const Icon = done ? Check : topic?.status === 'LOCKED' ? Lock : Circle
                  const body = (
                    <>
                      <span className={`req-dot${done ? ' is-done' : ''}`}><Icon size={13} aria-hidden="true" /></span>
                      <span className="row__title">{topic?.name ?? s}</span>
                      {topic && <StatusBadge status={topic.status} />}
                    </>
                  )
                  return (
                    <li key={s}>
                      {topic && topic.status !== 'LOCKED'
                        ? <Link to={`/roadmap/${topic.slug}`} className="row">{body}</Link>
                        : <div className="row row--locked">{body}</div>}
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          {project.resources.length > 0 && (
            <section id="resources" className="panel pd-in">
              <h2>Resources</h2>
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

          <section id="submit" className="panel pd-in" aria-live="polite">
            <h2>Submit</h2>
            {project.status === 'LOCKED' && <p>Complete the required topics to unlock this project.</p>}
            {canSubmit && (
              <>
                <p>When your project works, submit it to record it on your profile.</p>
                <button type="button" className="btn btn--primary" onClick={handleSubmit} disabled={saving}>
                  {saving ? 'Submitting…' : 'Submit project'}
                </button>
              </>
            )}
            {finished && (
              <p className="topic__done"><Check size={18} aria-hidden="true" /> {project.status === 'COMPLETED' ? 'Project completed.' : 'Project submitted.'}</p>
            )}
            {actionError && <div className="notice notice--error" role="alert"><p>{actionError}</p></div>}
          </section>
        </div>

        <aside className="pd-side pd-in" aria-label="Project status">
          <div className="panel pd-side__card">
            <ProgressRing percent={percent} size={96} stroke={8} label="Required topics completed" />
            <p className="pd-side__note">
              {required.length > 0 ? `${doneCount} of ${required.length} required topics done` : 'No required topics'}
            </p>
          </div>
          <dl className="panel pd-facts">
            <div><dt>Level</dt><dd>{titleCase(project.level)}</dd></div>
            <div><dt>Access</dt><dd>{project.free ? 'Free' : 'Paid'}</dd></div>
            <div><dt>Status</dt><dd><StatusBadge status={project.status} kind="project" /></dd></div>
          </dl>
        </aside>
      </div>
    </div>
  )
}
