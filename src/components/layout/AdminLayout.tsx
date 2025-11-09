import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "./Sidebar"
import { BreadcrumbHeader } from "./BreadcrumbHeader"

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen overflow-hidden">
        <AdminSidebar />
        <div className="relative flex-1 min-w-0">
          <BreadcrumbHeader />
          <div className="top-14 absolute inset-0 overflow-auto">
            <main className="p-4 md:p-6 w-full">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

