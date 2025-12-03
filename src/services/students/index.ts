import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";
import type { GetStudentsParams, GetStudentsResponse } from "./typing";

export async function getAllStudents(
  token: string,
  params?: GetStudentsParams
): Promise<GetStudentsResponse> {
  return axios
    .get(`${APP_CONFIG_API_URL}/students`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        search: params?.search || undefined,
        classId: params?.classId || undefined,
      },
    })
    .then((response) => response.data);
}