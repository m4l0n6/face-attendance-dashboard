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
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  Users, 
  UserCheck, 
  UserX,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { SessionStatisticsResponse } from "@/services/statistics/typing";
import type { Schedule, ScheduleSession } from "@/services/schedules/typing";
import type { Classes } from "@/services/classes/typing";

const ITEMS_PER_PAGE = 10;

interface SessionStatisticsTableProps {
  classes: Classes[];
  sessionClassId: string | null;
  onSessionClassChange: (classId: string | null) => void;
  schedules: Schedule[];
  selectedScheduleId: string | null;
  onScheduleChange: (scheduleId: string | null) => void;
  sessions: ScheduleSession[];
  selectedSessionId: string | null;
  onSessionChange: (sessionId: string | null) => void;
  sessionStats: SessionStatisticsResponse | null;
  isLoadingSchedules: boolean;
  isLoadingSessions: boolean;
  isLoadingStats: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

type SessionStudent = 
  | { studentId: string; name: string; method: string; matchedAt: string; status: 'attended' }
  | { studentId: string; name: string; status: 'absent' };

export function SessionStatisticsTable({
  classes,
  sessionClassId,
  onSessionClassChange,
  schedules,
  selectedScheduleId,
  onScheduleChange,
  sessions,
  selectedSessionId,
  onSessionChange,
  sessionStats,
  isLoadingSchedules,
  isLoadingSessions,
  isLoadingStats,
  currentPage,
  onPageChange,
}: SessionStatisticsTableProps) {
  // Combine attended + absent students
  const allSessionStudents: SessionStudent[] = sessionStats 
    ? [
        ...sessionStats.attended.map(s => ({ ...s, status: 'attended' as const })),
        ...sessionStats.absent.map(s => ({ ...s, status: 'absent' as const }))
      ]
    : [];
  
  const totalStudents = allSessionStudents.length;
  const totalPages = Math.ceil(totalStudents / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedStudents = allSessionStudents.slice(startIndex, endIndex);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div>
            <CardTitle>Thống kê điểm danh theo buổi học</CardTitle>
            <CardDescription>
              Xem chi tiết điểm danh của từng sinh viên trong một buổi học cụ thể
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Select Class */}
            <Select
              value={sessionClassId || "none"}
              onValueChange={(value) => onSessionClassChange(value === "none" ? null : value)}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Chọn lớp học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">-- Chọn lớp --</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Select Schedule */}
            <Select
              value={selectedScheduleId || "none"}
              onValueChange={(value) => onScheduleChange(value === "none" ? null : value)}
              disabled={!sessionClassId || isLoadingSchedules}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder={isLoadingSchedules ? "Đang tải..." : "Chọn lịch học"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">-- Chọn lịch học --</SelectItem>
                {schedules.map((schedule) => (
                  <SelectItem key={schedule.id} value={schedule.id}>
                    {schedule.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Select Session */}
            <Select
              value={selectedSessionId || "none"}
              onValueChange={(value) => onSessionChange(value === "none" ? null : value)}
              disabled={!selectedScheduleId || isLoadingSessions}
            >
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder={isLoadingSessions ? "Đang tải..." : "Chọn buổi học"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">-- Chọn buổi học --</SelectItem>
                {sessions.map((session) => (
                  <SelectItem key={session.id} value={session.id}>
                    {session.sessionName} - {format(new Date(session.sessionDate), "dd/MM/yyyy", { locale: vi })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!selectedSessionId ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Vui lòng chọn lớp học, lịch học và buổi học để xem thống kê
          </div>
        ) : isLoadingStats ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-full h-12" />
            ))}
          </div>
        ) : sessionStats ? (
          <div className="space-y-4">
            {/* Session Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <CalendarDays className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Ngày học</p>
                  <p className="font-medium text-sm">
                    {format(new Date(sessionStats.session.date), "EEEE, dd/MM/yyyy", { locale: vi })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Tổng sinh viên</p>
                  <p className="font-medium text-sm">{sessionStats.statistics.totalStudents}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <UserCheck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Có mặt</p>
                  <p className="font-medium text-sm text-green-600">{sessionStats.statistics.attendedStudents}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950">
                <UserX className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Vắng mặt</p>
                  <p className="font-medium text-sm text-red-600">{sessionStats.statistics.absentStudents}</p>
                </div>
              </div>
            </div>

            {/* Session Status & Attendance Rate */}
            <div className="flex gap-4 flex-wrap">
              <Badge 
                variant={sessionStats.session.status === "COMPLETED" ? "default" : "secondary"}
                className={sessionStats.session.status === "COMPLETED" ? "bg-green-600" : ""}
              >
                {sessionStats.session.status === "COMPLETED" ? "Hoàn thành" : 
                 sessionStats.session.status === "CANCELLED" ? "Đã hủy" : "Đã lên lịch"}
              </Badge>
              <Badge variant="outline" className="text-sm py-1 px-3">
                Tỉ lệ điểm danh: {sessionStats.statistics.attendanceRate.toFixed(1)}%
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
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="hidden md:table-cell">Phương thức</TableHead>
                    <TableHead className="hidden md:table-cell">Thời gian điểm danh</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map((student, index) => (
                      <TableRow key={student.studentId}>
                        <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="text-center">
                          {student.status === 'attended' ? (
                            <Badge variant="default" className="bg-green-600">
                              <UserCheck className="w-3 h-3 mr-1" />
                              Có mặt
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <UserX className="w-3 h-3 mr-1" />
                              Vắng
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {student.status === 'attended' && 'method' in student ? (
                            <Badge variant="outline">
                              {student.method === 'face' ? 'Khuôn mặt' : student.method}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {student.status === 'attended' && 'matchedAt' in student ? (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(student.matchedAt), "HH:mm:ss", { locale: vi })}
                            </div>
                          ) : (
                            <span>-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
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

