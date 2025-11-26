export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface CreateNotificationForStudentRequest {
  studentId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
}

export interface CreateNotificationForClassRequest {
  classId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
}
