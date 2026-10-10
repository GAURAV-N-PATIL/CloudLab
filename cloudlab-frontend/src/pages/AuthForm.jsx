import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isMockMode } from '../api'

// Shared by /login and /signup. mode: 'login' | 'signup'
export default function AuthForm({ mode }) {
  const isSignup = mode === 'signup'
  const { isAuthenticated, login, signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

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
    <div className="auth">
      <h1>{isSignup ? 'Create your account' : 'Log in'}</h1>
      <p className="auth__lead">
        {isSignup ? 'Free to start. No card needed.' : 'Welcome back. Pick up where you left off.'}
      </p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        {isSignup && (
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" autoComplete="name" required maxLength={100} value={form.name} onChange={update('name')} />
          </div>
        )}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" required value={form.email} onChange={update('email')} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password" type="password" required
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            value={form.password} onChange={update('password')}
            aria-describedby={isSignup ? 'pw-hint' : undefined}
          />
          {isSignup && <span id="pw-hint" className="field__hint">At least 8 characters.</span>}
        </div>

        {error && <div className="notice notice--error" role="alert"><p>{error}</p></div>}

        <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
          {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
        </button>
      </form>

      <p className="auth__switch">
        {isSignup ? 'Already have an account? ' : 'New to CloudLab? '}
        <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Log in' : 'Create an account'}</Link>
      </p>

      {isMockMode && !isSignup && (
        <p className="field__hint">Demo account: demo@cloudlab.dev / password123</p>
      )}
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
