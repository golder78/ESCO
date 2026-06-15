import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { updateProfile } from "../services/authService"

export default function Profile() {
  const { user, updateUser, logout } = useAuth()

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)
    try {
      const payload = { name: form.name, email: form.email }
      if (form.password) payload.password = form.password
      const updated = await updateProfile(payload)
      updateUser(updated.user || updated)
      setMessage("Profile updated successfully.")
      setForm({ ...form, password: "" })
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "640px" }}>
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Manage your account details.</p>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="card" style={{ padding: "1.5rem" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              className="form-input"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              New Password (leave blank to keep current)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" className="btn btn-outline" onClick={logout}>
              Logout
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
