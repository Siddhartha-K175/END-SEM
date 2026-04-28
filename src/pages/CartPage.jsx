import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../app/useCart.js'
import { useSessionUser } from '../app/useSessionUser.js'
import { clearCart, removeFromCart, updateQty } from '../lib/cart.js'
import { apiListProducts, isBackendMode } from '../lib/api.js'
import { listProducts } from '../lib/db.js'
import { money } from '../lib/format.js'

export function CartPage() {
  const user = useSessionUser()
  const cart = useCart()
  const navigate = useNavigate()
  const [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    async function load() {
      try {
        if (isBackendMode) {
          const data = await apiListProducts()
          setAllProducts(data)
        } else {
          setAllProducts(listProducts())
        }
      } catch {
        setAllProducts(listProducts())
      }
    }
    load()
  }, [])

  const lines = cart.items
    .map((i) => {
      const product = allProducts.find((p) => String(p.id) === String(i.productId))
      return product ? { ...i, product } : null
    })
    .filter(Boolean)

  const totals = lines.reduce(
    (acc, l) => {
      acc.currency = l.product.currency || acc.currency
      acc.subtotal += l.product.price * l.qty
      return acc
    },
    { subtotal: 0, currency: 'USD' },
  )

  return (
    <div className="page">
      <div className="pageHead row row--between row--gap row--wrap">
        <div>
          <div className="h2">Cart</div>
          <div className="muted">
            Add items from the marketplace, then checkout as a buyer.
          </div>
        </div>
        {cart.items.length ? (
          <button className="btn btn--ghost" onClick={() => clearCart(user?.id)}>
            <Trash2 size={16} /> Clear
          </button>
        ) : null}
      </div>

      {allProducts.length === 0 && cart.items.length > 0 ? (
        <div className="card">
          <div className="muted">Loading cart items…</div>
        </div>
      ) : lines.length ? (
        <div className="grid grid--2">
          <div className="stack">
            {lines.map((l) => (
              <div key={l.productId} className="card">
                <div className="row row--between row--gap row--wrap">
                  <div>
                    <Link className="h3" to={`/product/${l.product.id}`}>
                      {l.product.title}
                    </Link>
                    <div className="muted tiny">
                      {money(l.product.price, l.product.currency)} per{' '}
                      {l.product.unit} · stock {l.product.stock}
                    </div>
                  </div>
                  <div className="row row--gap">
                    <button
                      className="btn btn--ghost"
                      onClick={() => updateQty(user?.id, l.productId, Math.max(0, l.qty - 1))}
                    >
                      <Minus size={16} />
                    </button>
                    <div className="qty">{l.qty}</div>
                    <button
                      className="btn btn--ghost"
                      onClick={() => updateQty(user?.id, l.productId, Math.min(l.product.stock, l.qty + 1))}
                      disabled={l.qty >= l.product.stock}
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      className="btn btn--ghost"
                      onClick={() => removeFromCart(user?.id, l.productId)}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card card--soft">
            <div className="h3">Summary</div>
            <div className="spacer" />
            <div className="row row--between">
              <span className="muted">Subtotal</span>
              <span className="price">{money(totals.subtotal, totals.currency)}</span>
            </div>
            <div className="spacer" />
            {user?.role === 'buyer' ? (
              <button className="btn btn--wide" onClick={() => navigate('/checkout')}>
                Proceed to checkout
              </button>
            ) : (
              <div className="stack">
                <div className="alert">Checkout requires a buyer account.</div>
                <Link className="btn btn--wide" to="/login">Login as buyer</Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="h3">Your cart is empty</div>
          <div className="muted">Go to the marketplace to add products.</div>
          <div className="spacer" />
          <Link className="btn" to="/marketplace">Browse marketplace</Link>
        </div>
      )}
    </div>
  )
}
