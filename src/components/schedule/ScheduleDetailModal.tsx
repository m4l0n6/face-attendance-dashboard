import { useState, useEffect } from "react";
import { getScheduleWithSessions } from "@/services/sessions/index";
import { useAuthStore } from "@/stores/auth";
import { useSessionStore } from "@/stores/sessions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, MapPin, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { DataTable } from "@/components/common/DataTable";
import { createSimpleColumn, createIndexColumn } from "@/components/common/DataTableHelpers";
import type { ScheduleWithSessions, ScheduleSession } from "@/services/schedules/typing";
import type { ColumnDef } from "@tanstack/react-table";

const daysOfWeekMap: Record<number, string> = {
  0: "CN",
  1: "T2",
  2: "T3",
  3: "T4",
  4: "T5",
  5: "T6",
  6: "T7",
};

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  SCHEDULED: { label: "Đã lên lịch", variant: "secondary" },
  COMPLETED: { label: "Hoàn thành", variant: "default" },
  CANCELLED: { label: "Nghỉ", variant: "destructive" },
};

interface ScheduleDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleId: string | null;
}

export const ScheduleDetailModal = ({ open, onOpenChange, scheduleId }: ScheduleDetailModalProps) => {
  const { token } = useAuthStore();
  const { startNewSession, endCurrentSession, cancelSession } = useSessionStore();
  const [data, setData] = useState<ScheduleWithSessions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    if (!scheduleId || !token) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getScheduleWithSessions(token, scheduleId);
      setData(response);
    } catch (err) {
      setError("Không thể tải thông tin lịch học");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && scheduleId) {
      fetchData();
    } else {
      setData(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, scheduleId, token]);

  const handleStartSession = async (session: ScheduleSession) => {
    if (!data?.schedule.classId) return;

    try {
      setActionLoading(session.id);
      await startNewSession({
        classId: data.schedule.classId,
        scheduleSessionId: session.id,
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEndSession = async (session: ScheduleSession) => {
    if (session.sessions.length === 0) return;

    try {
      setActionLoading(session.id);
      await endCurrentSession(session.sessions[0].id);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelSession = async (session: ScheduleSession) => {
    try {
      setActionLoading(session.id);
      await cancelSession(session.id, "Nghỉ học");
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const columns: ColumnDef<ScheduleSession>[] = [
    createIndexColumn<ScheduleSession>(),
    createSimpleColumn<ScheduleSession>("sessionName", "Tên buổi học", {
      size: 150,
    }),
    createSimpleColumn<ScheduleSession>("sessionDate", "Ngày học", {
      size: 200,
      cell: (value) => format(new Date(value as string), "EEEE, dd/MM/yyyy", { locale: vi }),
    }),
    createSimpleColumn<ScheduleSession>("status", "Trạng thái", {
      size: 150,
      cell: (value) => {
        const status = value as string;
        const statusInfo = statusMap[status] || statusMap.SCHEDULED;
        return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
      },
    }),
    {
      accessorKey: "sessions",
      header: "Thời gian điểm danh",
      size: 150,
      cell: ({ getValue }) => {
        const sessions = getValue() as ScheduleSession["sessions"];
        if (sessions.length === 0) return <span className="text-muted-foreground">Chưa điểm danh</span>;
        return (
          <span className="text-sm">
            {format(new Date(sessions[0].startAt), "HH:mm", { locale: vi })} -{" "}
            {format(new Date(sessions[0].endAt), "HH:mm", { locale: vi })}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      size: 200,
      cell: ({ row }) => {
        const session = row.original;
        const hasActiveSession = session.sessions.length > 0 && !session.sessions[0].endAt;
        const isLoading = actionLoading === session.id;

        if (session.status === "COMPLETED" || session.status === "CANCELLED") {
          return <span className="text-muted-foreground text-sm">-</span>;
        }

        return (
          <div className="flex gap-1">
            <ButtonGroup>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStartSession(session)}
                disabled={isLoading || hasActiveSession}
              >
                Bắt đầu
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEndSession(session)}
                disabled={isLoading || !hasActiveSession}
              >
                Kết thúc
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCancelSession(session)}
                disabled={isLoading || hasActiveSession}
              >
                Nghỉ
              </Button>
            </ButtonGroup>
          </div>
        );
      },
    },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="w-64 h-6" />
          <Skeleton className="w-full h-32" />
          <Skeleton className="w-full h-64" />
        </div>
      );
    }

    if (error || !data) {
      return (
        <Alert variant="destructive">
          <AlertDescription>{error || "Không tìm thấy lịch học"}</AlertDescription>
        </Alert>
      );
    }

    const { schedule, sessions } = data;

    return (
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Schedule Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin lịch học</CardTitle>
            <CardDescription>
              Chi tiết về thời gian và địa điểm học
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="gap-6 grid md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Thời gian</p>
                  <p className="text-muted-foreground text-sm">
                    {format(new Date(schedule.startDate), "dd/MM/yyyy", {
                      locale: vi,
                    })}{" "}
                    -{" "}
                    {format(new Date(schedule.endDate), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-1 w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Giờ học</p>
                  <p className="text-muted-foreground text-sm">
                    {schedule.startTime} - {schedule.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-1 w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Phòng học</p>
                  <p className="text-muted-foreground text-sm">{schedule.room}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BookOpen className="mt-1 w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Ngày trong tuần</p>
                  <div className="flex flex-wrap gap-1">
                    {schedule.daysOfWeek.map((day) => (
                      <Badge key={day}>{daysOfWeekMap[day]}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách buổi học ({sessions.length})</CardTitle>
            <CardDescription>Thông tin chi tiết từng buổi học</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={sessions}
              searchKey="sessionName"
              searchPlaceholder="Tìm kiếm buổi học..."
              showCreateButton={false}
              showRefreshButton={false}
              pageSize={5}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[100vw] sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>{data?.schedule.name || "Chi tiết lịch học"}</DialogTitle>
          <DialogDescription>
            {data?.schedule.class?.name} - {data?.schedule.class?.code}
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};