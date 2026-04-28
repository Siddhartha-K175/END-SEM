import { useEffect, useState } from 'react'
import { getCurrentUser } from '../lib/auth.js'

export function useSessionUser() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const onSession = () => setTick((t) => t + 1)
    const onStorage = (e) => {
      if (e.key === 'fsad.session') onSession()
    }
    window.addEventListener('fsad:session', onSession)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('fsad:session', onSession)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  // tick is only used to trigger re-renders on session change
  void tick
  return getCurrentUser()
}

