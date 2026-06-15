import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getProducts, deleteProduct } from "../services/productService"
import AdminLayout from "./AdminLayout"
import Loading from "../components/Loading"

const FALLBACK_IMG = "/placeholder.svg"

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      const data = await getProducts()
      const list = Array.isArray(data) ? data : data.products || []
      setProducts(list)
    } catch {
      setError("Could not load products.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch {
      setError("Could not delete product.")
    }
  }

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Products</h1>
        <Link to="/admin/products/add" className="btn btn-primary btn-sm">
          + Add Product
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Loading message="Loading products..." />
      ) : products.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)" }}>No products yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      className="table-thumb"
                      src={p.image || FALLBACK_IMG}
                      alt={p.name}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMG
                      }}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category || "-"}</td>
                  <td>${Number(p.price).toFixed(2)}</td>
                  <td>{p.stock ?? 0}</td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/admin/products/edit/${p._id}`}
                        className="btn btn-outline btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
