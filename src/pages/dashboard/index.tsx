import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth";
import { getAdminOverview } from "@/services/statistics";
import type { AdminOverviewResponse } from "@/services/statistics/typing";
import { Users, GraduationCap, BookOpen, CalendarDays, TrendingUp, TrendingDown } from "lucide-react";

const DashboardPage = () => {
  const { token } = useAuthStore();
  const [statistics, setStatistics] = useState<AdminOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!token) return;
      
      try {
        setIsLoading(true);
        const data = await getAdminOverview(token);
        setStatistics(data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [token]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-3xl tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Tổng quan hệ thống</p>
        </div>
        <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row justify-between items-center space-y-0">
                <Skeleton className="w-24 h-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 w-16 h-8" />
                <Skeleton className="w-32 h-3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-3xl tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Tổng quan hệ thống</p>
      </div>
      
      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Tổng sinh viên
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {statistics?.overview.totalStudents || 0}
            </div>
            <p className="text-muted-foreground text-xs">
              Sinh viên đã tham gia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Tổng lớp học</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {statistics?.overview.totalClasses || 0}
            </div>
            <p className="text-muted-foreground text-xs">Lớp học đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Tổng giảng viên</CardTitle>
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {statistics?.overview.totalLecturers || 0}
            </div>
            <p className="text-muted-foreground text-xs">Giảng viên</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Tổng buổi học</CardTitle>
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {statistics?.overview.totalSessions || 0}
            </div>
            <p className="text-muted-foreground text-xs">Buổi học đã diễn ra</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Tỉ lệ điểm danh
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-green-600 text-2xl">
              {statistics?.overview.overallAttendanceRate?.toFixed(1) || 0}%
            </div>
            <p className="text-muted-foreground text-xs">
              {statistics?.details.totalActualAttendances || 0} / {statistics?.details.totalExpectedAttendances || 0} lượt điểm danh
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Tỉ lệ vắng mặt
            </CardTitle>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-red-600 text-2xl">
              {statistics?.overview.overallAbsentRate?.toFixed(1) || 0}%
            </div>
            <p className="text-muted-foreground text-xs">
              {statistics?.details.totalMissedAttendances || 0} lượt vắng mặt
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
