import { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { humanDate, money } from '../lib/format.js'

function Stat({ label, value }) {
  return (
    <div className="card card--soft">
      <div className="muted tiny">{label}</div>
      <div className="h2">{value}</div>
    </div>
  )
}

export function AdminDashboardPage() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadData() {
    try {
      const [pRes, oRes] = await Promise.all([
        fetch('http://localhost:8080/api/products'),
        fetch('http://localhost:8080/api/orders'),
      ])
      const p = await pRes.json()
      const o = await oRes.json()
      setProducts(p)
      setOrders(o)
    } catch (err) {
      console.error('Failed to load admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const pendingProducts = products.filter((p) => p.status === 'pending')
  const approvedProducts = products.filter((p) => p.status === 'approved')

  async function approve(p) {
    try {
      await fetch(`http://localhost:8080/api/products/${p.id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      })
      loadData()
    } catch (err) {
      console.error('Failed to approve product:', err)
    }
  }

  return (
    <div className="page">
      <div className="pageHead">
        <div className="h2">Admin dashboard</div>
        <div className="muted">
          Approve listings, view users, and monitor orders.
        </div>
      </div>

      {loading ? (
        <div className="card"><div className="muted">Loading dashboard…</div></div>
      ) : (
        <>
          <div className="grid grid--4">
            <Stat label="Products approved" value={approvedProducts.length} />
            <Stat label="Pending approval" value={pendingProducts.length} />
            <Stat label="Orders" value={orders.length} />
          </div>

          <div className="grid grid--2">
            <div className="card">
              <div className="row row--between row--gap">
                <div className="h3">Pending products</div>
                <span className="badge badge--neutral">{pendingProducts.length}</span>
              </div>
              <div className="spacer" />
              {pendingProducts.length ? (
                <div className="stack">
                  {pendingProducts.map((p) => (
                    <div key={p.id} className="card card--soft">
                      <div className="row row--between row--gap row--wrap">
                        <div>
                          <div className="strong">{p.title}</div>
                          <div className="muted tiny">
                            {p.category} · {p.origin} · {money(p.price, p.currency)} / {p.unit}
                          </div>
                        </div>
                        <button className="btn" onClick={() => approve(p)}>
                          <CheckCircle2 size={16} /> Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="muted">Nothing waiting for approval.</div>
              )}
            </div>

            <div className="card">
              <div className="row row--between row--gap">
                <div className="h3">Recent orders</div>
                <span className="badge badge--neutral">{orders.length}</span>
              </div>
              <div className="spacer" />
              {orders.length ? (
                <div className="stack">
                  {orders
                    .slice()
                    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
                    .slice(0, 8)
                    .map((o) => (
                      <div key={o.id} className="card card--soft">
                        <div className="row row--between row--gap row--wrap">
                          <div>
                            <div className="strong">Order {o.id.substring(0, 8)}...</div>
                            <div className="muted tiny">{humanDate(o.createdAt)}</div>
                          </div>
                          <div className="row row--gap">
                            <span className="badge badge--neutral">{o.status}</span>
                            <span className="badge badge--neutral">
                              {money(o.subtotal, o.currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="muted">No orders yet.</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
