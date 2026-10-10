import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { api, isMockMode } from '../api'
import { useAuth } from '../context/AuthContext'
import { useAsync } from '../lib/useAsync'
import { FREE_FEATURES, PAID_FEATURES, PLANS } from '../config/plans'
import { titleCase } from '../lib/format'

export default function PricingPage() {
  const { isAuthenticated } = useAuth()
  const { data: active, reload } = useAsync(
    () => (isAuthenticated ? api.getActiveSubscription() : Promise.resolve(null)),
    [isAuthenticated],
  )
  const [busyPlan, setBusyPlan] = useState(null)
  const [message, setMessage] = useState(null) // { kind: 'error' | 'success', text }

  async function choose(planId) {
    setBusyPlan(planId)
    setMessage(null)
    try {
      await api.subscribe(planId)
      setMessage({ kind: 'success', text: `${titleCase(planId)} plan activated.` })
      reload()
    } catch (err) {
      setMessage({ kind: 'error', text: err.message })
    } finally {
      setBusyPlan(null)
    }
  }

  return (
    <div>
      <div className="page-head">
        <h1>Pricing</h1>
        <p>Start free. Upgrade when you want the cloud track, every project, and a certificate.</p>
      </div>

      {isMockMode && (
        <div className="notice pricing__note">
          <p>Demo mode: choosing a plan activates it instantly with no payment.</p>
        </div>
      )}
      {message && (
        <div className={`notice notice--${message.kind} pricing__note`} role={message.kind === 'error' ? 'alert' : 'status'}>
          <p>{message.text}</p>
        </div>
      )}

      <div className="compare">
        <section className="card card--flat" aria-labelledby="free-title">
          <h2 id="free-title">Free</h2>
          <ul className="feature-list">
            {FREE_FEATURES.map((f) => <li key={f}><Check size={16} aria-hidden="true" />{f}</li>)}
          </ul>
        </section>
        <section className="card card--flat" aria-labelledby="paid-title">
          <h2 id="paid-title">Paid</h2>
          <ul className="feature-list">
            {PAID_FEATURES.map((f) => <li key={f}><Check size={16} aria-hidden="true" />{f}</li>)}
          </ul>
        </section>
      </div>

      <ul className="plans">
        {PLANS.map((plan) => {
          const isCurrent = active?.plan === plan.id
          return (
            <li key={plan.id} className={`card plan${plan.highlight ? ' plan--highlight' : ''}`}>
              <h3>{plan.name}</h3>
              <p className="plan__price">{plan.price} <span>{plan.cadence}</span></p>
              <p className="plan__note">{plan.note}</p>
              {isAuthenticated ? (
                <button
                  type="button"
                  className={`btn btn--block ${plan.highlight ? 'btn--primary' : 'btn--secondary'}`}
                  disabled={isCurrent || busyPlan !== null}
                  onClick={() => choose(plan.id)}
                >
                  {isCurrent ? 'Current plan' : busyPlan === plan.id ? 'Working…' : `Choose ${plan.name.toLowerCase()}`}
                </button>
              ) : (
                <Link to="/signup" className={`btn btn--block ${plan.highlight ? 'btn--primary' : 'btn--secondary'}`}>
                  Sign up to choose
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
