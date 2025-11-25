import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";
import type { StartSessionRequest } from "./typing";

export async function startSession(token: string, data: StartSessionRequest) {
  return axios
    .post(`${APP_CONFIG_API_URL}/sessions/start`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}

export async function endSession(token: string, sessionId: string) {
  return axios
    .post(
      `${APP_CONFIG_API_URL}/sessions/${sessionId}/end`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.data);
}

export async function updateScheduleSession(
  token: string,
  sessionId: string,
  data: { status?: "SCHEDULED" | "COMPLETED" | "CANCELLED"; note?: string }
) {
  return axios
    .patch(`${APP_CONFIG_API_URL}/schedules/sessions/${sessionId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}

export async function getScheduleWithSessions(
  token: string,
  scheduleId: string
) {
  return axios
    .get(`${APP_CONFIG_API_URL}/schedules/${scheduleId}/sessions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}