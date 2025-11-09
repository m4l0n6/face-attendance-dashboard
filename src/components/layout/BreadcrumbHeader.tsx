import type React from "react"
import { useLocation, Link } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { menuItems } from "@/config/menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BreadcrumbItem {
  label: string
  path: string
  icon?: React.ReactNode
}

export function BreadcrumbHeader() {
  const location = useLocation()
  const breadcrumbs = generateBreadcrumbs(location.pathname)

  return (
    <header className="flex items-center bg-background px-4 lg:px-6 border-border border-b h-14 shrink-0">
      <div className="flex items-center gap-3 h-full">
        <SidebarTrigger />
        <div
          data-orientation="vertical"
          className="bg-border w-[1px] h-4 shrink-0"
        ></div>

        <nav className="flex items-center text-sm">
          <ol className="flex items-center gap-1">
            <li>
              <Link
                to="/"
                className="flex items-center gap-1.5 px-2 rounded-md h-9 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="sr-only sm:not-sr-only sm:inline">Home</span>
              </Link>
            </li>

            {breadcrumbs.map((item, index) => (
              <li key={item.path} className="flex items-center gap-1">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                {index === breadcrumbs.length - 1 ? (
                  <span className="flex items-center gap-1.5 px-2 rounded-md h-9 font-medium text-foreground">
                    {item.icon}
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="flex items-center gap-1.5 px-2 rounded-md h-9 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.icon}
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-none h-full">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
              </Avatar>
              <p className="hidden md:block">Admin user</p>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-36" align="end" >
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem>
              <Link to="#" className="text-destructive">
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Split the pathname into segments
  const paths = pathname.split("/").filter(Boolean)
  if (paths.length === 0) return []

  const breadcrumbs: BreadcrumbItem[] = []
  let currentPath = ""
  
  // Lưu trữ đường dẫn đã xử lý để tránh lặp lại item
  const processedPaths = new Set<string>()

  paths.forEach((segment) => {
    currentPath += `/${segment}`
    
    // Bỏ qua nếu đường dẫn này đã được xử lý
    if (processedPaths.has(currentPath)) {
      return
    }
    
    // Đánh dấu đường dẫn đã được xử lý
    processedPaths.add(currentPath)

    // Find matching menu item
    const menuItem = findMenuItemByPath(currentPath)
    if (menuItem) {
      // Nếu đây là menu cha có children, thêm vào với đúng đường dẫn của nó
      // mà không tự động chuyển hướng đến submenu đầu tiên
      breadcrumbs.push({
        label: menuItem.label,
        path: menuItem.path,
        icon: menuItem.icon,
      })
    } else {
      // For paths not defined in the menu, create a formatted label.
      breadcrumbs.push({
        label: formatBreadcrumbLabel(segment),
        path: currentPath,
      })
    }
  })

  return breadcrumbs
}

function findMenuItemByPath(path: string) {
  // Search through the menu items for a matching path.
  return menuItems.find((item) => item.path === path)
}

function formatBreadcrumbLabel(segment: string): string {
  // Convert kebab-case or camelCase to Title Case with spaces.
  return segment
    .replace(/-/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}