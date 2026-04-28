import { Link } from 'react-router-dom'
import { listOrders, listProducts } from '../lib/db.js'
import { useSessionUser } from '../app/useSessionUser.js'
import { humanDate, money } from '../lib/format.js'

function Stat({ label, value }) {
  return (
    <div className="card card--soft">
      <div className="muted tiny">{label}</div>
      <div className="h2">{value}</div>
    </div>
  )
}

export function FarmerDashboardPage() {
  const user = useSessionUser()
  const products = listProducts().filter((p) => p.farmerId === user?.id)

  const orders = listOrders()
    .map((o) => {
      const items = o.items.filter((it) => it.farmerId === user?.id)
      if (!items.length) return null
      const subtotal = items.reduce((s, it) => s + it.unitPrice * it.qty, 0)
      return { ...o, items, farmerSubtotal: subtotal, farmerCurrency: o.currency }
    })
    .filter(Boolean)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  const pending = products.filter((p) => p.status === 'pending').length
  const approved = products.filter((p) => p.status === 'approved').length
  const stock = products.reduce((s, p) => s + (Number(p.stock) || 0), 0)

  return (
    <div className="page">
      <div className="pageHead row row--between row--gap row--wrap">
        <div>
          <div className="h2">Farmer dashboard</div>
          <div className="muted">Manage listings, inventory, and orders.</div>
        </div>
        <Link className="btn" to="/farmer/products/new">
          Add product
        </Link>
      </div>

      <div className="grid grid--3">
        <Stat label="Approved products" value={approved} />
        <Stat label="Pending approval" value={pending} />
        <Stat label="Total stock units" value={stock} />
      </div>

      <div className="grid grid--2">
        <div className="card">
          <div className="row row--between row--gap">
            <div className="h3">Your products</div>
            <span className="badge badge--neutral">{products.length}</span>
          </div>
          <div className="spacer" />

          {products.length ? (
            <div className="stack">
              {products
                .slice()
                .sort((a, b) =>
                  a.status === b.status ? 0 : a.status === 'pending' ? -1 : 1,
                )
                .map((p) => (
                  <div key={p.id} className="card card--soft">
                    <div className="row row--between row--gap row--wrap">
                      <div>
                        <div className="strong">{p.title}</div>
                        <div className="muted tiny">
                          {p.category} · stock {p.stock} ·{' '}
                          {money(p.price, p.currency)} / {p.unit}
                        </div>
                      </div>
                      <div className="row row--gap">
                        <span className="badge badge--neutral">{p.status}</span>
                        <Link className="btn btn--ghost" to={`/farmer/products/${p.id}`}>
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="muted">
              No products yet. Create one and submit for approval.
            </div>
          )}
        </div>

        <div className="card">
          <div className="row row--between row--gap">
            <div className="h3">Orders containing your items</div>
            <span className="badge badge--neutral">{orders.length}</span>
          </div>
          <div className="spacer" />

          {orders.length ? (
            <div className="stack">
              {orders.slice(0, 8).map((o) => (
                <div key={o.id} className="card card--soft">
                  <div className="row row--between row--gap row--wrap">
                    <div>
                      <div className="strong">Order {o.id}</div>
                      <div className="muted tiny">{humanDate(o.createdAt)}</div>
                    </div>
                    <div className="row row--gap">
                      <span className="badge badge--neutral">{o.status}</span>
                      <span className="badge badge--neutral">
                        {money(o.farmerSubtotal, o.farmerCurrency)}
                      </span>
                    </div>
                  </div>
                  <div className="spacer" />
                  <ul className="list">
                    {o.items.map((it) => (
                      <li key={it.productId} className="muted">
                        {it.title} × {it.qty}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="muted">No orders yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

