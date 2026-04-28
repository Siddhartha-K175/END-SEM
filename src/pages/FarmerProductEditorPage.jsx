import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useSessionUser } from '../app/useSessionUser.js'
import { createProduct, getProduct, upsertProduct } from '../lib/db.js'
import { apiCreateProduct, apiUpdateProduct, isBackendMode } from '../lib/api.js'
import { generateProductCopy } from '../lib/ai.js'

const CATEGORIES = ['Processed Foods', 'Handmade Goods']

function toArrayFromCsv(text) {
  return String(text || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function FarmerProductEditorPage({ mode }) {
  const { productId } = useParams()
  const user = useSessionUser()
  const navigate = useNavigate()

  const existing = useMemo(() => {
    if (mode !== 'edit') return null
    return getProduct(productId)
  }, [mode, productId])

  const lockedOut = mode === 'edit' && existing && existing.farmerId !== String(user?.id)

  const [title, setTitle] = useState(existing?.title || '')
  const [category, setCategory] = useState(existing?.category || CATEGORIES[0])
  const [origin, setOrigin] = useState(existing?.origin || '')
  const [price, setPrice] = useState(existing?.price ?? 0)
  const [currency, setCurrency] = useState(existing?.currency || 'USD')
  const [unit, setUnit] = useState(existing?.unit || 'unit')
  const [stock, setStock] = useState(existing?.stock ?? 0)
  const [image, setImage] = useState(existing?.image || '')
  const [process, setProcess] = useState(existing?.process || '')
  const [shelfLife, setShelfLife] = useState(existing?.shelfLife || '')
  const [certifications, setCertifications] = useState(
    (existing?.certifications || []).join(', '),
  )
  const [targetBuyer, setTargetBuyer] = useState(existing?.targetBuyer || '')
  const [short, setShort] = useState(existing?.short || '')
  const [description, setDescription] = useState(existing?.description || '')
  const [bulletsText, setBulletsText] = useState(
    Array.isArray(existing?.bullets) ? existing.bullets.join('\n') : '',
  )
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  if (lockedOut) {
    return (
      <div className="card">
        <div className="h2">Not allowed</div>
        <div className="muted">You can only edit your own products.</div>
        <div className="spacer" />
        <Link className="btn btn--ghost" to="/farmer">
          Back
        </Link>
      </div>
    )
  }

  function generate() {
    const copy = generateProductCopy({
      title: title.trim() || 'Your product',
      category,
      origin: origin.trim(),
      process: process.trim(),
      shelfLife: shelfLife.trim(),
      certifications,
      targetBuyer: targetBuyer.trim(),
    })
    setShort(copy.short)
    setDescription(copy.long)
    setBulletsText(copy.bullets.join('\n'))
    setInfo('AI copy generated. Review and edit before saving.')
  }

  async function save() {
    setError('')
    setInfo('')
    if (!title.trim()) return setError('Title is required.')
    if (!origin.trim()) return setError('Origin is required.')
    const p = Number(price)
    const s = Number(stock)
    if (!Number.isFinite(p) || p <= 0) return setError('Price must be > 0.')
    if (!Number.isFinite(s) || s < 0) return setError('Stock must be 0 or more.')

    const payload = {
      farmerId: String(user.id),
      title: title.trim(),
      category,
      origin: origin.trim(),
      price: p,
      currency,
      unit: unit.trim() || 'unit',
      stock: s,
      image: image.trim(),
      process: process.trim(),
      shelfLife: shelfLife.trim(),
      certifications: JSON.stringify(toArrayFromCsv(certifications)),
      targetBuyer: targetBuyer.trim(),
      shortDesc: short.trim(),
      description: description.trim(),
      bullets: JSON.stringify(
        bulletsText.split('\n').map((x) => x.trim()).filter(Boolean)
      ),
      status: 'pending',
    }

    setBusy(true)
    try {
      if (isBackendMode) {
        if (mode === 'edit' && existing) {
          await apiUpdateProduct(existing.id, payload)
          setInfo('Saved. Listing is now pending approval.')
        } else {
          const created = await apiCreateProduct(payload)
          navigate(`/farmer/products/${created.id}`, { replace: true })
        }
      } else {
        // localStorage fallback
        if (mode === 'edit' && existing) {
          upsertProduct({ ...existing, ...payload })
          setInfo('Saved. Listing is now pending approval.')
        } else {
          const created = createProduct(payload)
          navigate(`/farmer/products/${created.id}`, { replace: true })
        }
      }
    } catch (e) {
      setError(e?.message || 'Could not save product.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <div className="pageHead row row--between row--gap row--wrap">
        <div>
          <div className="h2">
            {mode === 'edit' ? 'Edit product' : 'Create new product'}
          </div>
          <div className="muted">
            Save submits the listing for admin approval.
          </div>
        </div>
        <div className="row row--gap">
          <Link className="btn btn--ghost" to="/farmer">
            Back
          </Link>
          {existing ? (
            <Link className="btn btn--ghost" to={`/product/${existing.id}`}>
              Preview
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid grid--2">
        <div className="card">
          <div className="row row--between row--gap">
            <div className="h3">Details</div>
            <button className="btn btn--ghost" type="button" onClick={generate}>
              <Sparkles size={16} /> AI description
            </button>
          </div>
          <div className="spacer" />

          <div className="grid grid--2">
            <label className="field">
              <span className="field__label">Title</span>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Spiced Mango Pickle" />
            </label>
            <label className="field">
              <span className="field__label">Category</span>
              <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="field">
              <span className="field__label">Origin</span>
              <input className="input" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="State, Country" />
            </label>
            <label className="field">
              <span className="field__label">Unit</span>
              <input className="input" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="jar / pack / kg / piece" />
            </label>
            <label className="field">
              <span className="field__label">Price</span>
              <input className="input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" />
            </label>
            <label className="field">
              <span className="field__label">Currency</span>
              <select className="input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
              </select>
            </label>
            <label className="field">
              <span className="field__label">Stock</span>
              <input className="input" type="number" value={stock} onChange={(e) => setStock(e.target.value)} min="0" step="1" />
            </label>
            <label className="field">
              <span className="field__label">Shelf life (optional)</span>
              <input className="input" value={shelfLife} onChange={(e) => setShelfLife(e.target.value)} placeholder="e.g., 6 months" />
            </label>
            <label className="field">
              <span className="field__label">Process (optional)</span>
              <input className="input" value={process} onChange={(e) => setProcess(e.target.value)} placeholder="e.g., sun-cured, cold-pressed" />
            </label>
            <label className="field">
              <span className="field__label">Certifications (optional)</span>
              <input className="input" value={certifications} onChange={(e) => setCertifications(e.target.value)} placeholder="comma-separated" />
            </label>
            <label className="field">
              <span className="field__label">Target buyer (optional)</span>
              <input className="input" value={targetBuyer} onChange={(e) => setTargetBuyer(e.target.value)} placeholder="distributors, specialty stores…" />
            </label>
            <label className="field">
              <span className="field__label">Product image URL</span>
              <input className="input" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.jpg" />
            </label>
          </div>

          <div className="spacer" />
          <label className="field">
            <span className="field__label">Short summary</span>
            <input className="input" value={short} onChange={(e) => setShort(e.target.value)} placeholder="1-line summary for cards" />
          </label>
          <label className="field">
            <span className="field__label">Description</span>
            <textarea className="input" rows={8} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed product description" />
          </label>
          <label className="field">
            <span className="field__label">Bullet points (optional)</span>
            <textarea className="input" rows={6} value={bulletsText} onChange={(e) => setBulletsText(e.target.value)} placeholder="one per line" />
          </label>

          {error ? <div className="alert alert--error">{error}</div> : null}
          {info ? <div className="alert">{info}</div> : null}

          <button className="btn btn--wide" type="button" onClick={save} disabled={busy}>
            {busy ? 'Saving…' : 'Save & submit for approval'}
          </button>
        </div>

        <div className="card card--soft">
          <div className="h3">Preview</div>
          <div className="spacer" />
          {image && (
            <img src={image} alt="Product preview" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px', display: 'block' }} onError={(e) => { e.target.style.display = 'none' }} />
          )}
          <div className="kicker">{category}</div>
          <div className="h2">{title || 'Product title'}</div>
          <div className="muted">{origin || 'Origin'}</div>
          <div className="spacer" />
          <div className="muted">{short || 'Short summary will appear here.'}</div>
          <div className="spacer" />
          <div className="prose">{description || 'Detailed description…'}</div>
          {bulletsText.trim() ? (
            <>
              <div className="spacer" />
              <ul className="list">
                {bulletsText.split('\n').map((x) => x.trim()).filter(Boolean).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
