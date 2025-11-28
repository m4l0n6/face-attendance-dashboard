import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  CalendarDays, 
  TrendingUp, 
  TrendingDown,
} from "lucide-react";
import type { AdminOverviewResponse } from "@/services/statistics/typing";

interface OverviewCardsProps {
  statistics: AdminOverviewResponse | null;
}

export function OverviewCards({ statistics }: OverviewCardsProps) {
  return (
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
  );
}

