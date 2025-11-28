import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";
import type {
  AdminOverviewResponse,
  ClassStatisticsResponse,
  SessionStatisticsResponse,
  WeeklyStatisticsResponse,
  WeeklyPeriod,
} from "./typing";

export async function getAdminOverview(token: string): Promise<AdminOverviewResponse> {
  return axios
    .get(`${APP_CONFIG_API_URL}/statistics/admin/overview`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}

export async function getClassStatistics(
  token: string,
  classId: string
): Promise<ClassStatisticsResponse> {
  return axios
    .get(`${APP_CONFIG_API_URL}/statistics/class/${classId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}

export async function getSessionStatistics(
  token: string,
  scheduleSessionId: string
): Promise<SessionStatisticsResponse> {
  return axios
    .get(`${APP_CONFIG_API_URL}/statistics/session/${scheduleSessionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}

export async function getWeeklyStatistics(
  token: string,
  options?: {
    period?: WeeklyPeriod;
    startDate?: string;
    endDate?: string;
  }
): Promise<WeeklyStatisticsResponse> {
  const params = new URLSearchParams();
  
  if (options?.period) {
    params.append("period", options.period);
  }
  if (options?.startDate) {
    params.append("startDate", options.startDate);
  }
  if (options?.endDate) {
    params.append("endDate", options.endDate);
  }

  const queryString = params.toString();
  const url = `${APP_CONFIG_API_URL}/statistics/admin/weekly${queryString ? `?${queryString}` : ""}`;

  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}
