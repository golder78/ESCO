import { useState } from "react"

const EMPTY = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "",
}

export default function ProductForm({ initialValues, onSubmit, submitLabel = "Save", loading }) {
  const [form, setForm] = useState({ ...EMPTY, ...initialValues })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="form-group">
        <label className="form-label" htmlFor="name">
          Product Name
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
        <label className="form-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="form-textarea"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="price">
            Price ($)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            className="form-input"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="stock">
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            className="form-input"
            value={form.stock}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="category">
          Category
        </label>
        <input
          id="category"
          name="category"
          className="form-input"
          value={form.category}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="image">
          Image URL
        </label>
        <input
          id="image"
          name="image"
          className="form-input"
          value={form.image}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  )
}
