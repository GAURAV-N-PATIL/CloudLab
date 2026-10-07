import { Link } from 'react-router-dom'
import { Award } from 'lucide-react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useAsync } from '../lib/useAsync'
import { formatDate, summarizeProgress, titleCase } from '../lib/format'
import ProgressBar from '../components/ProgressBar'
import { ErrorState, PageSkeleton } from '../components/States'

export default function ProfilePage() {
  const { user } = useAuth()
  const { data, error, loading, reload } = useAsync(
    () => Promise.all([api.getRoadmap(), api.getCertificates(), api.getActiveSubscription()]),
    [],
  )

  if (loading) return <PageSkeleton rows={3} />
  if (error) return <ErrorState error={error} onRetry={reload} />

  const [topics, certificates, subscription] = data
  const { completed, total, percent } = summarizeProgress(topics)

  return (
    <div>
      <div className="page-head">
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </div>

      <div className="dash-grid">
        <section className="card" aria-labelledby="pf-progress">
          <h2 id="pf-progress">Progress</h2>
          <ProgressBar percent={percent} label="Roadmap progress" detail={`${completed} of ${total} topics`} />
          <p className="profile__meta">
            Track: {user.selectedCloudName ?? 'Not chosen yet'}
          </p>
        </section>

        <section className="card" aria-labelledby="pf-plan">
          <h2 id="pf-plan">Plan</h2>
          {subscription ? (
            <>
              <p><strong>{titleCase(subscription.plan)}</strong>, active since {formatDate(subscription.startedAt)}.</p>
              {subscription.expiresAt
                ? <p>Renews or ends on {formatDate(subscription.expiresAt)}.</p>
                : <p>Never expires.</p>}
            </>
          ) : (
            <>
              <p>You are on the free plan.</p>
              <Link to="/pricing" className="btn btn--secondary">See plans</Link>
            </>
          )}
        </section>
      </div>

      <section className="profile__certs" aria-labelledby="pf-certs">
        <h2 id="pf-certs">Certificates</h2>
        {certificates.length === 0 ? (
          <p>You will earn a certificate when you complete every topic on your track.</p>
        ) : (
          <ul className="cert-list">
            {certificates.map((c) => (
              <li key={c.id} className="card cert">
                <Award size={22} aria-hidden="true" />
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
