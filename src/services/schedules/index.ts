import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";
import type { CreateScheduleRequest } from "./typing";

export async function createSchedule(
  token: string,
  data: CreateScheduleRequest
) {
  return axios
    .post(`${APP_CONFIG_API_URL}/schedules/create`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}

export async function getSchedulesByClass(token: string, classId: string) {
  return axios
    .get(`${APP_CONFIG_API_URL}/schedules/class/${classId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}

export async function deleteSchedule(token: string, scheduleId: string) {
  return axios
    .delete(`${APP_CONFIG_API_URL}/schedules/${scheduleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}