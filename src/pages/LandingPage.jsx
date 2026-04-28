import { Link } from 'react-router-dom'
import { ArrowRight, Globe, ShieldCheck, Sparkles, Sprout } from 'lucide-react'

function Feature({ icon, title, children }) {
  return (
    <div className="card card--soft">
      <div className="row row--gap">
        <span className="featureIcon">{icon}</span>
        <div>
          <div className="h3">{title}</div>
          <div className="muted">{children}</div>
        </div>
      </div>
    </div>
  )
}

function RoleCard({ role, title, desc, to }) {
  return (
    <div className="card">
      <div className="row row--between">
        <div>
          <div className="h3">{title}</div>
          <div className="muted">{desc}</div>
        </div>
        <div className={`badge badge--${role}`}>{role}</div>
      </div>
      <div className="spacer" />
      <Link className="btn btn--wide" to={to}>
        Get started <ArrowRight size={16} />
      </Link>
    </div>
  )
}

export function LandingPage() {
  return (
    <div className="stack">
      <section className="hero">
        <div className="hero__content">
          <h1 className="h1">
            Value-added agricultural products, from farmers to global buyers.
          </h1>
          <p className="lead">
            A demo marketplace where farmers list processed foods & handmade
            goods, buyers place orders, and admins approve listings. Includes an
            AI copy helper for product descriptions.
          </p>
          <div className="row row--gap">
            <Link className="btn" to="/marketplace">
              Explore marketplace <ArrowRight size={16} />
            </Link>
            <Link className="btn btn--ghost" to="/login">
              Login
            </Link>
          </div>
          <div className="muted tiny">
            Demo accounts: admin@fsad.local / admin123 · farmer@fsad.local /
            farmer123 · buyer@fsad.local / buyer123
          </div>
        </div>
        <div className="hero__grid">
          <Feature icon={<Globe size={18} />} title="Global discovery">
            Buyers browse approved products with clear pricing & origin.
          </Feature>
          <Feature icon={<Sprout size={18} />} title="Farmer tools">
            Manage products, inventory, and incoming orders.
          </Feature>
          <Feature icon={<ShieldCheck size={18} />} title="Admin control">
            Approve listings, view users, and monitor transactions.
          </Feature>
          <Feature icon={<Sparkles size={18} />} title="AI copy helper">
            Generate short + detailed descriptions for listings.
          </Feature>
        </div>
      </section>

      <section className="grid grid--3">
        <RoleCard
          role="admin"
          title="Admin"
          desc="Manage accounts, approve products, oversee orders."
          to="/login"
        />
        <RoleCard
          role="farmer"
          title="Farmer"
          desc="List products, track inventory, respond to buyers."
          to="/register"
        />
        <RoleCard
          role="buyer"
          title="Buyer"
          desc="Browse listings, place orders, and leave feedback."
          to="/marketplace"
        />
      </section>
    </div>
  )
}

