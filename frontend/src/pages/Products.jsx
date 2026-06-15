import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { getProducts } from "../services/productService"
import ProductCard from "../components/ProductCard"
import Loading from "../components/Loading"

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sort, setSort] = useState("newest")

  const query = searchParams.get("q") || ""
  const category = searchParams.get("category") || ""

  useEffect(() => {
    let active = true
    setLoading(true)
    ;(async () => {
      try {
        const params = {}
        if (query) params.search = query
        if (category) params.category = category
        const data = await getProducts(params)
        const list = Array.isArray(data) ? data : data.products || []
        if (active) setProducts(list)
      } catch {
        if (active) setError("Could not load products. Is the backend running?")
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [query, category])

  // Unique categories for the filter dropdown.
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean))
    return [...set]
  }, [products])

  const sorted = useMemo(() => {
    const copy = [...products]
    if (sort === "price-asc") copy.sort((a, b) => a.price - b.price)
    else if (sort === "price-desc") copy.sort((a, b) => b.price - a.price)
    else if (sort === "name") copy.sort((a, b) => a.name.localeCompare(b.name))
    return copy
  }, [products, sort])

  const handleCategory = (e) => {
    const value = e.target.value
    const next = new URLSearchParams(searchParams)
    if (value) next.set("category", value)
    else next.delete("category")
    setSearchParams(next)
  }

  return (
    <section className="section">
      <div className="container">
        <div className="page-header">
          <h1>{query ? `Results for "${query}"` : "All Products"}</h1>
          <p>{sorted.length} product(s) found</p>
        </div>

        <div className="filters-bar">
          <select
            className="form-select"
            value={category}
            onChange={handleCategory}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
                <option value="storage boxes">Storage Boxes</option>
                <option value="accessories">Accessories</option>
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        {loading ? (
          <Loading message="Loading products..." />
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : sorted.length === 0 ? (
          <div className="empty-state">
            <h2>No products found</h2>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="product-grid">
            {sorted.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
