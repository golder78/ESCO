import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"

const FALLBACK_IMG = "/placeholder.svg"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const handleAdd = (e) => {
    e.preventDefault()
    addToCart(product, 1)
  }

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <img
        className="product-card-img"
        src={product.image || FALLBACK_IMG}
        alt={product.name}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMG
        }}
      />
      <div className="product-card-body">
        {product.category && (
          <span className="product-card-category">{product.category}</span>
        )}
        <span className="product-card-name">{product.name}</span>
        <span className="product-card-price">${Number(product.price).toFixed(2)}</span>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleAdd}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </Link>
  )
}
