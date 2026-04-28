import { readJson, writeJson } from './storage.js'

function keyFor(userId) {
  return `fsad.cart.${userId || 'guest'}`
}

export function getCart(userId) {
  const cart = readJson(keyFor(userId), { items: [] })
  if (!cart?.items || !Array.isArray(cart.items)) return { items: [] }
  return cart
}

export function setCart(userId, cart) {
  writeJson(keyFor(userId), cart)
  window.dispatchEvent(new Event('fsad:cart'))
}

export function addToCart(userId, productId, qty = 1) {
  const cart = getCart(userId)
  const items = cart.items.slice()
  const idx = items.findIndex((i) => i.productId === productId)
  if (idx === -1) items.push({ productId, qty })
  else items[idx] = { ...items[idx], qty: items[idx].qty + qty }
  setCart(userId, { ...cart, items })
}

export function updateQty(userId, productId, qty) {
  const cart = getCart(userId)
  const items = cart.items
    .map((i) => (i.productId === productId ? { ...i, qty } : i))
    .filter((i) => i.qty > 0)
  setCart(userId, { ...cart, items })
}

export function removeFromCart(userId, productId) {
  const cart = getCart(userId)
  const items = cart.items.filter((i) => i.productId !== productId)
  setCart(userId, { ...cart, items })
}

export function clearCart(userId) {
  setCart(userId, { items: [] })
}

