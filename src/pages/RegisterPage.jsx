import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../lib/auth.js'
import { apiRegister, isBackendMode } from '../lib/api.js'
import { writeJson } from '../lib/storage.js'

const SESSION_KEY = 'fsad.session'

function defaultRouteFor(role) {
  if (role === 'admin') return '/admin'
  if (role === 'farmer') return '/farmer'
  return '/marketplace'
}

export function RegisterPage() {
  const navigate = useNavigate()

  const [role, setRole] = useState('buyer')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      let user
      if (isBackendMode) {
        // Call Spring Boot backend
        const data = await apiRegister({ name, email, password, role })
        user = data.user ?? data
        // Store token/session returned by backend
        if (data.token) writeJson('fsad.token', data.token)
        writeJson(SESSION_KEY, { userId: user.id })
        window.dispatchEvent(new Event('fsad:session'))
      } else {
        // localStorage demo mode
        user = register({ role, name, email, password })
      }
      navigate(defaultRouteFor(user.role), { replace: true })
    } catch (err) {
      setError(err?.message || 'Registration failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <div className="pageHead">
        <div className="h2">Create account</div>
        <div className="muted">
          {isBackendMode
            ? 'Choose a role. Your account will be saved to the database.'
            : 'Choose a role. Your account will be stored in this browser (localStorage demo).'}
        </div>
      </div>

      <div className="card formCard">
        <form className="stack" onSubmit={onSubmit}>
          <div className="grid grid--2">
            <label className="field">
              <span className="field__label">Role</span>
              <select
                className="input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="buyer">Buyer</option>
                <option value="farmer">Farmer</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label className="field">
              <span className="field__label">Name</span>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name / organization"
                required
              />
            </label>
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
                placeholder="Choose a password (min 4 chars)"
                minLength={4}
                required
              />
            </label>
          </div>

          {error ? <div className="alert alert--error">{error}</div> : null}

          <button className="btn" disabled={busy}>
            {busy ? 'Creating…' : 'Create account'}
          </button>

          {!isBackendMode && (
            <div className="muted tiny">
              Note: this is a demo app. Credentials are stored in your browser
              localStorage (not secure). Set VITE_API_URL in .env to connect a
              Spring Boot backend.
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
