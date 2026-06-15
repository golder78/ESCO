import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getProducts } from "../services/productService"
import ProductCard from "../components/ProductCard"
import Loading from "../components/Loading"

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await getProducts({ limit: 8 })
        // Backend may return an array or { products: [...] }
        const list = Array.isArray(data) ? data : data.products || []
        if (active) setProducts(list.slice(0, 8))
      } catch {
        if (active) setError("Could not load products. Is the backend running?")
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="text-balance">Everything you need, all in one stash </h1>
          <p className="text-pretty">
            Discover thousands of quality products at prices you&apos;ll love. Fast shipping,
            easy returns, and friendly support.
          </p>
          <Link to="/products" className="btn btn-accent">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Featured Products</h2>
            <Link to="/products" className="btn btn-outline btn-sm">
              View All
            </Link>
          </div>

          {loading ? (
            <Loading message="Loading products..." />
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h2>No products yet</h2>
              <p>Check back soon for new arrivals.</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
