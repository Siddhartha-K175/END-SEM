import { useEffect, useState } from 'react'
import { getCart } from '../lib/cart.js'
import { useSessionUser } from './useSessionUser.js'

export function useCart() {
  const user = useSessionUser()
  const [cart, setCart] = useState({ items: [] })

  useEffect(() => {
    // Initial load
    setCart(getCart(user?.id))
    
    // Listen for cart updates
    const onCart = () => setCart(getCart(user?.id))
    window.addEventListener('fsad:cart', onCart)
    return () => window.removeEventListener('fsad:cart', onCart)
  }, [user?.id])

  return cart
}

