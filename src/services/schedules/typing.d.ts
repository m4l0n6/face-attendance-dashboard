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
  _count?: {
    scheduleSessions: number;
  };
  createdAt: string;
  updatedAt: string;
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
