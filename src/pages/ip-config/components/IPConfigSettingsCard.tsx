import { useState } from "react";
import { useIPConfigStore } from "@/stores/ip-config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);


  const handleSaveMessage = async () => {
    setIsSaving(true);
    try {
      await editIPConfig({ errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async () => {
    if (!config?.enabled) {
      await toggleIPCheckStatus();
    } else {
      setToggleDialogOpen(true);
    }
  };

  const confirmToggle = async () => {
    setToggleDialogOpen(false);
    await toggleIPCheckStatus();
  }

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
    <div className="gap-6 grid md:grid-cols-2">
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
          <div className="flex justify-between items-center bg-muted p-4 rounded-lg">
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

          <div className="text-muted-foreground text-sm">
            {config?.enabled ? (
              <p>
                Sinh viên chỉ có thể điểm danh khi kết nối từ các địa chỉ IP
                được phép trong danh sách.
              </p>
            ) : (
              <p>Sinh viên có thể điểm danh từ bất kỳ địa chỉ IP nào.</p>
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
                <Save className="mr-2 w-4 h-4" />
              )}
              Lưu thay đổi
            </Button>
          </div>

          {config?.errorMessage && (
            <div className="bg-red-50 p-3 border border-red-200 rounded-lg">
              <p className="font-medium text-red-600 text-sm">Xem trước:</p>
              <p className="mt-1 text-red-800 text-sm">{config.errorMessage}</p>
            </div>
          )}
        </CardContent>
      </Card> 

      <AlertDialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thay đổi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn tắt/bật tính năng kiểm tra IP không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggle}>Tắt</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
