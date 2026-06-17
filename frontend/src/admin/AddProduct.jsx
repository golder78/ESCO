import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "./AdminLayout"
import ProductForm from "./Productform"
import { createProduct } from "../services/productService"

export default function AddProduct() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (values) => {
    setLoading(true)
    setError("")
    try {
      await createProduct(values)
      navigate("/admin/products")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1 className="admin-title">Add Product</h1>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="admin-card">
        <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" loading={loading} />
      </div>
    </AdminLayout>
  )
}
