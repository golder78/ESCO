import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Loading from "./Loading"

// Guards routes that require authentication. Pass `adminOnly` for admin routes.
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loading message="Checking your session..." />
  }

  if (!isAuthenticated) {
    // Redirect to login, remembering where the user wanted to go.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}
