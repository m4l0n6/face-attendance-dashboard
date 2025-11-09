import React from "react"
import { useLocation, Link } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import { menuItems } from "@/config/menu"
import { LucideLayoutDashboard, ChevronRight } from "lucide-react"
import { useState } from "react"

export function AdminSidebar() {
  const location = useLocation()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const toggleSubmenu = (path: string) => {
    setOpenSubmenu((prev) => (prev === path ? null : path))
  }

  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="offcanvas"
      className="border-border border-r"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex justify-center items-center bg-primary rounded-md w-8 h-8 text-primary-foreground">
            <LucideLayoutDashboard className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Admin Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      {/* <SidebarSeparator /> */}
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => {
            if (item.children) {
              return (
                <SidebarMenuItem key={item.path}>
                  <div>
                    <SidebarMenuButton
                      onClick={() => toggleSubmenu(item.path)}
                      // Check if pathname starts with this item's path (to include children)
                      isActive={location.pathname.startsWith(item.path)}
                      tooltip={item.label}
                      className="flex justify-between items-center data-[active=true]:bg-accent/50 hover:bg-accent data-[active=true]:font-medium transition-colors hover:text-accent-foreground"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${openSubmenu === item.path ? "rotate-90" : ""}`}
                      />
                    </SidebarMenuButton>
                    {openSubmenu === item.path && (
                      <ul className="mt-1 pl-4 transition-all duration-200 ease-out">
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <SidebarMenuButton
                              asChild
                              isActive={location.pathname === child.path}
                              tooltip={child.label}
                              className="data-[active=true]:bg-accent/50 hover:bg-accent data-[active=true]:font-medium text-sm transition-colors hover:text-accent-foreground"
                            >
                              <Link to={child.path}>
                                {child.icon}
                                <span>{child.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </SidebarMenuItem>
              )
            }
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.path}
                  tooltip={item.label}
                  className="data-[active=true]:bg-accent/50 hover:bg-accent data-[active=true]:font-medium transition-colors hover:text-accent-foreground"
                >
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}