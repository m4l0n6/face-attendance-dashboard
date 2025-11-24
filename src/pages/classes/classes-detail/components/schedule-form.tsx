import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateToISO(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toISOString().split("T")[0];
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

type ScheduleFormData = {
  name: string;
  startDate: string;
  endDate: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  room: string;
  description: string;
};

type ScheduleFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ScheduleFormData) => void;
  classId: string;
  initialData?: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
    room: string;
    description: string;
  } | null;
};

const daysOfWeekOptions = [
  { value: 1, label: "Thứ 2" },
  { value: 2, label: "Thứ 3" },
  { value: 3, label: "Thứ 4" },
  { value: 4, label: "Thứ 5" },
  { value: 5, label: "Thứ 6" },
  { value: 6, label: "Thứ 7" },
  { value: 0, label: "Chủ nhật" },
];

export function ScheduleForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: ScheduleFormProps) {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<ScheduleFormData>({
    defaultValues: {
      daysOfWeek: [],
    },
  });

  const selectedDays = watch("daysOfWeek") || [];
  
  const [openStartDate, setOpenStartDate] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [startMonth, setStartMonth] = useState<Date | undefined>();
  const [startValue, setStartValue] = useState("");

  const [openEndDate, setOpenEndDate] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [endMonth, setEndMonth] = useState<Date | undefined>();
  const [endValue, setEndValue] = useState("");

  // Load initial data when editing
  useEffect(() => {
    if (initialData && open) {
      setValue("name", initialData.name);
      setValue("daysOfWeek", initialData.daysOfWeek);
      setValue("startTime", initialData.startTime);
      setValue("endTime", initialData.endTime);
      setValue("room", initialData.room);
      setValue("description", initialData.description);
      
      const start = new Date(initialData.startDate);
      const end = new Date(initialData.endDate);
      
      setStartDate(start);
      setStartMonth(start);
      setStartValue(formatDate(start));
      
      setEndDate(end);
      setEndMonth(end);
      setEndValue(formatDate(end));
    } else if (!open) {
      // Reset when dialog closes
      reset();
      setStartDate(undefined);
      setEndDate(undefined);
      setStartValue("");
      setEndValue("");
    }
  }, [initialData, open, setValue, reset]);

  const handleFormSubmit = (data: ScheduleFormData) => {
    const submitData = {
      ...data,
      startDate: formatDateToISO(startDate),
      endDate: formatDateToISO(endDate),
    };
    onSubmit(submitData);
    reset();
    setStartDate(undefined);
    setEndDate(undefined);
    setStartValue("");
    setEndValue("");
  };

  const handleDayToggle = (day: number) => {
    const currentDays = selectedDays || [];
    if (currentDays.includes(day)) {
      setValue("daysOfWeek", currentDays.filter((d) => d !== day));
    } else {
      setValue("daysOfWeek", [...currentDays, day]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Chỉnh sửa lịch học" : "Tạo lịch học mới"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên lịch học</Label>
            <Input
              id="name"
              {...register("name", { required: "Tên lịch học là bắt buộc" })}
              placeholder="Học kỳ 1 2024-2025"
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="gap-4 grid grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <div className="relative flex gap-2">
                <Input
                  id="startDate"
                  value={startValue}
                  placeholder="Chọn ngày bắt đầu"
                  className="bg-background pr-10"
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setStartValue(e.target.value);
                    if (isValidDate(date)) {
                      setStartDate(date);
                      setStartMonth(date);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setOpenStartDate(true);
                    }
                  }}
                />
                <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="top-1/2 right-2 absolute size-6 -translate-y-1/2"
                    >
                      <CalendarIcon className="size-3.5" />
                      <span className="sr-only">Chọn ngày</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0 w-auto overflow-hidden"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                  >
                    <Calendar
                      mode="single"
                      selected={startDate}
                      captionLayout="dropdown"
                      month={startMonth}
                      onMonthChange={setStartMonth}
                      onSelect={(date) => {
                        setStartDate(date);
                        setStartValue(formatDate(date));
                        setOpenStartDate(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {!startDate && (
                <p className="text-destructive text-sm">
                  Ngày bắt đầu là bắt buộc
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <div className="relative flex gap-2">
                <Input
                  id="endDate"
                  value={endValue}
                  placeholder="Chọn ngày kết thúc"
                  className="bg-background pr-10"
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setEndValue(e.target.value);
                    if (isValidDate(date)) {
                      setEndDate(date);
                      setEndMonth(date);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setOpenEndDate(true);
                    }
                  }}
                />
                <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="top-1/2 right-2 absolute size-6 -translate-y-1/2"
                    >
                      <CalendarIcon className="size-3.5" />
                      <span className="sr-only">Chọn ngày</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0 w-auto overflow-hidden"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                  >
                    <Calendar
                      mode="single"
                      selected={endDate}
                      captionLayout="dropdown"
                      month={endMonth}
                      onMonthChange={setEndMonth}
                      onSelect={(date) => {
                        setEndDate(date);
                        setEndValue(formatDate(date));
                        setOpenEndDate(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {!endDate && (
                <p className="text-destructive text-sm">
                  Ngày kết thúc là bắt buộc
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Thứ trong tuần</Label>
            <div className="flex flex-wrap gap-4">
              {daysOfWeekOptions.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day.value}`}
                    checked={selectedDays.includes(day.value)}
                    onCheckedChange={() => handleDayToggle(day.value)}
                  />
                  <Label
                    htmlFor={`day-${day.value}`}
                    className="font-normal cursor-pointer"
                  >
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
            {selectedDays.length === 0 && (
              <p className="text-destructive text-sm">
                Vui lòng chọn ít nhất một ngày
              </p>
            )}
          </div>

          <div className="gap-4 grid grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="px-1">Giờ bắt đầu</Label>
              <Input
                id="startTime"
                type="time"
                step="1"
                className="[&::-webkit-calendar-picker-indicator]:hidden bg-background appearance-none [&::-webkit-calendar-picker-indicator]:appearance-none"
                {...register("startTime", {
                  required: "Giờ bắt đầu là bắt buộc",
                })}
              />
              {errors.startTime && (
                <p className="text-destructive text-sm">
                  {errors.startTime.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="px-1">Giờ kết thúc</Label>
              <Input
                id="endTime"
                type="time"
                step="1"
                className="[&::-webkit-calendar-picker-indicator]:hidden bg-background appearance-none [&::-webkit-calendar-picker-indicator]:appearance-none"
                {...register("endTime", { required: "Giờ kết thúc là bắt buộc" })}
              />
              {errors.endTime && (
                <p className="text-destructive text-sm">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Phòng học</Label>
            <Input
              id="room"
              {...register("room", { required: "Phòng học là bắt buộc" })}
              placeholder="A101"
            />
            {errors.room && (
              <p className="text-destructive text-sm">{errors.room.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Mô tả lịch học..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setStartDate(undefined);
                setEndDate(undefined);
                setStartValue("");
                setEndValue("");
                onOpenChange(false);
              }}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={selectedDays.length === 0 || !startDate || !endDate}>
              {initialData ? "Cập nhật" : "Tạo lịch học"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
