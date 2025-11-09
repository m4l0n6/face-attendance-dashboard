import React from "react"
import { Home, BarChart2, Settings, List, ChevronRight } from "lucide-react"

export type MenuItem = {
  label: string
  path: string
  icon: React.ReactNode

  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <Home size={16} /> },
  { label: "Analytics", path: "/analytics", icon: <BarChart2 size={16} /> },
  { label: "Lmao", path: "/lmao", icon: <List size={16} /> },
  { label: "Settings", path: "/settings", icon: <Settings size={16} /> },
  {
    label: "Menu1",
    path: "/menu1",
    icon: <List size={16} />,
    children: [
      { label: "Submenu1", path: "/menu1/submenu1", icon: <ChevronRight size={16} /> },
      { label: "Submenu2", path: "/menu1/submenu2", icon: <ChevronRight size={16} /> },
    ],
  },
]