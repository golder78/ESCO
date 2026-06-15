import { useEffect, useState } from "react"
import api from "../services/api"
import { getOrders, updateOrder } from "../services/orderService"
import AdminLayout from "./AdminLayout"
import Loading from "../components/Loading"

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"]

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      // Admin endpoint preferred; fall back to /orders.
      let data
      try {
        const res = await api.get("/admin/orders")
        data = res.data
      } catch {
        data = await getOrders()
      }
      const list = Array.isArray(data) ? data : data.orders || []
      setOrders(list)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleStatusChange = async (id, orderStatus) => {
    setUpdatingId(id)
    try {
      await updateOrder(id, { orderStatus })
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, orderStatus } : o)),
      )
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status")
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Orders</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Loading message="Loading orders..." />
      ) : orders.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)" }}>No orders found.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>#{o._id?.slice(-8)}</td>
                  <td>{o.user?.name || o.shippingAddress?.fullName || "—"}</td>
                  <td>{o.orderItems?.length ?? o.items?.length ?? 0}</td>
                  <td>${Number(o.totalAmount || 0).toFixed(2)}</td>
                  <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "-"}</td>
                  <td>
                    <select
                      className="form-input form-input-sm"
                      value={o.orderStatus || "pending"}
                      disabled={updatingId === o._id}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
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
