import { useEffect, useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import {
  createIndexColumn,
  createDateColumn, 
} from "@/components/common/DataTableHelpers";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import type { Notification } from "@/services/notification/typing";
import { Load } from "@/components/load";
import { NotificationForm } from "./component/form";

const NotificationPage = () => {
  const token = useAuthStore((state) => state.token);
  const { notifications, isLoading, fetchNotifications } = useNotificationStore();
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (token) {
      fetchNotifications(token, false);
    }
  }, [token, fetchNotifications]);

  const handleCreateSuccess = () => {
    if (token) {
      fetchNotifications(token, false);
    }
  };


  const columns: ColumnDef<Notification>[] = [
    createIndexColumn(),
    {
      accessorKey: "title",
      header: "Tiêu đề",
    },
    {
      accessorKey: "message",
      header: "Nội dung",
    },
    {
      accessorKey: "type",
      header: "Loại",
      cell: ({ row }) => {
        const type = row.original.type;
        const variant =
          type === "success"
            ? "default"
            : type === "warning"
            ? "destructive"
            : "secondary";
        return <Badge variant={variant}>{type}</Badge>;
      },
    },
    {
      accessorKey: "isRead",
      header: "Trạng thái",
      cell: ({ row }) => {
        const isRead = row.original.isRead;
        return (
          <Badge variant={isRead ? "outline" : "default"}>
            {isRead ? "Đã đọc" : "Chưa đọc"}
          </Badge>
        );
      },
    },
    createDateColumn("createdAt", "Ngày tạo"),
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Load />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 font-bold text-2xl">Thông báo</h1>
      <DataTable
        columns={columns}
        data={notifications}
        searchKey="title"
        searchPlaceholder="Tìm kiếm thông báo..."
        onCreateClick={() => setShowCreateForm(true)}
        showCreateButton={true}
      />
      <NotificationForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default NotificationPage;
