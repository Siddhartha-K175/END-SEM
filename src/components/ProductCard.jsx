import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { money } from '../lib/format.js'
import { addToCart } from '../lib/cart.js'
import { useSessionUser } from '../app/useSessionUser.js'

export function ProductCard({ product }) {
  const user = useSessionUser()
  const price = money(product.price, product.currency)

  return (
    <div className="card productCard">
      <div className="row row--between row--gap">
        <div>
          <Link className="productCard__title" to={`/product/${product.id}`}>
            {product.title}
          </Link>
          <div className="muted tiny">
            {product.category} · {product.origin}
          </div>
        </div>
        <div className="right">
          <div className="price">{price}</div>
          <div className="muted tiny">per {product.unit}</div>
        </div>
      </div>

      <div className="spacer" />

      <div className="muted">{product.short || product.description}</div>

      <div className="spacer" />

      <div className="row row--between row--gap">
        <div className="row row--gap row--wrap">
          <span className="badge badge--neutral">{product.status}</span>
          <span className="badge badge--neutral">stock {product.stock}</span>
        </div>
        <button
          className="btn btn--ghost"
          onClick={() => addToCart(user?.id, product.id, 1)}
          disabled={product.stock <= 0}
        >
          <Plus size={16} /> Add
        </button>
      </div>
    </div>
  )
}

