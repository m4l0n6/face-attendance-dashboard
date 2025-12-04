import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AttendanceStatusCell } from "./AttendanceStatusCell";
import type { StudentAttendance, AttendanceStatus } from "@/services/attendance/typing";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AttendanceDataTableProps {
  data: StudentAttendance[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  onPageChange: (page: number) => void;
}

export function AttendanceDataTable({
  data = [], // ✅ Default value
  pagination,
  isLoading,
  onStatusChange,
  onPageChange,
}: AttendanceDataTableProps) {
  // ✅ Safe check
  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  // ✅ Check empty data
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">Chưa có dữ liệu điểm danh</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">STT</TableHead>
              <TableHead className="w-[150px]">Mã SV</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead className="w-[200px]">Trạng thái</TableHead>
              <TableHead className="w-[180px]">Thời gian</TableHead>
              <TableHead className="w-[120px]">Phương thức</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((student, index) => (
              <TableRow key={student.id}>
  <TableCell>{(currentPage - 1) * (pagination?.limit || 10) + index + 1}</TableCell>
  <TableCell className="font-medium">{student.studentId}</TableCell>
  <TableCell>{student.name}</TableCell> {/* ✅ Đã map từ studentName */}
  <TableCell>
    <AttendanceStatusCell
      status={student.status}
      onStatusChange={(newStatus) =>
        onStatusChange(student.studentId, newStatus)
      }
    />
  </TableCell>
  <TableCell>
    {student.recordedAt
      ? new Date(student.recordedAt).toLocaleString("vi-VN")
      : "-"}
  </TableCell>
  <TableCell>
    <span className="text-xs text-muted-foreground">
      {student.method || "MANUAL"}
    </span>
  </TableCell>
</TableRow>

            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => onPageChange(i + 1)}
                  isActive={currentPage === i + 1}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}