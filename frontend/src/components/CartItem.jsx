import { useCart } from "../context/CartContext"

const FALLBACK_IMG = "/placeholder.svg"

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div className="cart-item">
      <img
        className="cart-item-img"
        src={item.image || FALLBACK_IMG}
        alt={item.name}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMG
        }}
      />
      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <p className="cart-item-price">${Number(item.price).toFixed(2)}</p>
        <div className="qty-control" style={{ marginTop: "0.5rem", width: "fit-content" }}>
          <button
            type="button"
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            type="button"
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ fontWeight: 700 }}>
          ${(Number(item.price) * item.quantity).toFixed(2)}
        </p>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          style={{ marginTop: "0.5rem" }}
          onClick={() => removeFromCart(item._id)}
        >
          Remove
        </button>
      </div>
    </div>
  )
}
