import { Navigate } from 'react-router-dom'
import { useSessionUser } from './useSessionUser.js'

export function RequireRole({ allow, children }) {
  const user = useSessionUser()
  if (!user) return <Navigate to="/login" replace />

  if (!allow?.includes(user.role)) {
    return <Navigate to="/marketplace" replace />
  }
  return children
}

