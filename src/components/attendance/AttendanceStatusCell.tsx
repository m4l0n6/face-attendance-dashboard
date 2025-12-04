import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AttendanceStatus } from "@/services/attendance/typing";

interface AttendanceStatusCellProps {
  status: AttendanceStatus; // ✅ Đổi từ currentStatus thành status
  onStatusChange: (status: AttendanceStatus) => void;
}

export function AttendanceStatusCell({
  status,
  onStatusChange,
}: AttendanceStatusCellProps) {
  const statusConfig = {
    PRESENT: { label: "Có mặt", color: "bg-green-100 text-green-800" },
    LATE: { label: "Muộn/Về sớm", color: "bg-yellow-100 text-yellow-800" },
    EXCUSED: { label: "Vắng có phép", color: "bg-blue-100 text-blue-800" },
    UNEXCUSED: { label: "Vắng không phép", color: "bg-red-100 text-red-800" },
    NONE: { label: "Chưa điểm danh", color: "bg-gray-100 text-gray-800" },
  };

  return (
    <Select value={status} onValueChange={onStatusChange}>
      <SelectTrigger className={`w-[150px] ${statusConfig[status].color}`}>
        <SelectValue>{statusConfig[status].label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusConfig).map(([key, config]) => (
          <SelectItem key={key} value={key}>
            {config.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}