import { Button } from "@/components/ui/button";
import { AttendanceStatus } from "@/services/attendance/typing";
import { cn } from "@/lib/utils";

interface AttendanceStatusCellProps {
  currentStatus: AttendanceStatus;
  onStatusChange: (status: AttendanceStatus) => void;
  disabled?: boolean;
}

const statusConfig = {
  [AttendanceStatus.PRESENT]: {
    label: "Có mặt",
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100",
  },
  [AttendanceStatus.LATE]: {
    label: "Muộn",
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
  },
  [AttendanceStatus.EXCUSED]: {
    label: "Vắng CP",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 hover:bg-yellow-100",
  },
  [AttendanceStatus.UNEXCUSED]: {
    label: "Vắng KP",
    color: "text-red-600",
    bgColor: "bg-red-50 hover:bg-red-100",
  },
  [AttendanceStatus.NONE]: {
    label: "Chưa điểm danh",
    color: "text-gray-600",
    bgColor: "bg-gray-50 hover:bg-gray-100",
  },
};

export function AttendanceStatusCell({
  currentStatus,
  onStatusChange,
  disabled = false,
}: AttendanceStatusCellProps) {
  const statuses = [
    AttendanceStatus.PRESENT,
    AttendanceStatus.LATE,
    AttendanceStatus.EXCUSED,
    AttendanceStatus.UNEXCUSED,
  ];

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {statuses.map((status) => {
        const config = statusConfig[status];
        const isActive = currentStatus === status;

        return (
          <Button
            key={status}
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => onStatusChange(status)}
            className={cn(
              "text-xs px-2 py-1 h-auto",
              config.color,
              isActive && config.bgColor,
              isActive && "font-bold border border-current"
            )}
          >
            {config.label}
          </Button>
        );
      })}
    </div>
  );
}