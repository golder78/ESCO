import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <h3>EscoProject</h3>
          <p style={{ fontSize: "0.9rem", maxWidth: "260px" }}>
            Quality products at honest prices, delivered fast to your door.
          </p>
        </div>
        <div>
          <h3>Shop</h3>
          <ul>
            <li>
              <Link to="/products">All Products</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/orders">My Orders</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3>Company</h3>
          <ul>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/login">Account</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} EscoProject. All rights reserved.
      </div>
    </footer>
  )
}
