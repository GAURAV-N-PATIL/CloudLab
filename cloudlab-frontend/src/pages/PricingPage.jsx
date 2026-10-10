import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { api, isMockMode } from '../api'
import { useAuth } from '../context/AuthContext'
import { useAsync } from '../lib/useAsync'
import { titleCase } from '../lib/format'
import { gsap, prefersReducedMotion } from '../lib/motion'
import {
  FREE_FEATURES, LIFETIME, LIFETIME_FEATURES, PRO, PRO_FEATURES, formatINR,
} from '../config/plans'

export default function PricingPage() {
  const { isAuthenticated } = useAuth()
  const { data: active, reload } = useAsync(
    () => (isAuthenticated ? api.getActiveSubscription() : Promise.resolve(null)),
    [isAuthenticated],
  )
  const [yearly, setYearly] = useState(true)
  const [busyPlan, setBusyPlan] = useState(null)
  const [message, setMessage] = useState(null) // { kind: 'error' | 'success', text }
  const pageRef = useRef(null)
  const priceRef = useRef(null)
  const shownPrice = useRef(PRO.yearly.amount)

  // GSAP: heading and cards rise in once, staggered.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.pricing__head > *', { y: 22, opacity: 0, duration: 0.7, stagger: 0.09 })
        .from('.price-card', { y: 48, opacity: 0, duration: 0.85, stagger: 0.12 }, '-=0.35')
    }, pageRef)
    return () => ctx.revert()
  }, [])

  // GSAP: the Pro price counts to its new value when the billing toggle flips.
  useLayoutEffect(() => {
    const el = priceRef.current
    if (!el) return
    const target = yearly ? PRO.yearly.amount : PRO.monthly.amount
    if (prefersReducedMotion()) {
      shownPrice.current = target
      el.textContent = formatINR(target)
      return
    }
    const state = { n: shownPrice.current }
    const tween = gsap.to(state, {
      n: target, duration: 0.6, ease: 'power2.out',
      onUpdate: () => { shownPrice.current = state.n; el.textContent = formatINR(state.n) },
    })
    return () => tween.kill()
  }, [yearly])

  // GSAP: a soft spotlight follows the pointer inside each card.
  function spotlight(e) {
    if (prefersReducedMotion()) return
    const card = e.currentTarget
    const glow = card.querySelector('.price-card__glow')
    const box = card.getBoundingClientRect()
    gsap.to(glow, { x: e.clientX - box.left, y: e.clientY - box.top, opacity: 1, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
  }
  function spotlightOff(e) {
    gsap.to(e.currentTarget.querySelector('.price-card__glow'), { opacity: 0, duration: 0.5, overwrite: 'auto' })
  }

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

  const proPlan = yearly ? PRO.yearly : PRO.monthly
  const isPro = active?.plan === 'MONTHLY' || active?.plan === 'YEARLY'
  const isLifetime = active?.plan === 'LIFETIME'

  function PlanButton({ planId, current, label, featured }) {
    if (!isAuthenticated) {
      return <Link to="/signup" className={`btn btn--block ${featured ? 'btn--primary' : 'btn--secondary'}`}>Sign up to choose</Link>
    }
    const isCurrent = current && active?.plan === planId
    return (
      <button
        type="button"
        className={`btn btn--block ${featured ? 'btn--primary' : 'btn--secondary'}`}
        disabled={isCurrent || busyPlan !== null}
        onClick={() => choose(planId)}
      >
        {isCurrent ? 'Current plan' : busyPlan === planId ? 'Working…' : label}
      </button>
    )
  }

  return (
    <div className="pricing" ref={pageRef}>
      <div className="pricing__glow pricing__glow--a" aria-hidden="true" />
      <div className="pricing__glow pricing__glow--b" aria-hidden="true" />

      <div className="pricing__head">
        <h1>Pricing</h1>
        <p>Start free. Upgrade when you want the cloud track, every project, and a certificate.</p>

        <div className="billing" role="group" aria-label="Billing period">
          <span className={!yearly ? 'is-on' : ''}>Monthly</span>
          <button
            type="button" role="switch" aria-checked={yearly}
            aria-label="Billed yearly" className="switch"
            onClick={() => setYearly((v) => !v)}
          >
            <span className="switch__thumb" />
          </button>
          <span className={yearly ? 'is-on' : ''}>Yearly <em>{PRO.yearly.note}</em></span>
        </div>
      </div>

      {isMockMode && (
        <div className="notice pricing__note"><p>Demo mode: choosing a plan activates it instantly with no payment.</p></div>
      )}
      {message && (
        <div className={`notice notice--${message.kind} pricing__note`} role={message.kind === 'error' ? 'alert' : 'status'}>
          <p>{message.text}</p>
        </div>
      )}

      <ul className="price-grid">
        <li className="price-card" onPointerMove={spotlight} onPointerLeave={spotlightOff}>
          <span className="price-card__glow" aria-hidden="true" />
          <h2>Free</h2>
          <p className="price-card__blurb">Everything you need to start learning.</p>
          <p className="price-card__price">{formatINR(0)} <span>forever</span></p>
          <ul className="price-card__features">
            {FREE_FEATURES.map((f) => <li key={f}><Check size={16} aria-hidden="true" />{f}</li>)}
          </ul>
          {isAuthenticated
            ? <button type="button" className="btn btn--secondary btn--block" disabled>{active ? 'Included' : 'Current plan'}</button>
            : <Link to="/signup" className="btn btn--secondary btn--block">Start free</Link>}
        </li>

        <li className="price-card price-card--featured" onPointerMove={spotlight} onPointerLeave={spotlightOff}>
          <span className="price-card__glow" aria-hidden="true" />
          <span className="price-card__tag">Most popular</span>
          <h2>Pro</h2>
          <p className="price-card__blurb">The full path, projects and certificate.</p>
          <p className="price-card__price"><span ref={priceRef} className="price-card__amount">{formatINR(PRO.yearly.amount)}</span> <span>{proPlan.cadence}</span></p>
          <ul className="price-card__features">
            {PRO_FEATURES.map((f) => <li key={f}><Check size={16} aria-hidden="true" />{f}</li>)}
          </ul>
          <PlanButton planId={proPlan.id} current={isPro} label={`Choose ${yearly ? 'yearly' : 'monthly'}`} featured />
        </li>

        <li className="price-card" onPointerMove={spotlight} onPointerLeave={spotlightOff}>
          <span className="price-card__glow" aria-hidden="true" />
          <h2>Lifetime</h2>
          <p className="price-card__blurb">Pay once and keep learning.</p>
          <p className="price-card__price">{formatINR(LIFETIME.amount)} <span>{LIFETIME.cadence}</span></p>
          <ul className="price-card__features">
            {LIFETIME_FEATURES.map((f) => <li key={f}><Check size={16} aria-hidden="true" />{f}</li>)}
          </ul>
          <PlanButton planId={LIFETIME.id} current={isLifetime} label="Choose lifetime" />
        </li>
      </ul>
    </div>
  )
}
