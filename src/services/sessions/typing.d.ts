export interface Class {
  id: string;
  name: string;
  code: string;
}

export interface ScheduleSession {
  id: string;
  sessionName: string;
  sessionDate: string;
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
