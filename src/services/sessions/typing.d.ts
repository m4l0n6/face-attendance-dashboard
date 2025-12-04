export interface Class {
  id: string;
  name: string;
  code: string;
}

export interface ScheduleSession {
  id: string;
  sessionName: string;
  sessionDate: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  note?: string | null;
  sessions: Array<{
    id: string;
    startAt: string;
    endAt: string;
  }>;
}

export interface Session {
  id: string;
  classId: string;
  scheduleSessionId: string;
  startAt: string;
  endAt?: string;
  class: Class;
  scheduleSession: ScheduleSession;
}

export interface StartSessionRequest {
  classId: string;
  scheduleSessionId: string;
}

export interface StartSessionResponse {
  message: string;
  session: Session;
}

export interface ScheduleWithSessions {
  schedule: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
    room: string;
    description: string;
    classId: string;
    class?: {
      id: string;
      name: string;
      code: string;
    };
  };
  sessions: ScheduleSession[];
}
