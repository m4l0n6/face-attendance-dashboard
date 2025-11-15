
import { DataTable } from "@/components/common/DataTable";
import {
  createSortableColumn,
  createActionsColumn,
  createStatusColumn,
  createDateColumn,
} from "@/components/common/DataTableHelpers";
import { ColumnDef } from "@tanstack/react-table";
import type { Student } from "@/services/students/typing";

const sampleStudents: Student[] = [
  {
    id: "student-1",
    studentId: "20210001",
    name: "Nguyễn Văn An",
    email: "an.nv@student.hust.edu.vn",
    phone: "0987654321",
    classId: "class-1",
    className: "Lập trình Web",
    status: "active",
    enrolledAt: "2024-01-15T09:00:00.000Z",
    lastAttendance: "2024-11-14T14:30:00.000Z",
    attendanceRate: 95.5
  },
  {
    id: "student-2",
    studentId: "20210002",
    name: "Trần Thị Bình",
    email: "binh.tt@student.hust.edu.vn",
    phone: "0976543210",
    classId: "class-1",
    className: "Lập trình Web",
    status: "active",
    enrolledAt: "2024-01-15T09:00:00.000Z",
    lastAttendance: "2024-11-13T14:30:00.000Z",
    attendanceRate: 88.0
  },
  {
    id: "student-3",
    studentId: "20210003",
    name: "Lê Hoàng Cường",
    email: "cuong.lh@student.hust.edu.vn",
    phone: "0965432109",
    classId: "class-2",
    className: "Cơ sở dữ liệu",
    status: "active",
    enrolledAt: "2024-02-20T10:15:00.000Z",
    lastAttendance: "2024-11-14T10:00:00.000Z",
    attendanceRate: 92.3
  },
  {
    id: "student-4",
    studentId: "20210004",
    name: "Phạm Thị Dung",
    email: "dung.pt@student.hust.edu.vn",
    phone: "0954321098",
    classId: "class-2",
    className: "Cơ sở dữ liệu",
    status: "inactive",
    enrolledAt: "2024-02-20T10:15:00.000Z",
    lastAttendance: "2024-11-01T10:00:00.000Z",
    attendanceRate: 65.2
  },
  {
    id: "student-5",
    studentId: "20210005",
    name: "Vũ Minh Đức",
    email: "duc.vm@student.hust.edu.vn",
    phone: "0943210987",
    classId: "class-3",
    className: "Mạng máy tính",
    status: "active",
    enrolledAt: "2024-03-10T11:30:00.000Z",
    lastAttendance: "2024-11-14T16:45:00.000Z",
    attendanceRate: 97.8
  },
];

const StudentPage = () => {
  const columns: ColumnDef<Student>[] = [
    createSortableColumn("studentId", "Mã SV", {
      size: 100,
      className: "font-mono text-sm font-medium",
    }),
    createSortableColumn("name", "Họ tên", {
      size: 180,
      className: "font-medium",
    }),
    createSortableColumn("email", "Email", {
      size: 220,
      className: "text-muted-foreground text-sm",
    }),
    createSortableColumn("className", "Lớp học", {
      size: 150,
      className: "text-sm",
    }),
    {
      accessorKey: "attendanceRate",
      header: "Tỷ lệ điểm danh",
      size: 120,
      cell: ({ row }) => {
        const rate = row.original.attendanceRate;
        const colorClass = rate >= 90 ? "text-green-600" : rate >= 75 ? "text-yellow-600" : "text-red-600";
        return (
          <div className={`text-center font-medium ${colorClass}`}>
            {rate.toFixed(1)}%
          </div>
        );
      },
    },
    createStatusColumn(
      "status",
      {
        active: { label: "Đang học", variant: "default" },
        inactive: { label: "Tạm nghỉ", variant: "secondary" },
        suspended: { label: "Đình chỉ", variant: "destructive" },
      },
      { size: 100 }
    ),
    createDateColumn("lastAttendance", "Điểm danh gần nhất", { size: 140 }),
    createActionsColumn<Student>(
      {
        onView: (student) => console.log("View student:", student),
        onEdit: (student) => console.log("Edit student:", student),
        onDelete: (student) => console.log("Delete student:", student),
      },
      { size: 80 }
    ),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-3xl tracking-tight">Tổng quan sinh viên</h2>
        <p className="text-muted-foreground">Danh sách sinh viên</p>
      </div>
      <DataTable
        columns={columns}
        data={sampleStudents}
        searchKey="name"
        searchPlaceholder="Tìm kiếm sinh viên..."
        onRowClick={(row) => console.log("Row clicked:", row.original)}
      />
    </div>
  );
};

export default StudentPage;