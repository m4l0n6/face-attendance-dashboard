import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useClassStore } from "@/stores/classes";
import { useScheduleStore } from "@/stores/schedules";
import {
  createIndexColumn,
  createActionsColumn,
} from "@/components/common/DataTableHelpers";
import type { Classes } from "@/services/classes/typing";
import type { Schedule, ScheduleSession } from "@/services/schedules/typing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DataTable } from "@/components/common/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ScheduleForm } from "./components/schedule-form";
import { AttendanceManagementDialog } from "@/components/attendance/AttendanceManagementDialog";
import { toast } from "sonner";
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
import { useAuthStore } from "@/stores/auth";
import { getSessionsBySchedule } from "@/services/sessions";

const dayOfWeekMap: Record<number, string> = {
  0: "CN",
  1: "T2",
  2: "T3",
  3: "T4",
  4: "T5",
  5: "T6",
  6: "T7",
};

const ClassesDetailPage = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { classes, fetchClasses } = useClassStore();
  const { schedules, isLoading, fetchSchedules, addSchedule, removeSchedule, clearSchedules } = useScheduleStore();
  const [currentClass, setCurrentClass] = useState<Classes | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Schedule | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ScheduleSession | null>(null);
  const { token } = useAuthStore();
  const [isLoadingSession, setIsLoadingSession] = useState(false);

  useEffect(() => {
    if (classes.length === 0) {
      fetchClasses();
    }
  }, [classes.length, fetchClasses]);

  useEffect(() => {
    const classData = classes.find((c) => c.id === classId);
    setCurrentClass(classData || null);
  }, [classId, classes]);

  useEffect(() => {
    if (classId) {
      fetchSchedules(classId);
    }
    
    return () => {
      clearSchedules();
    };
  }, [classId, fetchSchedules, clearSchedules]);

  const handleCreate = () => {
    setEditData(null);
    setDialogOpen(true);
  };

  const handleView = async (schedule: Schedule) => {
    if (!token) {
      toast.error("Phiên đăng nhập hết hạn", {
        description: "Vui lòng đăng nhập lại",
      });
      return;
    }

    setIsLoadingSession(true);
    try {
      // Gọi API để lấy danh sách sessions
      const sessions = await getSessionsBySchedule(token, schedule.id);
      
      if (sessions && sessions.length > 0) {
        // Lấy session đầu tiên hoặc session đang active
        const activeSession = sessions.find(
          (s: ScheduleSession) => s.status === "SCHEDULED"
        ) || sessions[0];
        
        setSelectedSession(activeSession);
        setAttendanceDialogOpen(true);
      } else {
        toast.error("Chưa có buổi học", {
          description: "Lịch học này chưa có buổi học nào được tạo",
        });
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Không thể tải danh sách buổi học", {
        description: "Vui lòng thử lại sau",
      });
    } finally {
      setIsLoadingSession(false);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditData(schedule);
    setDialogOpen(true);
  };

  const handleCreateSchedule = async (data: {
    name: string;
    startDate: string;
    endDate: string;
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
    room: string;
    description: string;
  }) => {
    if (!classId) return;

    try {
      await addSchedule({ ...data, classId });
      setDialogOpen(false);
      setEditData(null);
      toast.success("Tạo lịch học thành công");
    } catch {
      toast.error("Tạo lịch học thất bại");
    }
  };

  const handleDeleteClick = (schedule: Schedule) => {
    setDeleteId(schedule.id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      await removeSchedule(deleteId);
      setDeleteDialogOpen(false);
      setDeleteId(null);
      toast.success("Xóa lịch học thành công");
    } catch {
      toast.error("Xóa lịch học thất bại");
    }
  };

  const columns: ColumnDef<Schedule>[] = [
    createIndexColumn(),
    {
      accessorKey: "name",
      header: "Tên lịch học",
    },
    {
      accessorKey: "daysOfWeek",
      header: "Thứ",
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original.daysOfWeek.map((day) => (
            <Badge key={day} variant="outline">
              {dayOfWeekMap[day]}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "startTime",
      header: "Giờ bắt đầu",
    },
    {
      accessorKey: "endTime",
      header: "Giờ kết thúc",
    },
    {
      accessorKey: "room",
      header: "Phòng học",
    },
    {
      accessorKey: "startDate",
      header: "Ngày bắt đầu",
      cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString("vi-VN"),
    },
    {
      accessorKey: "endDate",
      header: "Ngày kết thúc",
      cell: ({ row }) => new Date(row.original.endDate).toLocaleDateString("vi-VN"),
    },
    createActionsColumn({
      onView: handleView,
      onEdit: handleEdit,
      onDelete: handleDeleteClick,
    }),
  ];

  if (!currentClass) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/classes")}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="font-bold text-2xl">{currentClass.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin lớp học</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm">Mã lớp</p>
              <p className="font-semibold">{currentClass.code}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Số sinh viên</p>
              <p className="font-semibold">{currentClass._count.students}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Mô tả</p>
              <p className="font-semibold">
                {currentClass.description || "Không có mô tả"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Số phiên điểm danh</p>
              <p className="font-semibold">{currentClass._count.sessions}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Lịch học</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={schedules}
            isLoading={isLoading || isLoadingSession}
            searchKey="name"
            searchPlaceholder="Tìm kiếm lịch học..."
            onCreateClick={handleCreate}
            onRefresh={() => classId && fetchSchedules(classId)}
          />
        </CardContent>
      </Card>

      <ScheduleForm
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditData(null);
        }}
        onSubmit={handleCreateSchedule}
        initialData={editData}
        classId={classId || ""}
      />
      
      <AttendanceManagementDialog
  open={attendanceDialogOpen}
  onOpenChange={setAttendanceDialogOpen}
  session={selectedSession}
  classId={classId!} // ✅ PASS classId
  onEndSession={() => {
    if (classId) {
      fetchSchedules(classId);
    }
  }}
/>

      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa lịch học này? Hành động này không thể
              hoàn tác.
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

export default ClassesDetailPage;