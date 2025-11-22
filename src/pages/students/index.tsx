import { useEffect, useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import {
  createSortableColumn,
} from "@/components/common/DataTableHelpers";
import { ColumnDef } from "@tanstack/react-table";
import { useStudentStore } from "@/stores/students";
import type { Student } from "@/services/students/typing";
import { ImportStudentsDialog } from "@/components/students/ImportStudentsDialog";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClassStore } from "@/stores/classes";
import { toast } from "sonner";

const StudentsPage = () => {
  const {
    students,
    fetchStudents,
    importStudents,
    isLoading,
    selectedClassId,
    setSelectedClass,
  } = useStudentStore();
  const { classes, fetchClasses } = useClassStore();
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchClasses();
        await fetchStudents();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []); // Empty dependency array - only run once on mount

  const handleImport = async (classId: string, data: Student[]) => {
    await importStudents(classId, data);
    setImportDialogOpen(false);
  };

  const handleExportCSV = () => {
    if (students.length === 0) {
      toast.error("Không có dữ liệu để xuất");
      return;
    }

    // Create CSV content
    const headers = ["Mã sinh viên", "Tên", "Email", "Lớp học"];
    const csvContent = [
      headers.join(","),
      ...students.map((student) =>
        [
          student.studentId,
          student.name,
          student.email,
          student.className || ""
        ].join(",")
      ),
    ].join("\n");

    // Create blob and download
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `students_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Xuất CSV thành công");
  };

  const columns: ColumnDef<Student>[] = [
    createSortableColumn("studentId", "Mã sinh viên"),
    createSortableColumn("name", "Tên sinh viên"),
    createSortableColumn("email", "Email"),
    {
      accessorKey: "className",
      header: "Lớp học",
    },
  ];

  if (isLoading && students.length === 0) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="mx-auto border-gray-900 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl">Quản lý sinh viên</h1>
        <div className="flex gap-2">
          <Select
            value={selectedClassId || "all"}
            onValueChange={(value) =>
              setSelectedClass(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tất cả lớp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả lớp</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 w-4 h-4" />
            Xuất CSV
          </Button>
          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            <Upload className="mr-2 w-4 h-4" />
            Import CSV
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={students}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Tìm kiếm theo tên sinh viên..."
      />

      <ImportStudentsDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onSubmit={handleImport}
      />
    </div>
  );
};

export default StudentsPage;
