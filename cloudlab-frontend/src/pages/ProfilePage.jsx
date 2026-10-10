import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Award, Check, FileText } from 'lucide-react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useAsync } from '../lib/useAsync'
import { formatDate, summarizeProgress, titleCase } from '../lib/format'
import { gsap, prefersReducedMotion } from '../lib/motion'
import ProgressRing from '../components/ProgressRing'
import ProgressBar from '../components/ProgressBar'
import CountUp from '../components/CountUp'
import { ErrorState, PageSkeleton } from '../components/States'

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?'
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { data, error, loading, reload } = useAsync(
    () => Promise.all([api.getRoadmap(), api.getCertificates(), api.getActiveSubscription(), api.getProjects()]),
    [],
  )

  if (loading) return <PageSkeleton rows={3} />
  if (error) return <ErrorState error={error} onRetry={reload} />
  const [topics, certificates, subscription, projects] = data
  return <ProfileView user={user} topics={topics} certificates={certificates} subscription={subscription} projects={projects} />
}

function ProfileView({ user, topics, certificates, subscription, projects }) {
  const rootRef = useRef(null)
  const { completed, total, percent } = summarizeProgress(topics)
  const submitted = projects.filter((p) => p.status === 'SUBMITTED' || p.status === 'COMPLETED').length
  const levels = LEVELS
    .map((level) => {
      const items = topics.filter((t) => t.level === level)
      return { level, ...summarizeProgress(items) }
    })
    .filter((l) => l.total > 0)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.pf-in', { y: 26, opacity: 0, duration: 0.75, stagger: 0.09, ease: 'power3.out', clearProps: 'transform,opacity' })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="pf" ref={rootRef}>
      <header className="pf-head pf-in">
        <div className="avatar" aria-hidden="true">{initials(user.name)}</div>
        <div className="pf-head__text">
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <div className="meta-row">
            <span className="badge">{user.selectedCloudName ?? 'No cloud track yet'}</span>
            <span className={`badge${subscription ? ' badge--done' : ''}`}>
              {subscription ? `${titleCase(subscription.plan)} plan` : 'Free plan'}
            </span>
          </div>
        </div>
        <Link to="/explore" className="btn btn--secondary pf-head__action">
          <FileText size={16} aria-hidden="true" /> Assignments &amp; Experiments
        </Link>
      </header>

      <div className="pf-grid">
        <section className="panel pf-progress pf-in" aria-labelledby="pf-progress">
          <h2 id="pf-progress">Progress</h2>
          <div className="pf-progress__top">
            <ProgressRing percent={percent} label="Roadmap progress" />
            <ul className="pf-stats">
              <li><span className="stat__num"><CountUp value={completed} /></span><span className="stat__label">Topics done</span></li>
              <li><span className="stat__num"><CountUp value={submitted} /></span><span className="stat__label">Projects submitted</span></li>
              <li><span className="stat__num"><CountUp value={certificates.length} /></span><span className="stat__label">Certificates</span></li>
            </ul>
          </div>
          {levels.length > 0 && (
            <div className="pf-levels">
              {levels.map((l) => (
                <div key={l.level}>
                  <span className="pf-levels__name">{titleCase(l.level)}</span>
                  <ProgressBar percent={l.percent} label={`${titleCase(l.level)} progress`} detail={`${l.completed} of ${l.total} topics`} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel pf-plan pf-in" aria-labelledby="pf-plan">
          <h2 id="pf-plan">Plan</h2>
          {subscription ? (
            <>
              <p className="pf-plan__name">{titleCase(subscription.plan)}</p>
              <p className="pd-note">Active since {formatDate(subscription.startedAt)}.</p>
              <p className="pd-note">{subscription.expiresAt ? `Ends on ${formatDate(subscription.expiresAt)}.` : 'Never expires.'}</p>
              <ul className="pf-plan__list">
                <li><Check size={15} aria-hidden="true" /> Cloud track and paid projects</li>
                <li><Check size={15} aria-hidden="true" /> Completion certificate</li>
              </ul>
            </>
          ) : (
            <>
              <p className="pf-plan__name">Free</p>
              <p className="pd-note">Beginner topics and two projects. Upgrade for the cloud track, every project and a certificate.</p>
              <Link to="/pricing" className="btn btn--primary">See plans</Link>
            </>
          )}
        </section>
      </div>

      <section className="pf-certs pf-in" aria-labelledby="pf-certs">
        <h2 id="pf-certs">Certificates</h2>
        {certificates.length === 0 ? (
          <div className="panel pf-certs__empty">
            <Award size={26} aria-hidden="true" />
            <div>
              <strong>No certificate yet</strong>
              <p>Complete every topic on your track to earn one. You have {Math.max(0, total - completed)} {total - completed === 1 ? 'topic' : 'topics'} to go.</p>
            </div>
          </div>
        ) : (
          <ul className="cert-list">
            {certificates.map((c) => (
              <li key={c.id} className="panel cert">
                <Award size={24} aria-hidden="true" />
                <div>
                  <strong>{c.certificateCode}</strong>
                  <div className="cert__date">Issued {formatDate(c.issuedAt)}</div>
                </div>
                {c.pdfUrl && <a href={c.pdfUrl} className="btn btn--secondary" target="_blank" rel="noopener noreferrer">Download</a>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
