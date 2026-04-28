import { id, nowIso, readJson, writeJson } from './storage.js'

const KEYS = {
  users: 'fsad.users',
  products: 'fsad.products',
  orders: 'fsad.orders',
  feedback: 'fsad.feedback',
}

function getArray(key) {
  return readJson(key, [])
}

function setArray(key, arr) {
  writeJson(key, arr)
}

export function listUsers() {
  return getArray(KEYS.users)
}

export function upsertUser(user) {
  const users = listUsers()
  const idx = users.findIndex((u) => u.id === user.id)
  const next = { ...user }
  if (idx === -1) setArray(KEYS.users, [...users, next])
  else {
    const copy = users.slice()
    copy[idx] = next
    setArray(KEYS.users, copy)
  }
  return next
}

export function findUserByEmail(email) {
  return listUsers().find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function getUser(userId) {
  return listUsers().find((u) => u.id === userId) || null
}

export function listProducts() {
  return getArray(KEYS.products)
}

export function getProduct(productId) {
  return listProducts().find((p) => p.id === productId) || null
}

export function upsertProduct(product) {
  const products = listProducts()
  const idx = products.findIndex((p) => p.id === product.id)
  const now = nowIso()
  const next = {
    ...product,
    updatedAt: now,
    createdAt: product.createdAt ?? now,
  }
  if (idx === -1) setArray(KEYS.products, [...products, next])
  else {
    const copy = products.slice()
    copy[idx] = next
    setArray(KEYS.products, copy)
  }
  return next
}

export function createProduct(input) {
  const now = nowIso()
  const product = {
    id: id(),
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    ...input,
  }
  const products = listProducts()
  setArray(KEYS.products, [...products, product])
  return product
}

export function listOrders() {
  return getArray(KEYS.orders)
}

export function createOrder(input) {
  const order = {
    id: id(),
    status: 'placed',
    createdAt: nowIso(),
    ...input,
  }
  const orders = listOrders()
  setArray(KEYS.orders, [...orders, order])
  return order
}

export function listFeedback() {
  return getArray(KEYS.feedback)
}

export function addFeedback(input) {
  const entry = {
    id: id(),
    createdAt: nowIso(),
    ...input,
  }
  const items = listFeedback()
  setArray(KEYS.feedback, [...items, entry])
  return entry
}

