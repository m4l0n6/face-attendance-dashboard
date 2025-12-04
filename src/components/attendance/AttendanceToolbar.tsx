import { Button } from "@/components/ui/button";
import { QrCode, StopCircle, Download, RefreshCw } from "lucide-react";

interface AttendanceToolbarProps {
  onQRScan: () => void;
  onEndSession: () => void;
  onExport: () => void;
  onRefresh: () => void;
  isSessionEnded?: boolean;
}

export function AttendanceToolbar({
  onQRScan,
  onEndSession,
  onExport,
  onRefresh,
  isSessionEnded = false,
}: AttendanceToolbarProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onQRScan}
          disabled={isSessionEnded}
        >
          <QrCode className="mr-2 h-4 w-4" />
          QR điểm danh
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onEndSession}
          disabled={isSessionEnded}
        >
          <StopCircle className="mr-2 h-4 w-4" />
          Kết thúc điểm danh
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Xuất dữ liệu
        </Button>
      </div>
      <Button variant="ghost" size="sm" onClick={onRefresh}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Tải lại
      </Button>
    </div>
  );
}