import { Routes, Route } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import ProtectedRoute from "../components/ProtectedRoute.jsx"

// Public pages
import Home from "../pages/Home.jsx"
import Products from "../pages/Products.jsx"
import ProductDetails from "../pages/ProductDetails.jsx"
import Login from "../pages/Login.jsx"
import Register from "../pages/Register.jsx"
import Contact from "../pages/Contact.jsx"
import NotFound from "../pages/NotFound.jsx"

// Customer pages
import Cart from "../pages/Cart.jsx"
import Checkout from "../pages/Checkout.jsx"
import Profile from "../pages/Profile.jsx"
import Orders from "../pages/Orders.jsx"

// Admin pages
import AdminDashboard from "../admin/Dashboard.jsx"
import AdminProducts from "../admin/Products.jsx"
import AddProduct from "../admin/AddProduct.jsx"
import EditProduct from "../admin/EditProduct.jsx"
import AdminOrders from "../admin/Orders.jsx"
import AdminUsers from "../admin/Users.jsx"

export default function AppRoutes() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/search" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />

          {/* Customer (auth required) */}
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Admin (admin role required) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute adminOnly>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/add"
            element={
              <ProtectedRoute adminOnly>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <ProtectedRoute adminOnly>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminOnly>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
