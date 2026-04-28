import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { listProducts } from '../lib/db.js'
import { apiListProducts, isBackendMode } from '../lib/api.js'
import { useSessionUser } from '../app/useSessionUser.js'
import { ProductCard } from '../components/ProductCard.jsx'

const CATEGORIES = ['All', 'Processed Foods', 'Handmade Goods']

export function MarketplacePage() {
  const user = useSessionUser()
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('All')
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        if (isBackendMode) {
          const data = await apiListProducts()
          setAllProducts(data)
        } else {
          setAllProducts(listProducts())
        }
      } catch (err) {
        console.error('Failed to load products:', err)
        // fallback to localStorage
        setAllProducts(listProducts())
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const visible = allProducts.filter((p) => {
    if (p.status === 'approved') return true
    if (user?.role === 'farmer' && p.farmerId === String(user.id)) return true
    if (user?.role === 'admin') return true
    return false
  })

  const qq = q.trim().toLowerCase()
  const products = visible
    .filter((p) => (category === 'All' ? true : p.category === category))
    .filter((p) => {
      if (!qq) return true
      return (
        p.title.toLowerCase().includes(qq) ||
        (p.origin || '').toLowerCase().includes(qq) ||
        (p.category || '').toLowerCase().includes(qq)
      )
    })
    .sort((a, b) =>
      a.status === b.status ? 0 : a.status === 'approved' ? -1 : 1,
    )

  return (
    <div className="page">
      <div className="pageHead row row--between row--gap row--wrap">
        <div>
          <div className="h2">Marketplace</div>
          <div className="muted">
            Browse value-added products. Only approved listings are visible to
            buyers.
          </div>
        </div>
        {user?.role === 'farmer' ? (
          <Link className="btn" to="/farmer/products/new">
            Add product
          </Link>
        ) : null}
      </div>

      <div className="card card--soft">
        <div className="row row--gap row--wrap">
          <div className="field field--inline">
            <span className="icon">
              <Search size={16} />
            </span>
            <input
              className="input input--inline"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, origin, category…"
            />
          </div>

          <label className="field">
            <span className="field__label">Category</span>
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="card">
          <div className="muted">Loading products…</div>
        </div>
      ) : products.length ? (
        <div className="grid grid--3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="h3">No products found</div>
          <div className="muted">Try clearing filters or search.</div>
        </div>
      )}
    </div>
  )
}
