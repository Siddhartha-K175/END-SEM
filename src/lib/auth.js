import { findUserByEmail, getUser, upsertUser } from './db.js'
import { id, readJson, removeKey, writeJson } from './storage.js'

const SESSION_KEY = 'fsad.session'

function notify() {
  window.dispatchEvent(new Event('fsad:session'))
}

function migrateCart(userId) {
  const guestCart = readJson('fsad.cart.guest', { items: [] })
  if (guestCart?.items?.length > 0) {
    const userCart = readJson(`fsad.cart.${userId}`, { items: [] })
    const merged = {
      items: [
        ...userCart.items,
        ...guestCart.items.filter(
          (g) => !userCart.items.find((u) => u.productId === g.productId),
        ),
      ],
    }
    writeJson(`fsad.cart.${userId}`, merged)
    removeKey('fsad.cart.guest')
    window.dispatchEvent(new Event('fsad:cart'))
  }
}

export function getSession() {
  return readJson(SESSION_KEY, null)
}

export function getCurrentUser() {
  const session = getSession()
  if (!session?.userId) return null
  return getUser(session.userId)
}

export function login({ email, password }) {
  const user = findUserByEmail(email)
  if (!user) throw new Error('No account found for that email.')
  if (user.password !== password) throw new Error('Incorrect password.')
  writeJson(SESSION_KEY, { userId: user.id })
  migrateCart(user.id)
  notify()
  return user
}

export function logout() {
  removeKey(SESSION_KEY)
  notify()
}

export function register({ name, email, password, role }) {
  if (!name?.trim()) throw new Error('Name is required.')
  if (!email?.trim()) throw new Error('Email is required.')
  if (!password) throw new Error('Password is required.')
  if (password.length < 4) throw new Error('Password must be at least 4 characters.')
  if (!['admin', 'farmer', 'buyer'].includes(role)) throw new Error('Invalid role.')
  const existing = findUserByEmail(email)
  if (existing) throw new Error('That email is already registered.')

  const user = upsertUser({
    id: id(),
    role,
    name: name.trim(),
    email: email.trim(),
    password,
    createdAt: new Date().toISOString(),
  })
  writeJson(SESSION_KEY, { userId: user.id })
  migrateCart(user.id)
  notify()
  return user
}

