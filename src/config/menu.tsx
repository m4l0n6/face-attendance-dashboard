import React from "react"
import { Home, User, Bell, Network, Users } from "lucide-react"

export type MenuItem = {
  label: string
  path: string
  icon: React.ReactNode

  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  { label: "Trang chủ", path: "/dashboard", icon: <Home size={16} /> },
  { label: "Lớp học", path: "/classes", icon: <Users size={16} /> },
  { label: "Sinh viên", path: "/students", icon: <User size={16} /> },
  { label: "Thông báo", path: "/notifications", icon: <Bell size={16} /> },
  { label: "Cấu hình IP", path: "/ip-config", icon: <Network size={16} /> },
];