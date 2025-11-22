import { SidebarTrigger } from "@/components/ui/sidebar"
import AvatarDropMenu from "./AvatarDropMenu"
import NotificationList from "./NotificationList"

export function BreadcrumbHeader() {

  return (
    <header className="flex items-center bg-background px-4 lg:px-6 border-border border-b h-14 shrink-0">
      <div className="flex items-center gap-3 h-full">
        <SidebarTrigger />

      </div>

      <div className="flex items-center gap-4 ml-auto">
        <NotificationList />
        <AvatarDropMenu />
      </div>
    </header>
  );
}