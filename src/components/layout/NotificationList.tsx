import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "info" | "warning" | "success";
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Điểm danh thành công",
    message: "Bạn đã điểm danh lớp Lập trình Web thành công",
    time: "5 phút trước",
    isRead: false,
    type: "success",
  },
  {
    id: 2,
    title: "Thông báo từ giảng viên",
    message: "Lớp Cơ sở dữ liệu chuyển sang phòng B203",
    time: "1 giờ trước",
    isRead: false,
    type: "warning",
  },
  {
    id: 3,
    title: "Lịch học mới",
    message: "Lịch học tuần sau đã được cập nhật",
    time: "2 giờ trước",
    isRead: true,
    type: "info",
  },
  {
    id: 4,
    title: "Nhắc nhở điểm danh",
    message: "Bạn chưa điểm danh lớp Mạng máy tính hôm nay",
    time: "3 giờ trước",
    isRead: true,
    type: "warning",
  },
  {
    id: 5,
    title: "Bài tập mới",
    message: "Giảng viên đã giao bài tập Lập trình Web",
    time: "1 ngày trước",
    isRead: true,
    type: "info",
  },
];

const NotificationList = () => {
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-green-500";
      case "warning":
        return "border-orange-500";
      case "info":
        return "border-blue-500";
      default:
        return "border-gray-500";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-2 rounded-full" size="icon">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="top-1 right-1 absolute flex justify-center items-center bg-red-500 rounded-full w-4 h-4 font-bold text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Thông báo</span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} mới
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {mockNotifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex-col items-start gap-1 p-3 cursor-pointer ${
                !notification.isRead ? "bg-muted/50" : ""
              }`}
            >
              <div className="flex justify-between items-start gap-2 w-full">
                <div className={`border-l-2 ${getTypeColor(notification.type)} pl-2 flex-1`}>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-semibold text-sm line-clamp-1">
                      {notification.title}
                    </h4>
                    {!notification.isRead && (
                      <span className="bg-blue-500 mt-1 rounded-full w-2 h-2 shrink-0" />
                    )}
                  </div>
                  <p className="mt-1 text-muted-foreground text-xs line-clamp-2">
                    {notification.message}
                  </p>
                  <span className="mt-1 text-[10px] text-muted-foreground">
                    {notification.time}
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-primary text-center cursor-pointer">
          Xem tất cả thông báo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationList;
