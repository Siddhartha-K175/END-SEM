import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MessageSquarePlus, Plus } from 'lucide-react'
import { getProduct, getUser, listFeedback } from '../lib/db.js'
import {
  apiGetFeedbackByProduct,
  apiAddFeedback,
  apiListProducts,
  isBackendMode,
} from '../lib/api.js'
import { money, humanDate } from '../lib/format.js'
import { addToCart } from '../lib/cart.js'
import { useSessionUser } from '../app/useSessionUser.js'

export function ProductPage() {
  const { productId } = useParams()
  const user = useSessionUser()

  const [product, setProduct] = useState(null)
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => {
    async function load() {
      try {
        if (isBackendMode) {
          // Fetch product from backend
          const products = await apiListProducts()
          const found = products.find((p) => String(p.id) === String(productId))
          setProduct(found || null)
          // Fetch feedback
          const fb = await apiGetFeedbackByProduct(productId)
          setFeedback(fb.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)))
        } else {
          setProduct(getProduct(productId))
          setFeedback(
            listFeedback()
              .filter((f) => f.productId === productId)
              .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
          )
        }
      } catch (err) {
        console.error('Failed to load product:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [productId])

  async function submitFeedback(e) {
    e.preventDefault()
    setInfo('')
    if (!user || user.role !== 'buyer') {
      setInfo('Please login as a buyer to leave feedback.')
      return
    }
    try {
      if (isBackendMode) {
        const saved = await apiAddFeedback({
          productId: String(productId),
          buyerId: String(user.id),
          message: text.trim(),
        })
        setFeedback((prev) => [saved, ...prev])
      } else {
        const { addFeedback } = await import('../lib/db.js')
        const saved = addFeedback({
          productId,
          buyerId: user.id,
          rating: Number(rating),
          text: text.trim(),
        })
        setFeedback((prev) => [saved, ...prev])
      }
      setText('')
      setRating(5)
      setInfo('Thanks! Your feedback was added.')
    } catch (err) {
      setInfo(err?.message || 'Could not submit feedback.')
    }
  }

  if (loading) {
    return <div className="card"><div className="muted">Loading product…</div></div>
  }

  if (!product) {
    return (
      <div className="card">
        <div className="h2">Product not found</div>
        <div className="muted">It may have been removed.</div>
        <div className="spacer" />
        <Link className="btn btn--ghost" to="/marketplace">Back to marketplace</Link>
      </div>
    )
  }

  const farmer = getUser(product.farmerId)
  const price = money(product.price, product.currency)

  // Parse bullets/certifications if they come as JSON strings from backend
  const bullets = typeof product.bullets === 'string'
    ? (() => { try { return JSON.parse(product.bullets) } catch { return [] } })()
    : (product.bullets || [])

  return (
    <div className="page">
      <div className="row row--between row--gap row--wrap">
        <div>
          <div className="kicker">{product.category}</div>
          <div className="h1">{product.title}</div>
          <div className="muted">
            {product.origin} · Sold by {farmer?.name || 'Farmer'}
          </div>
        </div>
        <div className="card card--soft right">
          <div className="price price--big">{price}</div>
          <div className="muted tiny">per {product.unit}</div>
          <div className="spacer" />
          <button
            className="btn"
            onClick={() => addToCart(user?.id, product.id, 1)}
            disabled={product.stock <= 0}
          >
            <Plus size={16} /> Add to cart
          </button>
          <div className="muted tiny">Stock: {product.stock}</div>
        </div>
      </div>

      {product.image && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <img src={product.image} alt={product.title} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px', display: 'block' }} />
        </div>
      )}

      <div className="grid grid--2">
        <div className="card">
          <div className="h3">About</div>
          <div className="spacer" />
          <div className="prose">{product.description || product.shortDesc}</div>
          {bullets.length ? (
            <>
              <div className="spacer" />
              <ul className="list">
                {bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </>
          ) : null}
        </div>

        <div className="stack">
          <div className="card">
            <div className="row row--between row--gap">
              <div className="h3">Buyer feedback</div>
              <span className="badge badge--neutral">{feedback.length}</span>
            </div>
            <div className="spacer" />
            {feedback.length ? (
              <div className="stack">
                {feedback.slice(0, 6).map((f) => {
                  const buyer = getUser(f.buyerId)
                  return (
                    <div key={f.id} className="card card--soft">
                      <div className="row row--between row--gap">
                        <div className="row row--gap">
                          <span className="badge badge--buyer">buyer</span>
                          <div className="muted tiny">
                            {buyer?.name || 'Buyer'} · {humanDate(f.createdAt)}
                          </div>
                        </div>
                        {f.rating ? (
                          <div className="badge badge--neutral">{f.rating}/5</div>
                        ) : null}
                      </div>
                      {(f.text || f.message) ? <div className="spacer" /> : null}
                      {(f.text || f.message) ? <div>{f.text || f.message}</div> : null}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="muted">No feedback yet.</div>
            )}
          </div>

          <div className="card">
            <div className="row row--gap">
              <MessageSquarePlus size={18} />
              <div>
                <div className="h3">Leave feedback</div>
                <div className="muted tiny">You must be logged in as a buyer.</div>
              </div>
            </div>
            <div className="spacer" />
            <form className="stack" onSubmit={submitFeedback}>
              {!isBackendMode && (
                <label className="field">
                  <span className="field__label">Rating</span>
                  <select className="input" value={rating} onChange={(e) => setRating(e.target.value)}>
                    {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </label>
              )}
              <label className="field">
                <span className="field__label">Comment</span>
                <textarea className="input" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="What did you like? What can be improved?" />
              </label>
              {info ? <div className="alert">{info}</div> : null}
              <button className="btn btn--ghost">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
