import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="page">
      <div className="card">
        <div className="h2">Page not found</div>
        <div className="muted">The requested page does not exist.</div>
        <div className="spacer" />
        <div className="row row--gap row--wrap">
          <Link className="btn" to="/marketplace">
            Marketplace
          </Link>
          <Link className="btn btn--ghost" to="/">
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
