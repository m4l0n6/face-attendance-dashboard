import { useEffect, useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import {
  createSortableColumn,
  createActionsColumn,
  createDateColumn,
} from "@/components/common/DataTableHelpers";
import { ColumnDef } from "@tanstack/react-table";
import { useClassStore } from "@/stores/classes";
import type { Classes } from "@/services/classes/typing";
import { ClassFormDialog } from "@/components/classes/ClassFormDialog";
import { Button } from "@/components/ui/button";
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

const ClassesPage = () => {
  const { classes, fetchClasses, addClass, editClass, removeClass, isLoading } = useClassStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Classes | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []); // Empty dependency array

  const handleCreate = () => {
    setEditData(null);
    setDialogOpen(true);
  };

  const handleEdit = (classItem: Classes) => {
    setEditData(classItem);
    setDialogOpen(true);
  };

  const handleDeleteClick = (classItem: Classes) => {
    setDeleteId(classItem.id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await removeClass(deleteId);
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleSubmit = async (data: Partial<Classes>) => {
    if (editData) {
      await editClass(editData.id, data);
    } else {
      await addClass(data);
    }
    setDialogOpen(false);
  };

  const columns: ColumnDef<Classes>[] = [
    createSortableColumn("name", "Tên lớp"),
    createSortableColumn("code", "Mã lớp"),
    {
      accessorKey: "description",
      header: "Mô tả",
    },
    createDateColumn("createdAt", "Ngày tạo"),
    createActionsColumn({
      onEdit: handleEdit,
      onDelete: handleDeleteClick,
    }),
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý lớp học</h1>
        <Button onClick={handleCreate}>Thêm lớp học</Button>
      </div>

      <DataTable
        columns={columns}
        data={classes}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Tìm kiếm theo tên lớp..."
      />

      <ClassFormDialog
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
              Bạn có chắc chắn muốn xóa lớp học này? Hành động này không thể hoàn tác.
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

export default ClassesPage;