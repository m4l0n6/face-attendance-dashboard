import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { generateRoutes } from "@/utils/routeGenerator"
import { menuItems } from "@/config/menu"
import LoginPage from "@/pages/auth/login"
import NotFoundPage from "@/pages/exception/404"

const ClassesDetailPage = React.lazy(() => import("@/pages/classes/classes-detail"))
const SchedulesDetailPage = React.lazy(() => import("@/pages/schedule"))

export function AdminRoutes() {
  const autoRoutes = generateRoutes(menuItems)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          {autoRoutes}
          <Route 
            path="classes/:classId" 
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <ClassesDetailPage />
              </React.Suspense>
            } 
          />
          <Route 
            path="schedules/:scheduleId" 
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <SchedulesDetailPage />
              </React.Suspense>
            } 
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}