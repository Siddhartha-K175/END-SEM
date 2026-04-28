import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '../lib/auth.js'

function defaultRouteFor(role) {
  if (role === 'admin') return '/admin'
  if (role === 'farmer') return '/farmer'
  return '/marketplace'
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = useMemo(() => location.state?.from, [location.state])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const user = login({ email, password })
      navigate(from || defaultRouteFor(user.role), { replace: true })
    } catch (err) {
      setError(err?.message || 'Login failed.')
    } finally {
      setBusy(false)
    }
  }

  function demo(email, password) {
    setEmail(email)
    setPassword(password)
    setTimeout(() => {
      try {
        const user = login({ email, password })
        navigate(defaultRouteFor(user.role), { replace: true })
      } catch (err) {
        setError(err?.message || 'Demo login failed.')
      }
    }, 0)
  }

  return (
    <div className="page">
      <div className="pageHead">
        <div className="h2">Login</div>
        <div className="muted">Access admin, farmer, or buyer features.</div>
      </div>

      <div className="card formCard">
        <form className="stack" onSubmit={onSubmit}>
          <div className="grid grid--2">
            <label className="field">
              <span className="field__label">Email</span>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="field">
              <span className="field__label">Password</span>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>
          </div>

          {error ? <div className="alert alert--error">{error}</div> : null}

          <button className="btn" disabled={busy}>
            {busy ? 'Signing in…' : 'Login'}
          </button>

          <div className="divider" />

          <div className="row row--gap row--wrap">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => demo('admin@fsad.local', 'admin123')}
            >
              Demo Admin
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => demo('farmer@fsad.local', 'farmer123')}
            >
              Demo Farmer
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => demo('buyer@fsad.local', 'buyer123')}
            >
              Demo Buyer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

