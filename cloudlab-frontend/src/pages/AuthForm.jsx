import { useLayoutEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Cloud, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { isMockMode } from '../api'
import { gsap, prefersReducedMotion } from '../lib/motion'

const PANEL_STEPS = ['Linux', 'Networking', 'Git & GitHub', 'Docker', 'Kubernetes', 'Terraform']

// Shared by /login and /signup. mode: 'login' | 'signup'
export default function AuthForm({ mode }) {
  const isSignup = mode === 'signup'
  const { isAuthenticated, login, signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const pageRef = useRef(null)

  // GSAP: the card settles in, the panel's path draws itself, then the form fields follow.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.auth__card', { y: 30, opacity: 0, scale: 0.985, duration: 0.8 })
        .from('.auth-panel__copy > *', { y: 16, opacity: 0, duration: 0.6, stagger: 0.09 }, 0.25)
        .from('.ap__spine', { scaleY: 0, transformOrigin: 'top center', duration: 1.1, ease: 'power2.inOut' }, 0.4)
        .from('.ap__item', { opacity: 0, x: -10, duration: 0.45, stagger: 0.12 }, 0.5)
        .from('.ap__dot', { scale: 0, duration: 0.4, stagger: 0.12, ease: 'back.out(2.4)' }, 0.5)
        .from('.auth__form > *', { y: 14, opacity: 0, duration: 0.5, stagger: 0.07 }, 0.35)
    }, pageRef)
    return () => ctx.revert()
  }, [mode])

  if (isAuthenticated) return <Navigate to="/home" replace />

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (isSignup && form.password.length < 8) {
      setError('Use a password with at least 8 characters.')
      return
    }
    setBusy(true)
    try {
      if (isSignup) await signup(form.name, form.email, form.password)
      else await login(form.email, form.password)
      navigate(location.state?.from || '/home', { replace: true })
    } catch (err) {
      setError(messageFor(err, isSignup))
      setBusy(false)
    }
  }

  return (
    <div className="auth" ref={pageRef}>
      <div className="auth__card">
        <aside className="auth-panel">
          <div className="auth-panel__grid" aria-hidden="true" />
          <div className="auth-panel__top">
            <Link to="/home" className="nav__brand">
              <span className="nav__brand-mark"><Cloud size={17} aria-hidden="true" /></span>
              CloudLab
            </Link>
            <Link to="/home" className="auth-panel__back"><ArrowLeft size={14} aria-hidden="true" /> Back to site</Link>
          </div>

          <div className="auth-panel__copy">
            <h2>{isSignup ? 'Start at Linux. Finish in the cloud.' : 'Pick up your roadmap where you left it.'}</h2>
            <p>{isSignup
              ? 'A fixed path, one topic at a time, with projects that unlock as you learn.'
              : 'Your progress, your next topic, and your projects are waiting.'}</p>
          </div>

          <ol className="ap" aria-hidden="true">
            <span className="ap__spine" />
            {PANEL_STEPS.map((s) => (
              <li key={s} className="ap__item"><span className="ap__dot" />{s}</li>
            ))}
          </ol>
        </aside>

        <div className="auth__pane">
          <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
          <p className="auth__switch">
            {isSignup ? 'Already have an account? ' : 'New to CloudLab? '}
            <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Log in' : 'Create an account'}</Link>
          </p>

          <form className="form auth__form" onSubmit={handleSubmit} noValidate>
            {isSignup && (
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" type="text" autoComplete="name" required maxLength={100} placeholder="Your name" value={form.name} onChange={update('name')} />
              </div>
            )}
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" autoComplete="email" required placeholder="you@example.com" value={form.email} onChange={update('email')} />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="field__wrap">
                <input
                  id="password" type={showPassword ? 'text' : 'password'} required
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  placeholder={isSignup ? 'At least 8 characters' : 'Enter your password'}
                  value={form.password} onChange={update('password')}
                />
                <button
                  type="button" className="field__toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
            </div>

            {error && <div className="notice notice--error" role="alert"><p>{error}</p></div>}

            <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={busy}>
              {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
            </button>

            {isMockMode && !isSignup && (
              <p className="field__hint">Demo account: demo@cloudlab.dev / password123</p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

function messageFor(err, isSignup) {
  if (err.status === 401) return 'Email or password is incorrect.'
  if (err.status === 409) return 'An account with this email already exists. Try logging in.'
  if (err.status === 400) return isSignup
    ? 'Check your details: use a valid email and a password of at least 8 characters.'
    : 'Enter a valid email and your password.'
  return err.message
}
