import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AttendanceStats } from "@/services/attendance/typing";
import { Users, UserCheck, Clock, UserX, AlertCircle } from "lucide-react";

interface AttendanceStatisticsCardsProps {
  stats: AttendanceStats | null;
  isLoading: boolean;
}

export function AttendanceStatisticsCards({
  stats,
  isLoading,
}: AttendanceStatisticsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const cards = [
    {
      title: "Sĩ số điểm danh",
      value: stats.total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Có mặt",
      value: stats.present,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Vắng có phép",
      value: stats.excused,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Vắng không phép",
      value: stats.unexcused,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Chưa điểm danh",
      value: stats.none,
      icon: AlertCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                </div>
                <div className={`${card.bgColor} p-2 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}