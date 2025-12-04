import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/auth";
import { useAttendanceStore } from "@/stores/attendance";
import { AttendanceStatisticsCards } from "./AttendanceStatisticsCards";
import { AttendanceToolbar } from "./AttendanceToolbar";
import { AttendanceDataTable } from "./AttendanceDataTable";
import { toast } from "sonner";
import type { AttendanceStatus } from "@/services/attendance/typing";
import type { ScheduleSession } from "@/services/sessions/typing";

interface AttendanceManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: ScheduleSession | null;
  classId: string;
  onEndSession?: () => void;
}

export function AttendanceManagementDialog({
  open,
  onOpenChange,
  session,
  classId,
  onEndSession,
}: AttendanceManagementDialogProps) {
  const { token } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);

const {
  stats,
  attendanceList,
  pagination,
  isLoadingStats,
  isLoadingList,
  fetchAttendanceList,
  updateAttendanceStatus,
  exportData,
  reset,
} = useAttendanceStore();

// Load data when dialog opens
useEffect(() => {
  if (open && session && token && classId) {
    const loadData = async () => {
      try {
        // ✅ CHỈ gọi 1 API - stats sẽ tự động tính
        await fetchAttendanceList(token, session.id, classId, currentPage, 20);
      } catch (error) {
        console.error("❌ Error loading data:", error);
        toast.error("Không thể tải dữ liệu điểm danh");
      }
    };

    loadData();
  }
}, [open, session, token, classId, currentPage, fetchAttendanceList]);

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
      setCurrentPage(1);
    }
  }, [open, reset]);

  const handleStatusChange = async (
    studentId: string,
    status: AttendanceStatus
  ) => {
    if (!session || !token) return;
    await updateAttendanceStatus(token, session.id, studentId, status);
    toast.success("Cập nhật trạng thái thành công");
  };

  const handleQRScan = () => {
    toast.info("Chức năng đang phát triển", {
      description: "Chức năng QR điểm danh sẽ sớm được cập nhật",
    });
  };

  const handleEndSession = () => {
    if (onEndSession) {
      onEndSession();
      onOpenChange(false);
    }
  };

  const handleExport = async () => {
    if (!session || !token) return;
    try {
      await exportData(token, session.id);
      toast.success("Xuất dữ liệu thành công");
    } catch  {
      toast.error("Xuất dữ liệu thất bại");
    }
  };

  const handleRefresh = () => {
  if (session && token && classId) {
    fetchAttendanceList(token, session.id, classId, currentPage, 20);
  }
};

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Quản lý điểm danh - {session.sessionName}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-1">
            {new Date(session.sessionDate).toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col px-6 pb-6">
          <div className="space-y-4 py-4">
            {/* Statistics Cards */}
            <AttendanceStatisticsCards
              stats={stats}
              isLoading={isLoadingStats}
            />

            {/* Toolbar */}
            <AttendanceToolbar
              onQRScan={handleQRScan}
              onEndSession={handleEndSession}
              onExport={handleExport}
              onRefresh={handleRefresh}
            />
          </div>

          {/* Data Table - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <AttendanceDataTable
              data={attendanceList}
              pagination={pagination}
              isLoading={isLoadingList}
              onStatusChange={handleStatusChange}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}