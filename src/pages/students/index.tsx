import { useEffect, useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import {
  createIndexColumn,
  createSortableColumn,
  createActionsColumn,
} from "@/components/common/DataTableHelpers";
import { ColumnDef } from "@tanstack/react-table";
import { useStudentStore } from "@/stores/students";
import type { Student } from "@/services/students/typing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useClassStore } from "@/stores/classes";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Load } from "@/components/load";
import "react-medium-image-zoom/dist/styles.css";

const StudentsPage = () => {
  const {
    students,
    pagination,
    fetchStudents,
    isLoading,
    selectedClassId,
    setSelectedClass,
    currentPage,
    setPage,
    setPageSize,
    setSearchQuery,
  } = useStudentStore();
  const { classes, fetchClasses } = useClassStore();
  const [localSearch, setLocalSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  const columns: ColumnDef<Student>[] = [
    createIndexColumn(),
    createSortableColumn("studentId", "Mã sinh viên"),
    createSortableColumn("name", "Tên sinh viên"),
    createSortableColumn("email", "Email"),
    {
      accessorKey: "class.name",
      header: "Lớp học",
      cell: ({ row }) => row.original.class?.name || "-",
    },
    {
      accessorKey: "faceImage",
      header: "Khuôn mặt",
      cell: ({ row }) => (
        <Badge variant={row.original.faceImage ? "default" : "secondary"}>
          {row.original.faceImage ? "Đã đăng ký" : "Chưa đăng ký"}
        </Badge>
      ),
    },
    createActionsColumn({
      onView: (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
      }
    })
  ];

  if (isLoading && students.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Load />
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
        </div>
      </div>

      <DataTable
        columns={columns}
        data={students}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Tìm kiếm theo tên sinh viên..."
        searchValue={localSearch}
        onSearchChange={setLocalSearch}
        pagination={
          pagination
            ? {
                currentPage: currentPage,
                totalPages: pagination.totalPages,
                totalItems: pagination.total,
                pageSize: pagination.limit,
                onPageChange: setPage,
                onPageSizeChange: setPageSize,
              }
            : undefined
        }
      />

      {/* Student Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thông tin sinh viên</DialogTitle>
            <DialogDescription>
              Chi tiết thông tin của sinh viên
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6 py-4">
              {/* Avatar */}
              <div className="flex justify-center items-center">
                {selectedStudent.faceImage ? (
                  <ImageZoom
                    backdropClassName={cn(
                      '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
                    )}
                  >
                    <img
                      src={selectedStudent.faceImage.imageUrl}
                      alt={selectedStudent.name}
                      className="rounded-full w-32 h-32 object-cover"
                    />
                  </ImageZoom>
                ) : (
                  <Avatar className="w-32 h-32">
                    <AvatarImage
                      src=""
                      alt={selectedStudent.name}
                    />
                    <AvatarFallback className="text-2xl">
                      {selectedStudent.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              {/* Student Info */}
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">
                    Mã sinh viên
                  </p>
                  <p className="font-semibold">{selectedStudent.studentId}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">
                    Họ tên
                  </p>
                  <p className="font-semibold">{selectedStudent.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">
                    Email
                  </p>
                  <p className="font-semibold">{selectedStudent.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">
                    Lớp học
                  </p>
                  <p className="font-semibold">
                    {selectedStudent.class?.name || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">
                    Mã lớp
                  </p>
                  <p className="font-semibold">
                    {selectedStudent.class?.code || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">
                    Trạng thái khuôn mặt
                  </p>
                  <Badge
                    variant={
                      selectedStudent.faceImage ? "default" : "secondary"
                    }
                  >
                    {selectedStudent.faceImage ? "Đã đăng ký" : "Chưa đăng ký"}
                  </Badge>
                </div>
              </div>

              {/* Lecturer Info */}
              {selectedStudent.class?.lecturer && (
                <div className="pt-4 border-t">
                  <p className="mb-3 font-semibold text-sm">Giảng viên</p>
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="font-medium text-muted-foreground text-sm">
                        Họ tên
                      </p>
                      <p className="font-semibold">
                        {selectedStudent.class.lecturer.displayName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-muted-foreground text-sm">
                        Email
                      </p>
                      <p className="font-semibold">
                        {selectedStudent.class.lecturer.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsPage;
