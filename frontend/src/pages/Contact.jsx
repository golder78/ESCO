import { useState } from "react"

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // No backend endpoint defined for contact; show a confirmation locally.
    setSent(true)
    setForm({ name: "", email: "", message: "" })
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "640px" }}>
        <div className="page-header">
          <h1>Contact Us</h1>
          <p>Have a question? Send us a message and we&apos;ll get back to you.</p>
        </div>

        {sent && (
          <div className="alert alert-success">
            Thanks for reaching out! We&apos;ll reply soon.
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ padding: "1.5rem" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
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
            <label className="form-label" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className="form-textarea"
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </section>
  )
}
