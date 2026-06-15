import api from "./api"

// GET /api/products  (supports optional query params: search, category, page)
export const getProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params })
  return data
}

// GET /api/products/:id
export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`)
  return data
}

// POST /api/products  (admin)
export const createProduct = async (productData) => {
  const { data } = await api.post("/products", productData)
  return data
}

// PUT /api/products/:id  (admin)
export const updateProduct = async (id, productData) => {
  const { data } = await api.put(`/products/${id}`, productData)
  return data
}

// DELETE /api/products/:id  (admin)
export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`)
  return data
}

const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}
export default productService
