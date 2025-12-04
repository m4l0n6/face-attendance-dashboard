import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";
import type { GetStudentsParams, GetStudentsResponse, PostFaceImages, PostFaceImagesResponse, PutFaceImages } from "./typing";

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

export async function getStudentByClassID(
  token: string,
  classId: string
): Promise<GetStudentsResponse> {
  return axios
    .get(`${APP_CONFIG_API_URL}/students/class/${classId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        classId,
      },
    })
    .then((response) => response.data);
}

export async function postFaceImage(
  token: string,
  params?: PostFaceImages
): Promise<PostFaceImagesResponse> {
  return axios
    .post(`${APP_CONFIG_API_URL}/api/admin/face-images`, params, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
}

export async function putFaceImage(
  token: string,
  id: string,
  params?: PutFaceImages
): Promise<PostFaceImagesResponse> {
  return axios
    .put(`${APP_CONFIG_API_URL}/api/admin/face-images/${id}`, params, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
}