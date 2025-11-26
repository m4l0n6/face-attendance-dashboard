import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/auth";
import { 
  createNotificationForStudent, 
  createNotificationForClass 
} from "@/services/notification";
import { toast } from "sonner";
import { useState } from "react";

const notificationSchema = z.object({
  targetType: z.enum(["student", "class"]),
  targetId: z.string().min(1, "ID không được để trống"),
  type: z.string().min(1, "Loại thông báo không được để trống"),
  title: z.string().min(1, "Tiêu đề không được để trống"),
  message: z.string().min(1, "Nội dung không được để trống"),
  dataKey: z.string().optional(),
  dataValue: z.string().optional(),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

interface NotificationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const notificationTypes = [
  { value: "SCHEDULE_CREATED", label: "Lịch học mới" },
  { value: "SCHEDULE_UPDATED", label: "Cập nhật lịch học" },
  { value: "SCHEDULE_CANCELLED", label: "Nghỉ học" },
  { value: "SESSION_REMINDER", label: "Nhắc nhở buổi học sắp diễn ra" },
  { value: "ATTENDANCE_MARKED", label: "Điểm danh thành công" },
  { value: "ATTENDANCE_REMINDER", label: "Nhắc nhở điểm danh/bổ sung ảnh" },
  { value: "GENERAL", label: "Chung" },
];

export function NotificationForm({ open, onOpenChange, onSuccess }: NotificationFormProps) {
  const { token } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      targetType: "student",
      targetId: "",
      type: "GENERAL",
      title: "",
      message: "",
      dataKey: "",
      dataValue: "",
    },
  });

  const targetType = form.watch("targetType");

  const onSubmit = async (values: NotificationFormValues) => {
    if (!token) {
      toast.error("Không tìm thấy token xác thực");
      return;
    }

    setIsSubmitting(true);

    try {
      const data: {
        type: string;
        title: string;
        message: string;
        data?: Record<string, string>;
      } = {
        type: values.type,
        title: values.title,
        message: values.message,
      };

      // Add optional data field if provided
      if (values.dataKey && values.dataValue) {
        data.data = {
          [values.dataKey]: values.dataValue,
        };
      }

      if (values.targetType === "student") {
        await createNotificationForStudent(token, {
          ...data,
          studentId: values.targetId,
        });
        toast.success("Đã tạo thông báo cho sinh viên");
      } else {
        await createNotificationForClass(token, {
          ...data,
          classId: values.targetId,
        });
        toast.success("Đã tạo thông báo cho lớp học");
      }

      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create notification:", error);
      toast.error("Không thể tạo thông báo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tạo thông báo mới</DialogTitle>
          <DialogDescription>
            Tạo thông báo cho sinh viên hoặc lớp học
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="targetType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gửi đến</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đối tượng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="student">Sinh viên</SelectItem>
                      <SelectItem value="class">Lớp học</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {targetType === "student" ? "Mã sinh viên" : "Mã lớp học"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        targetType === "student"
                          ? "Ví dụ: D23DCCN001"
                          : "Ví dụ: class-uuid-abc"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại thông báo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại thông báo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {notificationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tiêu đề thông báo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập nội dung thông báo"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="gap-4 grid grid-cols-2">
              <FormField
                control={form.control}
                name="dataKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khóa dữ liệu (tùy chọn)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: scheduleId" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá trị dữ liệu (tùy chọn)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: schedule-uuid-123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo..." : "Tạo thông báo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
