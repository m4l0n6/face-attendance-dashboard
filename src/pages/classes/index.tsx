import { DataTable } from "@/components/common/DataTable";
import {
  createSortableColumn,
  createActionsColumn,
  createDateColumn,
} from "@/components/common/DataTableHelpers";
import { ColumnDef } from "@tanstack/react-table";
import { useClassStore } from "@/stores/classes";
import type { Classes } from "@/services/classes/typing";

const sampleClasses: Classes[] = [
  {
    id: "class-1",
    name: "Lập trình Web",
    code: "IT4409",
    description: "Môn học về phát triển ứng dụng web với HTML, CSS, JavaScript",
    lecturerId: "lecturer-1",
    _count: {
      students: 45,
      sessions: 12
    },
    createdAt: "2024-01-15T10:30:00.000Z"
  },
  {
    id: "class-2",
    name: "Cơ sở dữ liệu",
    code: "IT3090",
    description: "Thiết kế và quản lý cơ sở dữ liệu quan hệ",
    lecturerId: "lecturer-2",
    _count: {
      students: 38,
      sessions: 15
    },
    createdAt: "2024-02-20T09:15:00.000Z"
  },
  {
    id: "class-3",
    name: "Mạng máy tính",
    code: "IT4062",
    description: "Các giao thức mạng và kiến trúc mạng máy tính",
    lecturerId: "lecturer-1",
    _count: {
      students: 42,
      sessions: 10
    },
    createdAt: "2024-03-10T14:20:00.000Z"
  },
  {
    id: "class-4",
    name: "Trí tuệ nhân tạo",
    code: "IT4853",
    description: "Các thuật toán và ứng dụng của trí tuệ nhân tạo",
    lecturerId: "lecturer-3",
    _count: {
      students: 35,
      sessions: 8
    },
    createdAt: "2024-08-28T11:45:00.000Z"
  },
  {
    id: "class-5",
    name: "Phát triển ứng dụng di động",
    code: "IT4788",
    description: "Lập trình ứng dụng mobile cho Android và iOS",
    lecturerId: "lecturer-2",
    _count: {
      students: 28,
      sessions: 6
    },
    createdAt: "2024-06-12T16:30:00.000Z"
  },
];

const ClassesPage = () => {
  const classData = useClassStore((state) => state.classes);
  console.log("Classes Data:", classData);
  const columns: ColumnDef<Classes>[] = [
    createSortableColumn("name", "Tên lớp", {
      size: 200,
      className: "font-medium",
    }),
    createSortableColumn("code", "Mã lớp", {
      size: 120,
      className: "font-mono text-sm",
    }),
    createSortableColumn("description", "Mô tả", {
      size: 300,
      className: "text-muted-foreground text-sm",
    }),
    {
      accessorKey: "_count.students",
      header: "Số sinh viên",
      size: 120,
      cell: ({ row }) => (
        <div className="font-medium text-center">
          {row.original._count.students}
        </div>
      ),
    },
    {
      accessorKey: "_count.sessions",
      header: "Số buổi học",
      size: 120,
      cell: ({ row }) => (
        <div className="font-medium text-center">
          {row.original._count.sessions}
        </div>
      ),
    },
    createDateColumn("createdAt", "Ngày tạo", { size: 120 }),
    createActionsColumn<Classes>(
      {
        onView: (classItem) => console.log("View class:", classItem),
        onEdit: (classItem) => console.log("Edit class:", classItem),
        onDelete: (classItem) => console.log("Delete class:", classItem),
      },
      { size: 80 }
    ),
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-3xl tracking-tight">Tổng quan Lớp học</h2>
        <p className="text-muted-foreground">Danh sách lớp học</p>
      </div>
      <DataTable
        columns={columns}
        data={sampleClasses}
        searchKey="name"
        searchPlaceholder="Tìm kiếm lớp học..."
        onRowClick={(row) => console.log("Row clicked:", row.original)}
      />
    </div>
  );
};

export default ClassesPage;
