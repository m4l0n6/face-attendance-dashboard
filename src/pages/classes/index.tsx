import { useEffect, useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import {
  createSelectionColumn,
  createSortableColumn,
  createActionsColumn,
  createDateColumn,
} from "@/components/common/DataTableHelpers";
import { ColumnDef } from "@tanstack/react-table";
import { useClassStore } from "@/stores/classes";
import type { Classes } from "@/services/classes/typing";
import { ClassForm } from "./components/form";
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
  }, []);

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

  const handleSubmit = async (data: { name: string; code: string; description: string }) => {
    if (editData) {
      await editClass(editData.id, data);
    } else {
      await addClass(data);
    }
    setDialogOpen(false);
  };

  const columns: ColumnDef<Classes>[] = [
    createSelectionColumn<Classes>(),
    createSortableColumn("code", "Mã lớp"),
    createSortableColumn("name", "Tên lớp"),
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
        <h1 className="font-bold text-3xl">Quản lý lớp học</h1>
      </div>

      <DataTable
        columns={columns}
        data={classes}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Tìm kiếm theo tên lớp..."
        onCreateClick={handleCreate}
      />

      <ClassForm
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