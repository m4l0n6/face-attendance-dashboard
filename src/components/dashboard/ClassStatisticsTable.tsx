import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ClassStatisticsResponse } from "@/services/statistics/typing";
import type { Classes } from "@/services/classes/typing";

const ITEMS_PER_PAGE = 10;

interface ClassStatisticsTableProps {
  classes: Classes[];
  selectedClassId: string | null;
  onClassChange: (classId: string | null) => void;
  classStats: ClassStatisticsResponse | null;
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function ClassStatisticsTable({
  classes,
  selectedClassId,
  onClassChange,
  classStats,
  isLoading,
  currentPage,
  onPageChange,
}: ClassStatisticsTableProps) {
  const totalStudents = classStats?.students.length || 0;
  const totalPages = Math.ceil(totalStudents / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedStudents = classStats?.students.slice(startIndex, endIndex) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Thống kê điểm danh theo lớp</CardTitle>
            <CardDescription>
              Xem chi tiết điểm danh của từng sinh viên trong lớp
            </CardDescription>
          </div>
          <Select
            value={selectedClassId || "none"}
            onValueChange={(value) => onClassChange(value === "none" ? null : value)}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Chọn lớp học" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">-- Chọn lớp học --</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name} ({cls.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {!selectedClassId ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Vui lòng chọn lớp học để xem thống kê
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-full h-12" />
            ))}
          </div>
        ) : classStats ? (
          <div className="space-y-4">
            {/* Class Summary */}
            <div className="flex gap-4 flex-wrap">
              <Badge variant="outline" className="text-sm py-1 px-3">
                Tổng buổi học: {classStats.totalSessions}
              </Badge>
              <Badge variant="outline" className="text-sm py-1 px-3">
                Tổng sinh viên: {classStats.totalStudents}
              </Badge>
            </div>

            {/* Students Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">STT</TableHead>
                    <TableHead>Mã SV</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="text-center">Có mặt</TableHead>
                    <TableHead className="text-center">Vắng</TableHead>
                    <TableHead className="text-center">Tỉ lệ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map((student, index) => (
                      <TableRow key={student.studentId}>
                        <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {student.email}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="default" className="bg-green-600">
                            {student.attendedSessions}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={student.absentSessions > 0 ? "destructive" : "secondary"}>
                            {student.absentSessions}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant={
                              student.attendanceRate >= 80 
                                ? "default" 
                                : student.attendanceRate >= 50 
                                  ? "secondary" 
                                  : "destructive"
                            }
                            className={
                              student.attendanceRate >= 80 
                                ? "bg-green-600" 
                                : student.attendanceRate >= 50 
                                  ? "bg-yellow-600" 
                                  : ""
                            }
                          >
                            {student.attendanceRate.toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        Không có dữ liệu sinh viên
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalStudents > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Hiển thị {startIndex + 1} - {Math.min(endIndex, totalStudents)} trong tổng số {totalStudents} sinh viên
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Trước
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => onPageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Không thể tải dữ liệu thống kê
          </div>
        )}
      </CardContent>
    </Card>
  );
}

