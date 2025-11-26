export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

type NotificationType =
  | SCHEDULE_CREATED
  | SCHEDULE_UPDATED
  | SCHEDULE_CANCELLED
  | SESSION_REMINDER
  | ATTENDANCE_MARKED
  | ATTENDANCE_REMINDER
  | GENERAL;

export interface CreateNotificationForStudentRequest {
  studentId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

export interface CreateNotificationForClassRequest {
  classId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

