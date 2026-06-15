import api from "./api"

// ---- Orders ----

// GET /api/orders  (current user's orders; admin sees all via /api/admin/orders)
export const getOrders = async () => {
  const { data } = await api.get("/orders")
  return data
}

// GET /api/orders/:id
export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`)
  return data
}

// POST /api/orders
export const createOrder = async (orderData) => {
  const { data } = await api.post("/orders", orderData)
  return data
}

// PUT /api/orders/:id  (update status - admin)
export const updateOrder = async (id, orderData) => {
  const { data } = await api.put(`/orders/${id}`, orderData)
  return data
}

const orderService = { getOrders, getOrderById, createOrder, updateOrder }
export default orderService
