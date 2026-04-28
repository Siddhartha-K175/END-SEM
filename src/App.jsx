import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import { AppShell } from './app/AppShell.jsx'
import { RequireAuth } from './app/RequireAuth.jsx'
import { RequireRole } from './app/RequireRole.jsx'
import { seedIfNeeded } from './lib/seed.js'

import { LandingPage } from './pages/LandingPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { MarketplacePage } from './pages/MarketplacePage.jsx'
import { ProductPage } from './pages/ProductPage.jsx'
import { CartPage } from './pages/CartPage.jsx'
import { CheckoutPage } from './pages/CheckoutPage.jsx'
import { BuyerOrdersPage } from './pages/BuyerOrdersPage.jsx'
import { FarmerDashboardPage } from './pages/FarmerDashboardPage.jsx'
import { FarmerProductEditorPage } from './pages/FarmerProductEditorPage.jsx'
import { AdminDashboardPage } from './pages/AdminDashboardPage.jsx'
import { NotFoundPage } from './pages/NotFoundPage.jsx'

export default function App() {
  useEffect(() => {
    seedIfNeeded()
  }, [])

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />

        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <RequireRole allow={['buyer']}>
                <CheckoutPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/buyer/orders"
          element={
            <RequireAuth>
              <RequireRole allow={['buyer']}>
                <BuyerOrdersPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/farmer"
          element={
            <RequireAuth>
              <RequireRole allow={['farmer']}>
                <FarmerDashboardPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/farmer/products/new"
          element={
            <RequireAuth>
              <RequireRole allow={['farmer']}>
                <FarmerProductEditorPage mode="create" />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/farmer/products/:productId"
          element={
            <RequireAuth>
              <RequireRole allow={['farmer']}>
                <FarmerProductEditorPage mode="edit" />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <RequireRole allow={['admin']}>
                <AdminDashboardPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AppShell>
  )
}
