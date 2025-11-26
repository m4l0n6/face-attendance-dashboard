import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";
import type {
  CreateNotificationForStudentRequest,
  CreateNotificationForClassRequest,
} from "./typing";

export async function getNotifications(
  token: string,
  unreadOnly: boolean = true
) {
  return axios
    .get(`${APP_CONFIG_API_URL}/notifications`, {
      params: { unreadOnly },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}

export async function createNotificationForStudent(
  token: string,
  data: CreateNotificationForStudentRequest
) {
  return axios
    .post(`${APP_CONFIG_API_URL}/notifications/create-for-student`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}

export async function createNotificationForClass(
  token: string,
  data: CreateNotificationForClassRequest
) {
  return axios
    .post(`${APP_CONFIG_API_URL}/notifications/create-for-class`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}