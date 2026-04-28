/**
 * API service layer — connects to Spring Boot backend.
 * Set VITE_API_URL=http://localhost:8080 in your .env file.
 */

const BASE = 'http://localhost:8080'

export const isBackendMode = Boolean(BASE)

async function request(method, path, body) {
  const url = `${BASE}${path}`
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body !== undefined) opts.body = JSON.stringify(body)

  let res
  try {
    res = await fetch(url, opts)
  } catch {
    throw new Error(
      'Could not reach the server. Make sure Spring Boot is running on ' + BASE,
    )
  }

  let data
  try {
    data = await res.json()
  } catch {
    data = {}
  }

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Server error ${res.status}`)
  }

  return data
}

// ---------- Auth ----------
export function apiRegister(payload) {
  return request('POST', '/api/auth/register', payload)
}
export function apiLogin(payload) {
  return request('POST', '/api/auth/login', payload)
}

// ---------- Products ----------
export function apiListProducts() {
  return request('GET', '/api/products')
}
export function apiListApprovedProducts() {
  return request('GET', '/api/products/approved')
}
export function apiGetProductsByFarmer(farmerId) {
  return request('GET', `/api/products/farmer/${farmerId}`)
}
export function apiCreateProduct(payload) {
  return request('POST', '/api/products', payload)
}
export function apiUpdateProduct(id, payload) {
  return request('PUT', `/api/products/${id}`, payload)
}
export function apiApproveProduct(id) {
  return request('PUT', `/api/products/${id}/approve`)
}
export function apiDeleteProduct(id) {
  return request('DELETE', `/api/products/${id}`)
}

// ---------- Orders ----------
export function apiListOrders() {
  return request('GET', '/api/orders')
}
export function apiGetOrdersByBuyer(buyerId) {
  return request('GET', `/api/orders/buyer/${buyerId}`)
}
export function apiCreateOrder(payload) {
  return request('POST', '/api/orders', payload)
}
export function apiUpdateOrderStatus(id, status) {
  return request('PUT', `/api/orders/${id}/status`, { status })
}

// ---------- Feedback ----------
export function apiListFeedback() {
  return request('GET', '/api/feedback')
}
export function apiGetFeedbackByProduct(productId) {
  return request('GET', `/api/feedback/product/${productId}`)
}
export function apiAddFeedback(payload) {
  return request('POST', '/api/feedback', payload)
}
