import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { listOrders } from '../lib/db.js'
import { apiGetOrdersByBuyer, isBackendMode } from '../lib/api.js'
import { useSessionUser } from '../app/useSessionUser.js'
import { humanDate, money } from '../lib/format.js'

export function BuyerOrdersPage() {
  const user = useSessionUser()
  const location = useLocation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        if (isBackendMode && user?.id) {
          const data = await apiGetOrdersByBuyer(user.id)
          const sorted = data.sort((a, b) =>
            (a.createdAt < b.createdAt ? 1 : -1)
          )
          setOrders(sorted)
        } else {
          const data = listOrders()
            .filter((o) => o.buyerId === user?.id)
            .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
          setOrders(data)
        }
      } catch (err) {
        console.error('Failed to load orders:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.id])

  // Parse items from JSON string if coming from backend
  function getItems(order) {
    if (typeof order.items === 'string') {
      try { return JSON.parse(order.items) } catch { return [] }
    }
    return order.items || []
  }

  return (
    <div className="page">
      <div className="pageHead row row--between row--gap row--wrap">
        <div>
          <div className="h2">Your orders</div>
          <div className="muted">Track what you've purchased from farmers.</div>
        </div>
        <Link className="btn btn--ghost" to="/marketplace">
          Continue shopping
        </Link>
      </div>

      {location.state?.placed ? (
        <div className="alert">Order placed: {location.state.placed}</div>
      ) : null}

      {loading ? (
        <div className="card"><div className="muted">Loading orders…</div></div>
      ) : orders.length ? (
        <div className="stack">
          {orders.map((o) => (
            <div key={o.id} className="card">
              <div className="row row--between row--gap row--wrap">
                <div>
                  <div className="h3">Order {o.id}</div>
                  <div className="muted tiny">{humanDate(o.createdAt)}</div>
                </div>
                <div className="row row--gap">
                  <span className="badge badge--neutral">{o.status}</span>
                  <span className="badge badge--neutral">
                    {money(o.subtotal, o.currency)}
                  </span>
                </div>
              </div>
              <div className="spacer" />
              <div className="stack">
                {getItems(o).map((it) => (
                  <div key={it.productId} className="row row--between row--gap">
                    <div className="muted">
                      {it.title} <span className="muted tiny">× {it.qty}</span>
                    </div>
                    <div className="muted">
                      {money(it.unitPrice * it.qty, it.currency)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="h3">No orders yet</div>
          <div className="muted">Add products to your cart and checkout.</div>
          <div className="spacer" />
          <Link className="btn" to="/marketplace">
            Browse marketplace
          </Link>
        </div>
      )}
    </div>
  )
}
