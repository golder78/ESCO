import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import SearchBar from "./SearchBar"

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
            EscoProject 
        </Link>

        <nav className="navbar-links" aria-label="Primary">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/contact">Contact</Link>
          {isAdmin && <Link to="/admin">Admin</Link>}
        </nav>

        <div className="navbar-search">
          <SearchBar />
        </div>

        <div className="navbar-spacer" />

        <div className="navbar-actions">
          <Link to="/cart" className="cart-badge" aria-label="Shopping cart">
            Cart
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="btn btn-outline btn-sm">
                {user?.name?.split(" ")[0] || "Account"}
              </Link>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
