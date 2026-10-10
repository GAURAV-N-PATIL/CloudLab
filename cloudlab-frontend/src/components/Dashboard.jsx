import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { api } from '../api'
import { useAsync } from '../lib/useAsync'
import { findNextTopic, summarizeProgress, titleCase } from '../lib/format'
import { gsap, prefersReducedMotion } from '../lib/motion'
import ProgressRing from './ProgressRing'
import StatusBadge from './StatusBadge'
import CountUp from './CountUp'
import { ErrorState, PageSkeleton } from './States'

export default function Dashboard({ user }) {
  const { data, error, loading, reload } = useAsync(
    () => Promise.all([api.getRoadmap(), api.getProjects()]),
    [],
  )

  if (loading) return <PageSkeleton rows={3} />
  if (error) return <ErrorState error={error} onRetry={reload} />
  return <DashboardView user={user} topics={data[0]} projects={data[1]} />
}

// Mounted only after the data arrives, so the entrance animation plays once.
function DashboardView({ user, topics, projects }) {
  const rootRef = useRef(null)
  const { completed, total, percent } = summarizeProgress(topics)
  const next = findNextTopic(topics)
  const upcoming = topics.filter((t) => t.status !== 'COMPLETED').slice(0, 4)
  const readyProjects = projects.filter((p) => p.status === 'UNLOCKED' || p.status === 'IN_PROGRESS')
  const needsCloud = !user.selectedCloudSlug && total > 0 && completed === total
  const firstName = user.name.split(' ')[0]

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.dash-in', { y: 26, opacity: 0, duration: 0.75, stagger: 0.09, ease: 'power3.out', clearProps: 'transform,opacity' })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="dash" ref={rootRef}>
      <header className="dash-head dash-in">
        <div>
          <h1>Welcome back, {firstName}</h1>
          <p>
            {user.selectedCloudName
              ? `You are on the ${user.selectedCloudName} track.`
              : 'You are on the provider-neutral path.'}
          </p>
        </div>
        <Link to="/roadmap" className="btn btn--secondary">Open roadmap</Link>
      </header>

      <section className="dash-hero card dash-in" aria-labelledby="dash-next">
        <div className="dash-hero__body">
          <span className="dash-hero__label">{needsCloud ? 'Next step' : next ? 'Up next' : 'All done'}</span>
          {needsCloud ? (
            <>
              <h2 id="dash-next">Choose your cloud track</h2>
              <p>You finished the provider-neutral topics. Pick AWS or Azure to continue.</p>
              <Link to="/roadmap" className="btn btn--primary btn--lg">Choose a cloud track</Link>
            </>
          ) : next ? (
            <>
              <h2 id="dash-next">{next.name}</h2>
              <p>{next.description}</p>
              <div className="dash-hero__actions">
                <Link to={`/roadmap/${next.slug}`} className="btn btn--primary btn--lg">
                  {next.status === 'IN_PROGRESS' ? 'Continue topic' : 'Start topic'}
                </Link>
                <Link to="/roadmap" className="btn btn--ghost btn--lg">See the full path</Link>
              </div>
            </>
          ) : (
            <>
              <h2 id="dash-next">You have finished everything available</h2>
              <p>Every topic on your track is complete. Check your projects and certificate.</p>
              <Link to="/profile" className="btn btn--primary btn--lg">View profile</Link>
            </>
          )}
        </div>
        <div className="dash-hero__ring">
          <ProgressRing percent={percent} label="Roadmap progress" />
          <span className="dash-hero__ring-note">{completed} of {total} topics</span>
        </div>
      </section>

      <div className="stat-row">
        <div className="stat dash-in">
          <span className="stat__num"><CountUp value={completed} /></span>
          <span className="stat__label">Topics completed</span>
        </div>
        <div className="stat dash-in">
          <span className="stat__num"><CountUp value={Math.max(0, total - completed)} /></span>
          <span className="stat__label">Topics to go</span>
        </div>
        <div className="stat dash-in">
          <span className="stat__num"><CountUp value={readyProjects.length} /></span>
          <span className="stat__label">Projects ready</span>
        </div>
      </div>

      <div className="dash-cols">
        <section className="panel dash-in" aria-labelledby="dash-list">
          <div className="panel__head">
            <h2 id="dash-list">Coming up</h2>
            <Link to="/roadmap" className="panel__link">All topics</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="panel__empty">Nothing left on your track.</p>
          ) : (
            <ul className="rows">
              {upcoming.map((t) => (
                <li key={t.slug}>
                  {t.status === 'LOCKED' ? (
                    <div className="row row--locked" aria-disabled="true">
                      <span className="row__title">{t.name}</span>
                      <StatusBadge status={t.status} />
                    </div>
                  ) : (
                    <Link to={`/roadmap/${t.slug}`} className="row">
                      <span className="row__title">{t.name}</span>
                      <StatusBadge status={t.status} />
                      <ArrowRight size={16} className="row__go" aria-hidden="true" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel dash-in" aria-labelledby="dash-projects">
          <div className="panel__head">
            <h2 id="dash-projects">Projects</h2>
            <Link to="/projects" className="panel__link">All projects</Link>
          </div>
          {projects.length === 0 ? (
            <p className="panel__empty">No projects yet.</p>
          ) : (
            <ul className="rows">
              {projects.slice(0, 4).map((p) => (
                <li key={p.slug}>
                  <Link to={`/projects/${p.slug}`} className={`row${p.status === 'LOCKED' ? ' row--locked' : ''}`}>
                    <span className="row__title">
                      {p.title}
                      <span className="row__sub">{titleCase(p.level)}{p.free ? ' · Free' : ''}</span>
                    </span>
                    <StatusBadge status={p.status} kind="project" />
                    <ArrowRight size={16} className="row__go" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
