import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getOrders } from "../services/orderService"
import Loading from "../components/Loading"

function statusClass(status = "") {
  return `badge badge-${status.toLowerCase()}`
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await getOrders()
        const list = Array.isArray(data) ? data : data.orders || []
        if (active) setOrders(list)
      } catch {
        if (active) setError("Could not load your orders.")
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  if (loading) return <Loading message="Loading your orders..." />

  return (
    <section className="section">
      <div className="container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>Track and review your past purchases.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {orders.length === 0 ? (
          <div className="empty-state">
            <h2>No orders yet</h2>
            <p>When you place an order, it will appear here.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id?.slice(-8)}</td>
                    <td>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{order.products?.length || 0}</td>
                    <td>${Number(order.totalAmount).toFixed(2)}</td>
                    <td>
                      <span className={statusClass(order.orderStatus || "pending")}>
                        {order.orderStatus || "pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
