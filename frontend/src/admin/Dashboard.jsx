import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import { getProducts } from "../services/productService"
import { getOrders } from "../services/orderService"
import AdminLayout from "./AdminLayout"
import Loading from "../components/Loading"

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        // Prefer a dedicated stats endpoint; fall back to computing from lists.
        let statData = null
        try {
          const { data } = await api.get("/admin/stats")
          statData = data
        } catch {
          // ignore - fall back below
        }

        const [productsRes, ordersRes] = await Promise.allSettled([
          getProducts(),
          getOrders(),
        ])

        const products =
          productsRes.status === "fulfilled"
            ? Array.isArray(productsRes.value)
              ? productsRes.value
              : productsRes.value.products || []
            : []
        const orders =
          ordersRes.status === "fulfilled"
            ? Array.isArray(ordersRes.value)
              ? ordersRes.value
              : ordersRes.value.orders || []
            : []

        const revenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)

        if (active) {
          setStats({
            products: statData?.products ?? products.length,
            orders: statData?.orders ?? orders.length,
            users: statData?.users ?? 0,
            revenue: statData?.revenue ?? revenue,
          })
          setRecentOrders(orders.slice(0, 5))
        }
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Dashboard</h1>
      </div>

      {loading ? (
        <Loading message="Loading dashboard..." />
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <p className="label">Total Revenue</p>
              <p className="value">${stats.revenue.toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <p className="label">Orders</p>
              <p className="value">{stats.orders}</p>
            </div>
            <div className="stat-card">
              <p className="label">Products</p>
              <p className="value">{stats.products}</p>
            </div>
            <div className="stat-card">
              <p className="label">Customers</p>
              <p className="value">{stats.users}</p>
            </div>
          </div>

          <div className="admin-header">
            <h1 style={{ fontSize: "1.15rem" }}>Recent Orders</h1>
            <Link to="/admin/orders" className="btn btn-outline btn-sm">
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)" }}>No orders yet.</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o._id}>
                      <td>#{o._id?.slice(-8)}</td>
                      <td>${Number(o.totalAmount).toFixed(2)}</td>
                      <td>
                        <span className={`badge badge-${(o.orderStatus || "pending").toLowerCase()}`}>
                          {o.orderStatus || "pending"}
                        </span>
                      </td>
                      <td>
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  )
}
