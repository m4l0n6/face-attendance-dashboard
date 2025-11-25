export interface Class {
  id: string;
  name: string;
  code: string;
}

export interface AttendanceSession {
  id: string;
  startAt: string;
  endAt: string;
  _count: {
    attendances: number;
  };
}

export interface ScheduleSession {
  id: string;
  scheduleId: string;
  sessionDate: string;
  sessionName: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  note: string | null;
  sessions: AttendanceSession[];
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  classId: string;
  name: string;
  startDate: string;
  endDate: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  room: string;
  description: string;
  type?: string;
  classCode?: string;
  courseName?: string;
  teacher?: string;
  topic?: string;
  status?: string;
  class?: Class;
  _count?: {
    scheduleSessions: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleWithSessions {
  schedule: Schedule;
  sessions: ScheduleSession[];
}

export interface CreateScheduleRequest {
  classId: string;
  name: string;
  startDate: string;
  endDate: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  room: string;
  description: string;
}

export interface UpdateScheduleRequest {
  name?: string;
  startDate?: string;
  endDate?: string;
  daysOfWeek?: number[];
  startTime?: string;
  endTime?: string;
  room?: string;
  description?: string;
}

export interface UpdateScheduleSessionRequest {
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  note?: string;
}

export interface UpdateScheduleSessionResponse {
  message: string;
  session: ScheduleSession;
}
