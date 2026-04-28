import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../app/useCart.js'
import { useSessionUser } from '../app/useSessionUser.js'
import { clearCart } from '../lib/cart.js'
import { createOrder, getProduct, upsertProduct } from '../lib/db.js'
import { apiCreateOrder, apiUpdateProduct, isBackendMode } from '../lib/api.js'
import { money } from '../lib/format.js'

export function CheckoutPage() {
  const user = useSessionUser()
  const cart = useCart()
  const navigate = useNavigate()

  const lines = useMemo(() => {
    return cart.items
      .map((i) => {
        const product = getProduct(i.productId)
        return product ? { ...i, product } : null
      })
      .filter(Boolean)
  }, [cart.items])

  const totals = useMemo(() => {
    return lines.reduce(
      (acc, l) => {
        acc.currency = l.product.currency || acc.currency
        acc.subtotal += l.product.price * l.qty
        return acc
      },
      { subtotal: 0, currency: 'USD' },
    )
  }, [lines])

  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [upiId, setUpiId] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function placeOrder() {
    setError('')
    if (!user) { setError('Please login first.'); return }
    if (!lines.length) { setError('Your cart is empty.'); return }
    if (!address.trim()) { setError('Shipping address is required.'); return }
    if (paymentMethod === 'upi' && !upiId.trim()) {
      setError('Please enter your UPI ID.'); return
    }
    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g. name@upi).'); return
    }

    const stockIssues = lines.filter((l) => l.qty > l.product.stock)
    if (stockIssues.length) {
      setError('Some items exceed available stock. Please adjust quantities.')
      return
    }

    setBusy(true)
    try {
      const orderItems = lines.map((l) => ({
        productId: l.product.id,
        title: l.product.title,
        unitPrice: l.product.price,
        currency: l.product.currency,
        qty: l.qty,
        farmerId: l.product.farmerId,
      }))

      const paymentNote = paymentMethod === 'upi'
        ? `UPI (${upiId.trim()})`
        : 'Cash on Delivery'

      const orderPayload = {
        buyerId: String(user.id),
        items: JSON.stringify(orderItems),
        subtotal: totals.subtotal,
        currency: totals.currency,
        shippingAddress: address.trim(),
        notes: `Payment: ${paymentNote}${notes.trim() ? ' | ' + notes.trim() : ''}`,
        status: 'placed',
      }

      let order
      if (isBackendMode) {
        for (const l of lines) {
          await apiUpdateProduct(l.product.id, {
            ...l.product,
            stock: l.product.stock - l.qty,
            certifications: typeof l.product.certifications === 'object'
              ? JSON.stringify(l.product.certifications)
              : l.product.certifications,
            bullets: typeof l.product.bullets === 'object'
              ? JSON.stringify(l.product.bullets)
              : l.product.bullets,
          })
        }
        order = await apiCreateOrder(orderPayload)
      } else {
        for (const l of lines) {
          upsertProduct({ ...l.product, stock: l.product.stock - l.qty })
        }
        order = createOrder({
          buyerId: user.id,
          items: orderItems,
          subtotal: totals.subtotal,
          currency: totals.currency,
          shippingAddress: address.trim(),
          notes: orderPayload.notes,
        })
      }

      clearCart(user.id)
      navigate('/buyer/orders', { replace: true, state: { placed: order.id } })
    } catch (e) {
      setError(e?.message || 'Could not place order.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <div className="pageHead">
        <div className="h2">Checkout</div>
        <div className="muted">Confirm details and place your order.</div>
      </div>

      <div className="grid grid--2">
        <div className="stack">

          {/* Shipping */}
          <div className="card">
            <div className="h3">Shipping address</div>
            <div className="spacer" />
            <label className="field">
              <span className="field__label">Address</span>
              <textarea
                className="input"
                rows={5}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, City, State, Country, Postal code"
              />
            </label>
            <label className="field">
              <span className="field__label">Notes (optional)</span>
              <textarea
                className="input"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Preferred carrier, delivery window, etc."
              />
            </label>
          </div>

          {/* Payment Method */}
          <div className="card">
            <div className="h3">Payment method</div>
            <div className="spacer" />

            {/* COD */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '16px',
              border: `2px solid ${paymentMethod === 'cod' ? '#16a34a' : '#e5e7eb'}`,
              borderRadius: '8px', cursor: 'pointer', marginBottom: '12px',
              background: paymentMethod === 'cod' ? '#f0fdf4' : 'transparent',
            }}>
              <input
                type="radio" name="payment" value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                style={{ accentColor: '#16a34a', width: '18px', height: '18px' }}
              />
              <div>
                <div style={{ fontWeight: 600 }}>💵 Cash on Delivery</div>
                <div className="muted tiny">Pay when your order arrives</div>
              </div>
            </label>

            {/* UPI */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '16px',
              border: `2px solid ${paymentMethod === 'upi' ? '#16a34a' : '#e5e7eb'}`,
              borderRadius: '8px', cursor: 'pointer',
              background: paymentMethod === 'upi' ? '#f0fdf4' : 'transparent',
            }}>
              <input
                type="radio" name="payment" value="upi"
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
                style={{ accentColor: '#16a34a', width: '18px', height: '18px' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>📱 UPI Payment</div>
                <div className="muted tiny">Pay instantly using UPI</div>
              </div>
            </label>

            {/* UPI ID input */}
            {paymentMethod === 'upi' && (
              <div style={{ marginTop: '12px' }}>
                <label className="field">
                  <span className="field__label">UPI ID</span>
                  <input
                    className="input"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@okaxis / yourname@ybl"
                  />
                </label>
                <div className="muted tiny" style={{ marginTop: '4px' }}>
                  Examples: name@okhdfc, name@ybl, name@paytm
                </div>
              </div>
            )}
          </div>

          {error ? <div className="alert alert--error">{error}</div> : null}

          <button className="btn btn--wide" onClick={placeOrder} disabled={busy}>
            {busy ? 'Placing…' : `Place order · ${money(totals.subtotal, totals.currency)}`}
          </button>
        </div>

        {/* Order Summary */}
        <div className="card card--soft">
          <div className="h3">Order summary</div>
          <div className="spacer" />
          {lines.length ? (
            <div className="stack">
              {lines.map((l) => (
                <div key={l.productId} className="row row--between row--gap">
                  <div>
                    <div className="strong">{l.product.title}</div>
                    <div className="muted tiny">
                      {l.qty} × {money(l.product.price, l.product.currency)}
                    </div>
                  </div>
                  <div className="price">
                    {money(l.product.price * l.qty, l.product.currency)}
                  </div>
                </div>
              ))}
              <div className="divider" />
              <div className="row row--between">
                <span className="muted">Subtotal</span>
                <span className="price">{money(totals.subtotal, totals.currency)}</span>
              </div>
              <div className="row row--between">
                <span className="muted">Payment</span>
                <span className="muted">
                  {paymentMethod === 'upi'
                    ? `📱 UPI${upiId ? ` (${upiId})` : ''}`
                    : '💵 Cash on Delivery'}
                </span>
              </div>
            </div>
          ) : (
            <div className="muted">Your cart is empty.</div>
          )}
        </div>
      </div>
    </div>
  )
}
