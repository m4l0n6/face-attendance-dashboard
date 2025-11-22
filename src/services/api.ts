import axios from 'axios';
import { APP_CONFIG_API_URL } from '../utils/constant';

export async function login(email: string, password: string) {
    return axios.post(`${APP_CONFIG_API_URL}/auth/login`, { email, password }).then(response => response.data);
}

export async function getMe(token: string) {
  return axios
    .get(`${APP_CONFIG_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}

export async function logout() {
    return axios.post(`${APP_CONFIG_API_URL}/auth/logout`).then(response => response.data);
}

export async function getAllClasses(token: string) {
  return axios
    .get(`${APP_CONFIG_API_URL}/classes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}
export async function createClass(token: string, data: { name: string; code: string; description: string }) {
  return axios
    .post(`${APP_CONFIG_API_URL}/classes`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}

export async function updateClass(token: string, id: string, data: { name: string; code: string; description: string }) {
  return axios
    .put(`${APP_CONFIG_API_URL}/classes/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}

export async function deleteClass(token: string, id: string) {
  return axios
    .delete(`${APP_CONFIG_API_URL}/classes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}

export async function importStudents(token: string, classId: string, students: Array<{ studentId: string; name: string; email: string }>) {
  return axios
    .post(`${APP_CONFIG_API_URL}/classes/${classId}/students/import`, { students }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}