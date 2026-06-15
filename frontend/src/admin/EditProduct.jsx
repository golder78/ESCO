import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminLayout from "./AdminLayout"
import ProductForm from "./Products"
import Loading from "../components/Loading"
import { getProductById, updateProduct } from "../services/productService"

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProductById(id)
        setProduct(data)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product")
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [id])

  const handleSubmit = async (values) => {
    setLoading(true)
    setError("")
    try {
      await updateProduct(id, values)
      navigate("/admin/products")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <AdminLayout><Loading /></AdminLayout>

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1 className="admin-title">Edit Product</h1>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="admin-card">
        {product && (
          <ProductForm
            initialValues={{
              name: product.name || "",
              description: product.description || "",
              price: product.price ?? "",
              category: product.category || "",
              image: product.image || "",
              stock: product.stock ?? "",
            }}
            onSubmit={handleSubmit}
            submitLabel="Update Product"
            loading={loading}
          />
        )}
      </div>
    </AdminLayout>
  )
}
