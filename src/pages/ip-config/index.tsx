import { useEffect, useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import {
  createSelectionColumn,
  createSortableColumn,
  createActionsColumn,
  createIndexColumn,
} from "@/components/common/DataTableHelpers";
import { ColumnDef } from "@tanstack/react-table";
import { useIPConfigStore } from "@/stores/ip-config";
import type { AllowedIP } from "@/services/ip-config/typing";
import { AllowedIPForm } from "./components/AllowedIPForm";
import { IPConfigSettingsCard } from "./components/IPConfigSettingsCard";
import { CurrentIPCard } from "./components/CurrentIPCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Network, Settings, Globe } from "lucide-react";

const IPConfigPage = () => {
  const {
    allowedIPs,
    fetchAllowedIPs,
    addAllowedIP,
    editAllowedIP,
    removeAllowedIP,
    isLoadingIPs,
    fetchIPConfig,
    fetchCurrentIP,
    error,
  } = useIPConfigStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<AllowedIP | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllowedIPs();
    fetchIPConfig();
    fetchCurrentIP();
  }, []);

  const handleCreate = () => {
    setEditData(null);
    setDialogOpen(true);
  };

  const handleEdit = (ip: AllowedIP) => {
    setEditData(ip);
    setDialogOpen(true);
  };

  const handleDeleteClick = (ip: AllowedIP) => {
    setDeleteId(ip.id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await removeAllowedIP(deleteId);
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleSubmit = async (data: {
    ipAddress: string;
    type: "SINGLE" | "RANGE";
    description: string;
    isActive: boolean;
  }) => {
    if (editData) {
      await editAllowedIP(editData.id, data);
    } else {
      await addAllowedIP(data);
    }
    setDialogOpen(false);
  };


  const columns: ColumnDef<AllowedIP>[] = [
    createSelectionColumn<AllowedIP>(),
    createIndexColumn(),
    createSortableColumn("ipAddress", "Địa chỉ IP"),
    {
      accessorKey: "type",
      header: "Loại",
      cell: ({ row }) => (
        <Badge
          variant={row.original.type === "SINGLE" ? "default" : "secondary"}
        >
          {row.original.type === "SINGLE" ? "IP đơn" : "Dải IP (CIDR)"}
        </Badge>
      ),
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.description || "-"}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      cell: ({ row }) => (
        <Badge
          variant={row.original.isActive ? "default" : "destructive"}
        >
          {row.original.isActive ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("vi-VN"),
    },
    createActionsColumn({
      onEdit: handleEdit,
      onDelete: handleDeleteClick,
    }),
  ];

  if (isLoadingIPs && allowedIPs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 h-64">
        <div className="text-destructive">Lỗi: {error}</div>
        <Button onClick={() => fetchAllowedIPs()}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl">Quản lý cấu hình IP</h1>
      </div>

      <Tabs defaultValue="allowed-ips" className="space-y-4">
        <TabsList>
          <TabsTrigger value="allowed-ips" className="flex items-center gap-2">
            <Network className="w-4 h-4" />
            Danh sách IP được phép
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Cài đặt
          </TabsTrigger>
          <TabsTrigger value="current-ip" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            IP hiện tại
          </TabsTrigger>
        </TabsList>

        <TabsContent value="allowed-ips" className="space-y-4">
          <DataTable
            columns={columns}
            data={allowedIPs}
            isLoading={isLoadingIPs}
            searchKey="ipAddress"
            searchPlaceholder="Tìm kiếm theo địa chỉ IP..."
            onCreateClick={handleCreate}
          />
        </TabsContent>

        <TabsContent value="settings">
          <IPConfigSettingsCard />
        </TabsContent>

        <TabsContent value="current-ip">
          <CurrentIPCard />
        </TabsContent>
      </Tabs>

      <AllowedIPForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initialData={editData}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa IP này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default IPConfigPage;
