import React from "react"
import { Home, User2, User } from "lucide-react"

export type MenuItem = {
  label: string
  path: string
  icon: React.ReactNode

  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  { label: "Trang chủ", path: "/dashboard", icon: <Home size={16} /> },
  { label: "Lớp học", path: "/classes", icon: <User2 size={16} /> },
  { label: "Sinh viên", path: "/student", icon: <User size={16} /> },
];