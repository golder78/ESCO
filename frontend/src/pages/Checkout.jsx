import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { createOrder } from "../services/orderService"

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: user?.name || "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    paymentMethod: "cod",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const shipping = totalPrice > 50 ? 0 : 5.99
  const grandTotal = totalPrice + shipping

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (items.length === 0) {
      setError("Your cart is empty.")
      return
    }

    setLoading(true)
    try {
      const orderData = {
        products: items.map((i) => ({
          product: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        totalAmount: grandTotal,
        shippingAddress: {
          fullName: form.fullName,
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
      }
      const order = await createOrder(orderData)
      clearCart()
      navigate("/orders", { state: { justOrdered: order?._id || true } })
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="page-header">
          <h1>Checkout</h1>
          <p>Enter your shipping details to complete your order.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="checkout-layout">
          <div className="card" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>Shipping Address</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                className="form-input"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="street">
                Street Address
              </label>
              <input
                id="street"
                name="street"
                className="form-input"
                value={form.street}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  className="form-input"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="state">
                  State / Province
                </label>
                <input
                  id="state"
                  name="state"
                  className="form-input"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="zip">
                  ZIP / Postal Code
                </label>
                <input
                  id="zip"
                  name="zip"
                  className="form-input"
                  value={form.zip}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="country">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  className="form-input"
                  value={form.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="paymentMethod">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                className="form-select"
                value={form.paymentMethod}
                onChange={handleChange}
              >
                <option value="cod">Cash on Delivery</option>
                <option value="card">Credit / Debit Card</option>
              </select>
            </div>
          </div>

          <div className="card cart-summary">
            <h2 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>Order Summary</h2>
            {items.map((item) => (
              <div className="summary-row" key={item._id}>
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
