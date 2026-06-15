import { useEffect, useState } from "react"
import api from "../services/api"
import AdminLayout from "./AdminLayout"
import Loading from "../components/Loading"

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get("/admin/users")
      setUsers(Array.isArray(data) ? data : data.users || [])
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers((prev) => prev.filter((u) => u._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user")
    }
  }

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Users</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Loading message="Loading users..." />
      ) : users.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)" }}>No users found.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge badge-${u.role === "admin" ? "shipped" : "pending"}`}>
                      {u.role || "user"}
                    </span>
                  </td>
                  <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(u._id)}
                      disabled={u.role === "admin"}
                    >
                      Delete
                    </button>
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
