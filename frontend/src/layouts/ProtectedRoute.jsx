import { Navigate, Outlet, useLocation } from "react-router-dom"

export function ProtectedRoute() {
  const location = useLocation()
  const hasSession = localStorage.getItem("stockwise_session") === "active" || localStorage.getItem("stockwise_user")

  if (!hasSession) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
