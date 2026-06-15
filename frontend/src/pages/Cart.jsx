import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import CartItem from "../components/CartItem"

export default function Cart() {
  const { items, totalPrice, totalItems, clearCart } = useCart()

  const shipping = totalPrice > 50 || totalPrice === 0 ? 0 : 5.99
  const grandTotal = totalPrice + shipping

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven&apos;t added anything yet.</p>
        <Link to="/products" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <div className="page-header">
          <h1>Shopping Cart</h1>
          <p>{totalItems} item(s) in your cart</p>
        </div>

        <div className="cart-layout">
          <div className="card">
            {items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
            <div style={{ padding: "1rem" }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>

          <div className="card cart-summary">
            <h2 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary btn-block">
              Proceed to Checkout
            </Link>
            <Link
              to="/products"
              className="btn btn-outline btn-block"
              style={{ marginTop: "0.75rem" }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
