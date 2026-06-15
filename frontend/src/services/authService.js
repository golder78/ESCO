import api from "./api"

// POST /api/auth/register
export const register = async (userData) => {
  const { data } = await api.post("/auth/register", userData)
  return data
}

// POST /api/auth/login
export const login = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials)
  return data
}

// GET /api/auth/profile
export const getProfile = async () => {
  const { data } = await api.get("/auth/profile")
  return data
}

// PUT /api/users/profile (update current user)
export const updateProfile = async (userData) => {
  const { data } = await api.put("/users/profile", userData)
  return data
}

const authService = { register, login, getProfile, updateProfile }
export default authService
