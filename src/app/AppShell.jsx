import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  LogIn,
  LogOut,
  ShoppingCart,
  Store,
  Shield,
  Sprout,
  UserPlus,
  ClipboardList,
} from 'lucide-react'
import { logout } from '../lib/auth.js'
import { useSessionUser } from './useSessionUser.js'
import { useCart } from './useCart.js'

function Icon({ children }) {
  return <span className="icon">{children}</span>
}

function TopLink({ to, icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}
    >
      <Icon>{icon}</Icon>
      <span>{children}</span>
    </NavLink>
  )
}

export function AppShell({ children }) {
  const user = useSessionUser()
  const cart = useCart()
  const navigate = useNavigate()

  return (
    <div className="app">
      <header className="topbar">
        <div className="container topbar__inner">
          <Link to="/" className="brand">
            <span className="brand__mark">FSAD</span>
            <span className="brand__name">Farm-to-Market</span>
          </Link>

          <nav className="nav">
            <TopLink to="/marketplace" icon={<Store size={16} />}>
              Marketplace
            </TopLink>

            <TopLink to="/cart" icon={<ShoppingCart size={16} />}>
              Cart
              {cart?.items?.length ? (
                <span className="pill">{cart.items.length}</span>
              ) : null}
            </TopLink>

            {user?.role === 'buyer' ? (
              <TopLink to="/buyer/orders" icon={<ClipboardList size={16} />}>
                Orders
              </TopLink>
            ) : null}

            {user?.role === 'farmer' ? (
              <TopLink to="/farmer" icon={<Sprout size={16} />}>
                Farmer
              </TopLink>
            ) : null}

            {user?.role === 'admin' ? (
              <TopLink to="/admin" icon={<Shield size={16} />}>
                Admin
              </TopLink>
            ) : null}
          </nav>

          <div className="account">
            {user ? (
              <>
                <div className="account__meta">
                  <div className="account__name">{user.name}</div>
                  <div className={`badge badge--${user.role}`}>{user.role}</div>
                </div>
                <button
                  className="btn btn--ghost"
                  onClick={() => {
                    logout()
                    navigate('/marketplace')
                  }}
                >
                  <Icon>
                    <LogOut size={16} />
                  </Icon>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn--ghost" to="/login">
                  <Icon>
                    <LogIn size={16} />
                  </Icon>
                  Login
                </Link>
                <Link className="btn" to="/register">
                  <Icon>
                    <UserPlus size={16} />
                  </Icon>
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">{children}</div>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <span>Value-added agricultural marketplace</span>
          <span className="muted">Demo app (localStorage)</span>
        </div>
      </footer>
    </div>
  )
}

