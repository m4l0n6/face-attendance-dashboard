import { useEffect } from "react";
import { useIPConfigStore } from "@/stores/ip-config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Globe, RefreshCw, CheckCircle, XCircle } from "lucide-react";

export function CurrentIPCard() {
  const { currentIP, fetchCurrentIP } = useIPConfigStore();

  useEffect(() => {
    fetchCurrentIP();
  }, []);

  const handleRefresh = () => {
    fetchCurrentIP();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Thông tin IP hiện tại
            </CardTitle>
            <CardDescription>
              Kiểm tra địa chỉ IP của bạn và trạng thái được phép
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!currentIP ? (
          <div className="flex justify-center items-center h-32">
            <Spinner />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {/* IP Address */}
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">Địa chỉ IP</p>
              <p className="text-2xl font-mono font-bold">{currentIP.cleanIp}</p>
              {currentIP.rawIp !== currentIP.cleanIp && (
                <p className="text-xs text-muted-foreground">
                  Raw: {currentIP.rawIp}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">Trạng thái</p>
              <div className="flex items-center gap-2">
                {currentIP.isAllowed ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-600">Được phép</p>
                      <p className="text-sm text-muted-foreground">
                        IP này có trong danh sách cho phép
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-600">Không được phép</p>
                      <p className="text-sm text-muted-foreground">
                        IP này không có trong danh sách
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Headers Info */}
            <div className="md:col-span-2 p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">Headers</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">X-Forwarded-For:</p>
                  <code className="bg-background px-2 py-1 rounded">
                    {currentIP.headers["x-forwarded-for"] || "null"}
                  </code>
                </div>
                <div>
                  <p className="text-muted-foreground">X-Real-IP:</p>
                  <code className="bg-background px-2 py-1 rounded">
                    {currentIP.headers["x-real-ip"] || "null"}
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
