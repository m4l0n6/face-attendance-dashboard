import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AllowedIP } from "@/services/ip-config/typing";

interface AllowedIPFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: AllowedIP | null;
  onSubmit: (data: {
    ipAddress: string;
    type: "SINGLE" | "RANGE";
    description: string;
    isActive: boolean;
  }) => Promise<void>;
}

export function AllowedIPForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: AllowedIPFormProps) {
  const [ipAddress, setIpAddress] = useState("");
  const [type, setType] = useState<"SINGLE" | "RANGE">("SINGLE");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setIpAddress(initialData.ipAddress);
      setType(initialData.type);
      setDescription(initialData.description || "");
      setIsActive(initialData.isActive);
    } else {
      setIpAddress("");
      setType("SINGLE");
      setDescription("");
      setIsActive(true);
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({ ipAddress, type, description, isActive });
      onOpenChange(false);
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateIP = (ip: string): boolean => {
    if (type === "SINGLE") {
      // Validate single IP: xxx.xxx.xxx.xxx
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipRegex.test(ip)) return false;
      const parts = ip.split(".");
      return parts.every((part) => parseInt(part) >= 0 && parseInt(part) <= 255);
    } else {
      // Validate CIDR: xxx.xxx.xxx.xxx/xx
      const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
      if (!cidrRegex.test(ip)) return false;
      const [ipPart, cidr] = ip.split("/");
      const parts = ipPart.split(".");
      const validIP = parts.every(
        (part) => parseInt(part) >= 0 && parseInt(part) <= 255
      );
      const validCIDR = parseInt(cidr) >= 0 && parseInt(cidr) <= 32;
      return validIP && validCIDR;
    }
  };

  const isValidIP = ipAddress === "" || validateIP(ipAddress);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Chỉnh sửa IP" : "Thêm IP mới"}
            </DialogTitle>
            <DialogDescription>
              {initialData
                ? "Cập nhật thông tin địa chỉ IP"
                : "Nhập thông tin địa chỉ IP được phép điểm danh"}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4 space-y-4">
            <Field>
              <FieldLabel htmlFor="type">Loại IP</FieldLabel>
              <Select
                value={type}
                onValueChange={(value: "SINGLE" | "RANGE") => setType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại IP" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">IP đơn (192.168.1.100)</SelectItem>
                  <SelectItem value="RANGE">Dải IP CIDR (192.168.1.0/24)</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="ipAddress">Địa chỉ IP</FieldLabel>
              <Input
                id="ipAddress"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder={
                  type === "SINGLE"
                    ? "Ví dụ: 192.168.1.100"
                    : "Ví dụ: 192.168.1.0/24"
                }
                className={!isValidIP ? "border-red-500" : ""}
                required
              />
              {!isValidIP && (
                <p className="text-red-500 text-sm mt-1">
                  {type === "SINGLE"
                    ? "Định dạng IP không hợp lệ. Ví dụ: 192.168.1.100"
                    : "Định dạng CIDR không hợp lệ. Ví dụ: 192.168.1.0/24"}
                </p>
              )}
              {type === "RANGE" && (
                <p className="text-muted-foreground text-sm mt-1">
                  CIDR /24 = 256 địa chỉ, /16 = 65,536 địa chỉ, /8 = 16,777,216 địa chỉ
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Mô tả</FieldLabel>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ví dụ: Wifi phòng lab A1, Mạng nội bộ trường..."
                rows={2}
              />
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="isActive">Trạng thái hoạt động</FieldLabel>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
              <p className="text-muted-foreground text-sm">
                {isActive
                  ? "IP này sẽ được sử dụng để kiểm tra"
                  : "IP này sẽ không được sử dụng để kiểm tra"}
              </p>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading || !isValidIP || !ipAddress}>
              {loading ? <Spinner /> : initialData ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
