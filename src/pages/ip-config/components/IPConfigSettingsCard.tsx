import { useState } from "react";
import { useIPConfigStore } from "@/stores/ip-config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldOff, Save } from "lucide-react";

export function IPConfigSettingsCard() {
  const { config, isLoadingConfig, editIPConfig, toggleIPCheckStatus } =
    useIPConfigStore();

  const [errorMessage, setErrorMessage] = useState(config?.errorMessage || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveMessage = async () => {
    setIsSaving(true);
    try {
      await editIPConfig({ errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async () => {
    await toggleIPCheckStatus();
  };

  if (isLoadingConfig && !config) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-48">
          <Spinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Toggle Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {config?.enabled ? (
              <Shield className="w-5 h-5 text-green-600" />
            ) : (
              <ShieldOff className="w-5 h-5 text-gray-400" />
            )}
            Kiểm tra IP
          </CardTitle>
          <CardDescription>
            Bật/tắt tính năng kiểm tra IP khi sinh viên điểm danh
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-1">
              <p className="font-medium">Trạng thái hiện tại</p>
              <Badge variant={config?.enabled ? "default" : "secondary"}>
                {config?.enabled ? "Đang bật" : "Đã tắt"}
              </Badge>
            </div>
            <Switch
              checked={config?.enabled || false}
              onCheckedChange={handleToggle}
              disabled={isLoadingConfig}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            {config?.enabled ? (
              <p>
                ✅ Sinh viên chỉ có thể điểm danh khi kết nối từ các địa chỉ IP
                được phép trong danh sách.
              </p>
            ) : (
              <p>
                ⚠️ Sinh viên có thể điểm danh từ bất kỳ địa chỉ IP nào.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Message Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông báo lỗi</CardTitle>
          <CardDescription>
            Tin nhắn hiển thị khi sinh viên điểm danh từ IP không được phép
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="errorMessage">Nội dung thông báo</FieldLabel>
            <Textarea
              id="errorMessage"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              placeholder="Nhập thông báo lỗi..."
              rows={3}
            />
          </Field>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveMessage}
              disabled={isSaving || errorMessage === config?.errorMessage}
            >
              {isSaving ? (
                <Spinner className="mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Lưu thay đổi
            </Button>
          </div>

          {config?.errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Xem trước:</p>
              <p className="text-sm text-red-800 mt-1">{config.errorMessage}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
