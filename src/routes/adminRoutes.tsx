import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { generateRoutes } from "@/utils/routeGenerator"
import { menuItems } from "@/config/menu"
import LoginPage from "@/pages/auth/login"

export function AdminRoutes() {
  const autoRoutes = generateRoutes(menuItems)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          {autoRoutes}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}