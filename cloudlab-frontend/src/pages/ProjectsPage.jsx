import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Check, Circle, Lock } from 'lucide-react'
import { api } from '../api'
import { useAsync } from '../lib/useAsync'
import { titleCase } from '../lib/format'
import { gsap, prefersReducedMotion } from '../lib/motion'
import StatusBadge from '../components/StatusBadge'
import TiltCard from '../components/TiltCard'
import { EmptyState, ErrorState, PageSkeleton } from '../components/States'

const FILTERS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'free', label: 'Free', test: (p) => p.free },
  { id: 'ready', label: 'Ready to start', test: (p) => p.status === 'UNLOCKED' || p.status === 'IN_PROGRESS' },
  { id: 'locked', label: 'Locked', test: (p) => p.status === 'LOCKED' },
  { id: 'done', label: 'Submitted', test: (p) => p.status === 'SUBMITTED' || p.status === 'COMPLETED' },
]

// The list endpoint only returns titles, so each project's detail is fetched too, to show
// its description and the topics it needs. A failed detail just means a plainer card.
async function loadProjects() {
  const [projects, roadmap] = await Promise.all([api.getProjects(), api.getRoadmap()])
  const details = await Promise.all(projects.map((p) => api.getProject(p.slug).catch(() => null)))
  const topicBySlug = new Map(roadmap.map((t) => [t.slug, t]))
  return projects.map((p, i) => ({
    ...p,
    description: details[i]?.description ?? '',
    required: (details[i]?.requiredTopicSlugs ?? []).map((s) => topicBySlug.get(s)).filter(Boolean),
  }))
}

export default function ProjectsPage() {
  const { data, error, loading, reload } = useAsync(loadProjects, [])
  const [filter, setFilter] = useState('all')
  const gridRef = useRef(null)

  const visible = useMemo(() => {
    const test = FILTERS.find((f) => f.id === filter).test
    return (data ?? []).filter(test)
  }, [data, filter])

  // GSAP: cards rise in, staggered, on first load and whenever the filter changes.
  useLayoutEffect(() => {
    if (!gridRef.current || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.pcard-wrap', { y: 30, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', clearProps: 'transform,opacity' })
    }, gridRef)
    return () => ctx.revert()
  }, [filter, loading])

  if (loading) return <PageSkeleton rows={3} />
  if (error) return <ErrorState error={error} onRetry={reload} />
  if (data.length === 0) return <EmptyState title="No projects yet">Projects will appear here.</EmptyState>

  return (
    <div>
      <div className="page-head">
        <h1>Projects</h1>
        <p>Build something real. Free projects are always open; the rest unlock as you finish the topics they need.</p>
      </div>

      <div className="chips" role="group" aria-label="Filter projects">
        {FILTERS.map((f) => {
          const count = data.filter(f.test).length
          return (
            <button
              key={f.id} type="button"
              className={`chip${filter === f.id ? ' is-active' : ''}`}
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label} <span className="chip__count">{count}</span>
            </button>
          )
        })}
      </div>

      {visible.length === 0 ? (
        <EmptyState title="Nothing here yet">No projects match this filter.</EmptyState>
      ) : (
        <ul className="pgrid" ref={gridRef}>
          {visible.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </ul>
      )}
    </div>
  )
}

function ProjectCard({ project: p }) {
  const locked = p.status === 'LOCKED'
  const doneCount = p.required.filter((t) => t.status === 'COMPLETED').length
  const percent = p.required.length ? Math.round((doneCount / p.required.length) * 100) : 100

  return (
    <li className="pcard-wrap">
      <TiltCard
        to={`/projects/${p.slug}`}
        className={`pcard${locked ? ' pcard--locked' : ''}${p.free ? ' pcard--free' : ''}`}
        aria-label={`${p.title}, ${titleCase(p.level)}, ${p.status.toLowerCase()}`}
      >
        <div className="pcard__top z1">
          <span className="badge">{titleCase(p.level)}</span>
          {p.free && <span className="badge badge--free">Free</span>}
          <span className="pcard__status"><StatusBadge status={p.status} kind="project" /></span>
        </div>

        <h2 className="pcard__title z3">{p.title}</h2>
        {p.description && <p className="pcard__desc z2">{p.description}</p>}

        {p.required.length > 0 && (
          <ul className="pcard__topics z2" aria-label="Topics this project needs">
            {p.required.slice(0, 3).map((t) => {
              const done = t.status === 'COMPLETED'
              return (
                <li key={t.slug} className={`tchip${done ? ' is-done' : ''}`}>
                  {done ? <Check size={12} aria-hidden="true" /> : locked ? <Lock size={11} aria-hidden="true" /> : <Circle size={11} aria-hidden="true" />}
                  {t.name}
                </li>
              )
            })}
            {p.required.length > 3 && <li className="tchip">+{p.required.length - 3}</li>}
          </ul>
        )}

        {p.required.length > 0 && (
          <div className="pcard__foot z1">
            <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="Required topics completed">
              <div className={`progress__fill${percent === 100 ? ' progress__fill--done' : ''}`} style={{ width: `${percent}%` }} />
            </div>
            <span className="pcard__foot-note">{doneCount} of {p.required.length} topics done</span>
          </div>
        )}
      </TiltCard>
    </li>
  )
}
