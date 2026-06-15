import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getProductById } from "../services/productService"
import { useCart } from "../context/CartContext"
import Loading from "../components/Loading"

const FALLBACK_IMG = "/placeholder.svg"

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    ;(async () => {
      try {
        const data = await getProductById(id)
        if (active) setProduct(data.product || data)
      } catch {
        if (active) setError("Product not found.")
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [id])

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const buyNow = () => {
    addToCart(product, quantity)
    navigate("/cart")
  }

  if (loading) return <Loading message="Loading product..." />

  if (error || !product) {
    return (
      <div className="empty-state">
        <h2>{error || "Product not found"}</h2>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <div className="product-detail">
          <img
            className="product-detail-img"
            src={product.image || FALLBACK_IMG}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMG
            }}
          />
          <div>
            {product.category && (
              <span className="product-card-category">{product.category}</span>
            )}
            <h1>{product.name}</h1>
            <p className="price">${Number(product.price).toFixed(2)}</p>
            <p className="desc">{product.description}</p>

            <p style={{ marginBottom: "1rem", fontWeight: 600 }}>
              {product.stock > 0 ? (
                <span style={{ color: "var(--color-success)" }}>
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span style={{ color: "var(--color-danger)" }}>Out of Stock</span>
              )}
            </p>

            <div className="qty-row">
              <span className="form-label" style={{ margin: 0 }}>
                Quantity
              </span>
              <div className="qty-control">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {added && <div className="alert alert-success">Added to cart!</div>}

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>
              <button
                type="button"
                className="btn btn-accent"
                onClick={buyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
